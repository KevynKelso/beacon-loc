import { useEffect, useState } from 'react'
import { useSubscription } from 'mqtt-react-hooks'
import { useEasybase } from 'easybase-react'

import BeaconMap from './BeaconMap'

import { ISettings, DefaultSettings } from './SettingsModal'
import { getCurrentTimestamp } from '../utils/timestamp'
import { processRawMessage, recalculate } from '../utils/messageProcessing'
import { validateMqttMessage } from '../utils/validation'

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
  bridgeLon: number
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
  const [previousMessage, setPreviousMessage] = useState<string>("")
  const [publishedDevices, setPublishedDevices] = useState<PublishedDevice[]>([])
  const [settings, setSettings] = useState<ISettings>(DefaultSettings)
  const [startupQuery, setStartupQuery] = useState<boolean>(true)
  console.log(publishedDevices)

  const { db, e } = useEasybase()
  const { message } = useSubscription('test');

  const fetchRecords = async (since: number) => {
    return await db("RAW MQTT")
      .return()
      .where(e.gt("ts", since))
      .all() as Record<string, any>[]
  }

  async function insertToDb(message: PublishedDevice) {
    const dbEntry: DBEntry = {
      bridgeLat: message.bridgeCoordinates[0],
      bridgeLon: message.bridgeCoordinates[1],
      ts: message.timestamp,
      bridgeName: message.bridgeName,
      beaconMac: message.beaconMac,
      rssi: message.rssi,
      pdu: 0,
    }

    try {
      await db('RAW MQTT').insert(dbEntry).one(); // Inserts, updates, and deletes will refresh the `frame` below
    } catch (e) {
      console.error(e)
    }
  }

  //useEffect(() => {
  //console.log(settings.globalTimeout)
  //// this function will run every few minutes. The *1e3 is to convert seconds to ms for setInterval
  //const interval = setInterval(() =>
  //timeoutDevices(publishedDevices, settings.globalTimeout, setBridges, setPublishedDevices),
  //settings.globalTimeout * 1e3,
  //)
  //return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  //})

  // logic for recalculating based on new data from database
  useEffect(() => {
    if (settings === DefaultSettings) return

    fetchRecords(settings.sinceTime).then((records) => recalculate(records, settings, setBridges, setPublishedDevices))
  }, [settings])

  // first database query upon client connection. Pulls last hour of info
  useEffect(() => {
    if (startupQuery) {
      // fetchRecords from last hour '-1'
      fetchRecords(getCurrentTimestamp(-1)).then((records) => recalculate(records, settings, setBridges, setPublishedDevices))
      setStartupQuery(false)
    }
  }, [settings])

  // logic for incomming messages:
  // Put each message into the database, then process it with (processRawMessage's)
  // logic. If settings are changed or old data needs to be pulled down from
  // the database, local state needs to be cleared and all messages must be
  // processed again.
  useEffect(() => {
    // reject bad messages, or the if the component just refreshed, don't do anything
    if (!message?.message || typeof message.message != "string" || message.message === previousMessage) return
    setPreviousMessage(message.message)

    const receivedMessage: PublishedDevice | undefined = validateMqttMessage(message.message)
    if (!receivedMessage) return

    insertToDb(receivedMessage)

    processRawMessage(
      publishedDevices, receivedMessage, settings,
      setBridges, setPublishedDevices
    )
  }, [message])

  return (
    <BeaconMap
      //@ts-ignore
      detectedBridges={bridges}
      setSettings={setSettings}
    />
  )
}
