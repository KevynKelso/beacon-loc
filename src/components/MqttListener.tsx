import { useEffect, useState } from 'react'
import { useSubscription } from 'mqtt-react-hooks'
import { useEasybase } from 'easybase-react'


import { ISettings, DefaultSettings } from './SettingsModal'
import BeaconMap from './BeaconMap'
import { getCurrentTimestamp } from '../utils/timestamp'
import { validateMqttMessage } from '../utils/mqtt'
import { convertDevicesToBridges } from '../utils/devices'

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

export type PublishedDeviceUpdater = (device: PublishedDevice) => void

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

export default function MqttListener() {
  const [bridges, setBridges] = useState<DetectedBridge[]>([])
  const [easybaseData, setEasybaseData] = useState<number[] | Record<string, any>[]>([])
  const [publishedDevices, setPublishedDevices] = useState<PublishedDevice[]>([])
  const [settings, setSettings] = useState<ISettings>(DefaultSettings)

  const { db } = useEasybase()
  const { message } = useSubscription('test');

  function pushDevicesUpdate(device: PublishedDevice, newDevice: boolean, index?: number): void {
    let devices: PublishedDevice[] = publishedDevices

    if (newDevice) {
      setPublishedDevices([...devices, device])
      setBridges(convertDevicesToBridges([...devices, device]))
      return
    }

    if (index === undefined) {
      console.error("Must pass an index")
      return
    }

    devices[index] = device
    setPublishedDevices(devices)
    setBridges(convertDevicesToBridges(devices))
  }

  const fetchRecords = async () => {
    const ebData: number[] | Record<string, any>[] = await db("RAW MQTT").return().limit(10).all();
    setEasybaseData(ebData);
  }

  //useEffect(() => {
  //fetchRecords();
  //}, [])

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

  function isTooFarAway(lostDistance: number, a: PublishedDevice, b: PublishedDevice) {
    const deltaLat: number = a.listenerCoordinates[0] - b.listenerCoordinates[0]
    const deltaLng: number = a.listenerCoordinates[1] - b.listenerCoordinates[1]
    const distanceChanged = Math.sqrt(Math.pow(deltaLat, 2) + Math.pow(deltaLng, 2))

    return distanceChanged > lostDistance
  }

  // groups beacons into a new listener group if they are too far away from the inDevice
  function separateDevicesTooFarAway(inDevice: PublishedDevice) {
    // find all the published devices associated w/ this received message listener
    const bridgeDevices: PublishedDevice[] | undefined =
      publishedDevices.filter(
        (e: PublishedDevice) => e.listenerName === inDevice.listenerName
      )

    if (bridgeDevices?.length) {
      bridgeDevices.forEach((d: PublishedDevice) => {
        if (isTooFarAway(settings.lostDistance, d, inDevice)) {
          // this beacon is too far away from the listener and must be associated with it's
          // own location
          const newListenerName: string = `${inDevice.timestamp}`
          const index: number = publishedDevices.map(e => e.beaconMac).indexOf(d.beaconMac)
          let newDevice: PublishedDevice = publishedDevices[index]
          newDevice.listenerName = newListenerName
          pushDevicesUpdate(newDevice, false, index)
        }
      })
    }
  }

  function processRawMessage(message: PublishedDevice, updater: PublishedDeviceUpdater) {
  }

  // main logic for incomming messages
  useEffect(() => {
    // ideally, we put each received message into the database in order of time recieved,
    // then all this logic gets ran for each message since a certain time every time a setting changes.
    // That way we can re-run the logic for different settings. Everytime a new message comes in though,
    // we will still have to run this logic?
    //
    // reject bad messages
    if (!message?.message || typeof message.message != "string") return
    const receivedMessage: PublishedDevice | undefined = validateMqttMessage(message.message)
    if (!receivedMessage) return
    //insertToDb(receivedMessage)

    separateDevicesTooFarAway(receivedMessage)

    // check if beaconMac is in publishedDevices
    if (!publishedDevices.some((e: MqttBridgePublish) => e.beaconMac === receivedMessage.beaconMac)) {
      return pushDevicesUpdate(receivedMessage, true)
    }

    // from this point on, beacon is in publishedDevices already (we've seen it
    // before)
    const index: number = publishedDevices.map(e => e.beaconMac).indexOf(receivedMessage.beaconMac)

    // it is definitely at this listener if this is the case
    if (receivedMessage.rssi >= settings.definitivelyHereRSSI) {
      return pushDevicesUpdate(receivedMessage, false, index)
    }

    const publishedDevice: PublishedDevice = publishedDevices[index]

    // receive an update from the same device we've seen before
    if (receivedMessage.listenerName === publishedDevice.listenerName) {
      return pushDevicesUpdate(receivedMessage, false, index)
    }

    // larger rssi's take priority
    if (receivedMessage.rssi > publishedDevice.rssi) {
      return pushDevicesUpdate(receivedMessage, false, index)
    }

    // check if it's too old of information, if it is, we update with new info
    const currentTime: number = getCurrentTimestamp()
    if (publishedDevice.timestamp + settings.localTimeout < currentTime) {
      return pushDevicesUpdate(receivedMessage, false, index)
    }

    // we see the beacon, but it is not here
    publishedDevices[index].seenTimestamp = receivedMessage.timestamp
    setPublishedDevices(publishedDevices)
  }, [message])

  return (
    <BeaconMap
      //@ts-ignore
      detectedBridges={bridges}
      setSettings={setSettings}
    />
  )
}
