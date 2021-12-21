import { PublishedDevice } from '../components/MqttListener'
import { getCurrentTimestamp } from '../utils/timestamp'

export function validateDBRecord(record: Record<string, any>): PublishedDevice | undefined {
  if (
    typeof record?.bridgelat === "undefined" ||
    typeof record?.bridgelon === "undefined" ||
    typeof record?.rssi === "undefined" ||
    !record?.ts || !record?.bridgename || !record?.beaconmac
  ) {
    console.warn("Database contains invalid data", record)
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
  let message
  try {
    message = JSON.parse(JSONMessage)
    if (!message) throw new Error("No message")
  }
  catch (e) {
    console.warn(e)
    console.warn("invalid message", JSONMessage)
    return
  }

  if (!message.timestamp) message.timestamp = getCurrentTimestamp()

  if (!message || !message.bridgeCoordinates || !message.bridgeName ||
    !message.beaconMac || typeof message.rssi === "undefined") {
    console.warn("Mqtt message is not of type MqttBridgePublish", message)
    return
  }

  if (message.bridgeCoordinates.length !== 2) {
    console.warn("Invalid coordinates", message.bridgeCoordinates)
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
