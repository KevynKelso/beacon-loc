import { useEffect, useState, useCallback } from 'react'
import { useSubscription } from 'mqtt-react-hooks'

import BeaconMap from './BeaconMap'
import Environment from '../environment.config'

import { ISettings, DefaultSettings } from './settings/SettingsModal'
import { getCurrentTimestamp } from '../utils/timestamp'
import { processRawMessage, recalculate } from '../utils/messageProcessing'
import { validateMqttMessage } from '../utils/validation'
import { logError } from '../utils/emailLoggin'

//import { getDatabase, ref, push, set, onValue, query, orderByChild, startAt } from 'firebase/database'
//import { initializeApp } from 'firebase/app'

import { API } from 'aws-amplify'
import { GraphQLOptions, GraphQLResult } from '@aws-amplify/api-graphql';
import { createRawMqtt } from '../graphql/mutations'
import { listRawMqtts } from '../graphql/queries'
import { CreateRawMqttInput } from '../API'

interface MqttBridgePublish {
  beaconMac: string
  bridgeCoordinates: number[]
  bridgeName: string
  rssi: number
  timestamp: number
  pdu?: number
}

export interface PublishedDevice extends MqttBridgePublish {
  seenTimestamp: number
  timedOut?: boolean
}

export interface DBEntry {
  ts: number
  beaconMac: string
  rssi: number
  bridgeLat: number
  bridgeLng: number
  bridgeName: string
  pdu: number
}

export type PublishedDeviceUpdater = (devices: PublishedDevice[]) => void
export type DetectedBridgeUpdater = (bridges: DetectedBridge[]) => void

export interface DetectedBridge {
  coordinates: number[]
  bridgeName: string // this must be unique for each detected bridge
  beacons?: Beacon[]
}

export interface Beacon {
  beaconMac: string
  timestamp: number
  coordinates: number[]
}

// this component is a wrapper for the entire app which handles new mqtt message
// logic, querying the database, and keeping track of local state (message
// processing dependent on settings)
export default function MqttListener() {
  const [bridges, setBridges] = useState<DetectedBridge[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [previousMessage, setPreviousMessage] = useState<string>("")
  const [publishedDevices, setPublishedDevices] = useState<PublishedDevice[]>([])
  const [settings, setSettings] = useState<ISettings>(DefaultSettings)
  const [startup, setStartup] = useState<boolean>(true)
  const { message } = useSubscription(settings.subscribeTopic);
  // default exception handler
  window.onerror = function(message, source, lineno, colno, error) {
    logError(settings.errorReports, "Some error occured", `message: ${message} source: ${source} line#: ${lineno} col#: ${colno} error: ${error}`)
  }

  const fetchRecords = useCallback(async (since: number) => {
    setLoading(true)
    const options: GraphQLOptions = {
      query: listRawMqtts,
      variables: {
        filter: {
          ts: { gt: since.toString() },
        },
      }
    }
    const apiReq = async () => await API.graphql(options)
    apiReq()
      .then((result: any) => {
        recalculate(result?.data?.listRawMqtts?.items, settings, setBridges, setPublishedDevices)
      })
      .catch(
        (result) => logError(
          settings.errorReports, "Could not fetch records",
          `error: ${JSON.stringify(result)}`
        )
      )
      .finally(() => setLoading(false))
  }, [])

  const insertToDb = useCallback(async (message: PublishedDevice) => {
    const mqttMessage: CreateRawMqttInput = {
      bridgeLat: message.bridgeCoordinates[0],
      bridgeLng: message.bridgeCoordinates[1],
      ts: message.timestamp.toString(),
      bridgeName: message.bridgeName,
      beaconMac: message.beaconMac,
      rssi: message.rssi,
      pdu: 0,
    }

    const options: GraphQLOptions = {
      query: createRawMqtt,
      variables: { input: mqttMessage },
    }

    const apiReq = async () => await API.graphql(options)
    apiReq()
      .catch(
        (result) => logError(
          settings.errorReports, "Could not insert record into db",
          `MQTT Message: ${JSON.stringify(message)} error: ${JSON.stringify(result)}`
        )
      )
  }, [settings.errorReports])

  // logic for recalculating based on new data from database
  useEffect(() => {
    if (settings === DefaultSettings) return

    fetchRecords(settings.sinceTime)
  }, [settings, fetchRecords])

  // first database query upon client connection. Pulls last hour of info
  useEffect(() => {
    if (startup) {
      if (!settings.errorReports && Environment().environmentType === "production") {
        let newSettings = settings
        newSettings.errorReports = window.confirm("If a problem occurs, would you like to share crash information with EM Microelectronic?")
        setSettings(newSettings)
      }
      // fetchRecords from last hour '-1'
      fetchRecords(getCurrentTimestamp(-1))
      setStartup(false)
    }
  }, [settings, fetchRecords, startup])

  // logic for incomming messages:
  // Put each message into the database, then process it with (processRawMessage's)
  // logic. If settings are changed or old data needs to be pulled down from
  // the database, local state needs to be cleared and all messages must be
  // processed again.
  useEffect(() => {
    // reject bad messages, or the if the component just refreshed, don't do anything
    if (!message?.message || typeof message.message != "string" ||
      message.message === previousMessage
    ) {
      return
    }
    setPreviousMessage(message.message)

    const receivedMessage: PublishedDevice | undefined =
      validateMqttMessage(message.message, settings.errorReports)
    if (!receivedMessage) return

    insertToDb(receivedMessage)

    processRawMessage(
      publishedDevices, receivedMessage, settings,
      setBridges, setPublishedDevices
    )
  }, [message, insertToDb, previousMessage, publishedDevices, settings])

  return (
    <BeaconMap
      //@ts-ignore
      loading={loading}
      detectedBridges={bridges}
      setSettings={setSettings}
      errorReports={settings.errorReports}
    />
  )
}
