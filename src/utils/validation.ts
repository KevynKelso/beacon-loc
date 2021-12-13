import { PublishedDevice } from '../components/MqttListener'

export function validateDBRecord(record: Record<string, any>): PublishedDevice | undefined {
  if (!record?.bridgelat || !record?.bridgelon || !record?.ts || !record?.bridgename || !record?.beaconmac || !record?.rssi) {
    console.error("Database contains invalid data", record)
    return
  }

  const databaseDevice: PublishedDevice = {
    beaconMac: record.beaconmac,
    bridgeCoordinates: [record.bridgelat, record.bridgelon],
    bridgeName: record.bridgename,
    rssi: record.rssi,
    seenTimestamp: record.ts,
    timestamp: record.ts,
  }

  return databaseDevice
}

export function validateMqttMessage(JSONMessage: string): PublishedDevice | undefined {
  const message = JSON.parse(JSONMessage)

  if (!message || !message.bridgeCoordinates || !message.timestamp ||
    !message.bridgeName || !message.beaconMac || !message.rssi) {
    console.error("Mqtt message is not of type MqttBridgePublish", message)
    return
  }

  if (message.bridgeCoordinates.length != 2) {
    console.error("Invalid coordinates", message.bridgeCoordinates)
    return
  }

  const publishMessage: PublishedDevice = {
    beaconMac: message.beaconMac.toString(),
    bridgeCoordinates: message.bridgeCoordinates,
    bridgeName: message.bridgeName.toString(),
    rssi: message.rssi,
    seenTimestamp: message.timestamp,
    timestamp: message.timestamp,
  }

  return publishMessage
}
