import { PublishedDevice } from '../components/MqttListener'

export function validateDBRecord(record: Record<string, any>): PublishedDevice | undefined {
  if (!record?.listenerlat || !record?.listenerlon || !record?.ts || !record?.listenername || !record?.beaconmac || !record?.rssi) {
    console.error("Database contains invalid data", record)
    return
  }

  const databaseDevice: PublishedDevice = {
    beaconMac: record.beaconmac,
    listenerCoordinates: [record.listenerlat, record.listenerlon],
    listenerName: record.listenername,
    rssi: record.rssi,
    seenTimestamp: record.ts,
    timestamp: record.ts,
  }

  return databaseDevice
}

export function validateMqttMessage(JSONMessage: string): PublishedDevice | undefined {
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
