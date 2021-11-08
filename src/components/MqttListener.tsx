import React, { useEffect, useState } from "react";
import { useSubscription } from 'mqtt-react-hooks'

import Table from 'react-bootstrap/Table'

interface MqttBridgePublish {
  listenerCoordinates: number[]
  timestamp: number
  listenerName: string
  beaconMac: string
  rssi: number
}

interface PublishedDevice extends MqttBridgePublish {
  seenTimestamp: number
}

interface MqttListenerProps {
  debugMode: boolean
  definitivelyHereRSSI: number
  localTimeout: number
}

function getCurrentTimestamp(): number {
  const d: number = Date.now()
  const date = new Date(d)

  return parseInt(`${String(date.getFullYear()).padStart(4, '0')}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`)
}

export default function MqttListener(props: MqttListenerProps) {
  const { message } = useSubscription('test');
  const [publishedDevices, setPublishedDevices] = useState<PublishedDevice[]>([])
  const [numberOfReceivedMessages, setNumberOfReceivedMessages] = useState<number>(0)

  function validateMqttMessage(JSONMessage: string): PublishedDevice | undefined {
    const message = JSON.parse(JSONMessage)

    if (!message || !message.listenerCoordinates || !message.timestamp ||
      !message.listenerName || !message.beaconMac || !message.rssi) {
      console.log("Mqtt message is not of type MqttBridgePublish", message)
      return
    }

    if (message.listenerCoordinates.length != 2) {
      console.log("Invalid coordinates", message.listenerCoordinates)
      return
    }

    const publishMessage: PublishedDevice = {
      listenerCoordinates: message.listenerCoordinates,
      timestamp: message.timestamp,
      listenerName: message.listenerName,
      beaconMac: message.beaconMac,
      rssi: message.rssi,
      seenTimestamp: message.timestamp,
    }

    return publishMessage
  }

  useEffect(() => {
    if (!message?.message || typeof message.message != "string") return
    const receivedMessage: PublishedDevice | undefined = validateMqttMessage(message.message)
    if (!receivedMessage) return
    setNumberOfReceivedMessages(numberOfReceivedMessages + 1)

    // check if beaconMac is in publishedDevices
    if (!publishedDevices.some((e: MqttBridgePublish) => e.beaconMac === receivedMessage.beaconMac)) {
      publishedDevices.push(receivedMessage)
      setPublishedDevices(publishedDevices)
      return
    }

    // from this point on, beacon is in publishedDevices already (we've seen it
    // before
    const index: number = publishedDevices.map(e => e.beaconMac).indexOf(receivedMessage.beaconMac)

    // it is definately at this listener if this is the case
    if (receivedMessage.rssi >= props.definitivelyHereRSSI) {
      publishedDevices[index] = receivedMessage
      setPublishedDevices(publishedDevices)
      return
    }

    const publishedDevice: PublishedDevice = publishedDevices[index]

    // receive an update from the same device we've seen before
    if (receivedMessage.listenerName === publishedDevice.listenerName) {
      publishedDevices[index] = receivedMessage
      setPublishedDevices(publishedDevices)
      return
    }

    // larger rssi's take priority
    if (receivedMessage.rssi > publishedDevice.rssi) {
      publishedDevices[index] = receivedMessage
      setPublishedDevices(publishedDevices)
      return
    }

    // check if it's too old of information, if it is, we update with new info
    const currentTime: number = getCurrentTimestamp()
    if (publishedDevice.timestamp + props.localTimeout < currentTime) {
      publishedDevices[index] = receivedMessage
      setPublishedDevices(publishedDevices)
      return
    }

    // we see the beacon, but it is not here
    publishedDevices[index].seenTimestamp = receivedMessage.timestamp
    setPublishedDevices(publishedDevices)
  }, [message])

  return (
    <>
      <p>Received Messages {numberOfReceivedMessages}</p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>index</th>
            <th>mac</th>
            <th>coordinates</th>
            <th>timestamp</th>
            <th>rssi</th>
            <th>bridge</th>
          </tr>
        </thead>
        <tbody>
          {publishedDevices.map((element: MqttBridgePublish, idx: number) => {
            return (
              <tr>
                <td>{idx}</td>
                <td>{element.beaconMac}</td>
                <td>{element.listenerCoordinates[0]}, {element.listenerCoordinates[1]}</td>
                <td>{element.timestamp}</td>
                <td>{element.rssi}</td>
                <td>{element.listenerName}</td>
              </tr>
            )
          })
          }
        </tbody>
      </Table>
    </>
  );
}
