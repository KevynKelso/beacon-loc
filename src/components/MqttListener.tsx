import { useEffect, useState } from "react";
import { useSubscription } from 'mqtt-react-hooks'

import { ISettings, DefaultSettings } from './SettingsModal'
import BeaconMap from './BeaconMap'
import { getCurrentTimestamp } from "../utils/timestamp"

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
  const { message } = useSubscription('test');
  const [publishedDevices, setPublishedDevices] = useState<PublishedDevice[]>([])
  const [bridges, setBridges] = useState<DetectedBridge[]>([])
  //console.log(publishedDevices)

  const [settings, setSettings] = useState<ISettings>(DefaultSettings)

  function validateMqttMessage(JSONMessage: string): PublishedDevice | undefined {
    const message = JSON.parse(JSONMessage)

    if (!message || !message.listenerCoordinates || !message.timestamp ||
      !message.listenerName || !message.beaconMac || !message.rssi) {
      console.error("Mqtt message is not of type MqttBridgePublish", message)
      return
    }

    if (message.listenerCoordinates.length != 2) {
      console.error("Invalid coordinates", message.listenerCoordinates)
      return
    }

    const publishMessage: PublishedDevice = {
      beaconMac: message.beaconMac,
      listenerCoordinates: message.listenerCoordinates,
      listenerName: message.listenerName.toString(),
      rssi: message.rssi,
      seenTimestamp: message.timestamp,
      timestamp: message.timestamp,
    }

    return publishMessage
  }

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

  // main logic for incomming messages
  useEffect(() => {
    // logic for rejecting bad messages
    if (!message?.message || typeof message.message != "string") return
    const receivedMessage: PublishedDevice | undefined = validateMqttMessage(message.message)
    if (!receivedMessage) return

    // have we seen this bridge before?
    const seenBridge: DetectedBridge | undefined = bridges.find((e: DetectedBridge) => e.listenerName === receivedMessage.listenerName)
    if (seenBridge) {
      // has this bridge's location changed significantly in comparison to the beacons he's seen before?
      seenBridge.beacons?.forEach((b: Beacon) => {
        // TODO: add significant location change to the settings
        const significantLocationChange: number = 0.01 // this is approximately 1km
        const deltaLat: number = b.coordinates[0] - seenBridge.coordinates[0]
        const deltaLng: number = b.coordinates[1] - seenBridge.coordinates[1]
        const distanceChanged = Math.sqrt(Math.pow(deltaLat, 2) + Math.pow(deltaLng, 2))

        // TODO: this is 1 cycle behind
        if (distanceChanged > significantLocationChange) {
          const newListenerName: string = `${receivedMessage.timestamp}`
          const index: number = publishedDevices.map(e => e.beaconMac).indexOf(b.beaconMac)
          let newDevice: PublishedDevice = publishedDevices[index]
          newDevice.listenerName = newListenerName
          pushDevicesUpdate(newDevice, false, index)
        }
      })
    }

    // check if beaconMac is in publishedDevices
    if (!publishedDevices.some((e: MqttBridgePublish) => e.beaconMac === receivedMessage.beaconMac)) {
      return pushDevicesUpdate(receivedMessage, true)
    }

    // from this point on, beacon is in publishedDevices already (we've seen it
    // before
    const index: number = publishedDevices.map(e => e.beaconMac).indexOf(receivedMessage.beaconMac)

    // it is definately at this listener if this is the case
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


  function convertDevicesToBridges(devices: PublishedDevice[]): DetectedBridge[] {
    let detectedBridges: DetectedBridge[] = []
    // filter out only unique names to add to detected bridges
    devices.forEach((device: PublishedDevice) => {
      // determine if this device is in detectedBridges
      const i: number = detectedBridges.findIndex((listener: DetectedBridge) => listener.listenerName === device.listenerName);
      // TODO: possibly convert the mac address to a useful name for the beacon here
      if (i <= -1) {
        // it is not, so make a new bridge entry
        return detectedBridges.push(
          {
            listenerName: device.listenerName,
            coordinates: device.listenerCoordinates,
            beacons: [{
              beaconMac: device.beaconMac,
              timestamp: device.seenTimestamp,
              coordinates: device.listenerCoordinates,
            }],
          })
      }
      if (!detectedBridges[i].beacons) return

      // already in there, add this device to the bridge
      detectedBridges[i].beacons?.push(
        {
          beaconMac: device.beaconMac,
          timestamp: device.seenTimestamp,
          coordinates: device.listenerCoordinates,
        })

      // get the most recently seen device's coordinates
      const mostRecentBeacon: Beacon | undefined = detectedBridges[i].beacons?.reduce(
        (previousBeacon, currentBeacon) =>
          previousBeacon.timestamp > currentBeacon.timestamp ? previousBeacon : currentBeacon
      )
      if (mostRecentBeacon) {
        detectedBridges[i].coordinates = mostRecentBeacon.coordinates
      }
    })

    // TODO: potentially sort this stuff
    // sorted by name
    //detectedBridges.sort((a, b) => (a.listenerName > b.listenerName) ? 1 : ((b.listenerName > a.listenerName) ? -1 : 0))

    return detectedBridges
  }

  return (
    <BeaconMap
      //@ts-ignore
      detectedBridges={bridges}
      setSettings={setSettings}
    />
  )
}
