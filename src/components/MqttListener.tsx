import { useEffect, useState } from 'react'
import { useSubscription } from 'mqtt-react-hooks'
import { useEasybase } from 'easybase-react'

import { ISettings, DefaultSettings } from './SettingsModal'
import BeaconMap from './BeaconMap'
import { validateMqttMessage } from '../utils/validation'
import { processRawMessage, recalculate } from '../utils/messageProcessing'

interface MqttBridgePublish {
  beaconMac: string
  listenerCoordinates: number[]
  listenerName: string
  rssi: number
  timestamp: number
}

export interface PublishedDevice extends MqttBridgePublish {
  seenTimestamp: number
}

export type PublishedDeviceUpdater = (devices: PublishedDevice[]) => void
export type DetectedBridgeUpdater = (bridges: DetectedBridge[]) => void

export interface DetectedBridge {
  coordinates: number[]
  listenerName: string // this must be unique for each detected bridge
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

  const { db, e } = useEasybase()
  const { message } = useSubscription('test');

  const fetchRecords = async (since: number) => {
    return await db("RAW MQTT")
      .return()
      .where(e.gt("ts", since))
      .all() as Record<string, any>[]
  }

  useEffect(() => {
    if (settings === DefaultSettings) return

    console.log("fetch records since", settings.sinceTime)
    fetchRecords(settings.sinceTime).then((records) => recalculate(records, settings, setBridges, setPublishedDevices))
    console.log(publishedDevices)
  }, [settings])

  async function insertToDb(message: PublishedDevice) {
    try {
      await db('RAW MQTT').insert({
        listenerLat: message.listenerCoordinates[0],
        listenerLon: message.listenerCoordinates[1],
        ts: message.timestamp,
        listenerName: message.listenerName,
        beaconMac: message.beaconMac,
        rssi: message.rssi,
      }).one(); // Inserts, updates, and deletes will refresh the `frame` below
    } catch (e) {
      console.error(e)
    }
  }

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
