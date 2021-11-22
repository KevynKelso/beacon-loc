import { useEffect, useState } from "react";
import { useSubscription } from 'mqtt-react-hooks'

import BeaconMap, { DetectedBridge } from './BeaconMap'
import { ISettings, DefaultSettings } from './SettingsModal'

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

function getCurrentTimestamp(): number {
  const d: number = Date.now()
  const date = new Date(d)

  return parseInt(`${String(date.getFullYear()).padStart(4, '0')}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`)
}

export default function MqttListener() {
  const { message } = useSubscription('test');
  //const [numberOfReceivedMessages, setNumberOfReceivedMessages] = useState<number>(0)
  const [publishedDevices, setPublishedDevices] = useState<PublishedDevice[]>([])
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
      return
    }

    if (index === undefined) {
      console.error("Must pass an index")
      return
    }

    devices[index] = device
    setPublishedDevices(devices)
  }

  // main logic for incomming messages
  useEffect(() => {
    if (!message?.message || typeof message.message != "string") return
    const receivedMessage: PublishedDevice | undefined = validateMqttMessage(message.message)
    if (!receivedMessage) return
    //setNumberOfReceivedMessages(numberOfReceivedMessages + 1)

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

  //let detectedDevicesSum: number = 0

  function setDetectedBridges(devices: PublishedDevice[]): DetectedBridge[] {
    let detectedBridges: DetectedBridge[] = []
    // filter out only unique names to add to detected bridges
    devices.forEach((device: PublishedDevice) => {
      // determine if this device is in detectedBridges
      const i: number = detectedBridges.findIndex((listener: DetectedBridge) => listener.listenerName == device.listenerName);
      if (i <= -1) {
        // it is not, so make a new bridge entry
        return detectedBridges.push(
          {
            listenerName: device.listenerName,
            coordinates: device.listenerCoordinates,
            // TODO: possibly convert the mac address to a useful name for the beacon here
            beacons: [{ identifier: device.beaconMac, timestamp: device.seenTimestamp }],
          });
      }
      // already in there, update the information for this device
      detectedBridges[i].beacons?.push({ identifier: device.beaconMac, timestamp: device.seenTimestamp })
      //detectedDevicesSum++
    })

    // sorted by name
    detectedBridges.sort((a, b) => (a.listenerName > b.listenerName) ? 1 : ((b.listenerName > a.listenerName) ? -1 : 0))

    return detectedBridges
  }

  //let detectedBridges: DetectedBridge[] = setDetectedBridges(props.devices)
  //detectedDevicesSum += detectedBridges.length

  //<BeaconMap
  //setSettings={setSettings}
  ////detectedBridges={setDetectedBridges(publishedDevices)}
  //getDetectedBridges={() => setDetectedBridges(publishedDevices)}
  ///>

  return (
    <TestBeaconMap />
  )
}
