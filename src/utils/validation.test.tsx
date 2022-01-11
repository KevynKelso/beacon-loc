import { validateDBRecord, validateMqttMessage } from "./validation"

test('validateDBRecord invalid mac', () => {
  const dbRecord: Record<string, any> = {
    bridgeLat: 0,
    bridgeLng: 0,
    rssi: 0,
    ts: 12345678901234,
    bridgeName: "test",
    beaconMac: 5,
  }
  const device = validateDBRecord(dbRecord)

  expect(device).toEqual(undefined)
})

test('validateDBRecord success', () => {
  const dbRecord: Record<string, any> = {
    bridgeLat: 0,
    bridgeLng: 0,
    rssi: 0,
    ts: 12345678901234,
    bridgeName: "test",
    beaconMac: "success",
  }
  const device = validateDBRecord(dbRecord)

  expect(device).not.toEqual(undefined)
  expect(device?.beaconMac).toEqual("success")
  expect(device?.bridgeName).toEqual("test")
})

test('mqtt message invalid json', () => {
  const mqttMessage = "bad json"
  const device = validateMqttMessage(mqttMessage)

  expect(device).toEqual(undefined)
})

test('mqtt message no timestamp', () => {
  const mqttMessage = '{"bridgeCoordinates": [0,0], "bridgeName": "test", "beaconMac": "1234", "rssi": -60}'
  const device = validateMqttMessage(mqttMessage)

  expect(device?.timestamp.toString().length).toEqual(14)
})

test('mqtt message no invalid type', () => {
  const mqttMessage = '{}'
  const device = validateMqttMessage(mqttMessage)

  expect(device).toEqual(undefined)
})

test('mqtt message bad coordinates', () => {
  const mqttMessage = '{"bridgeCoordinates": 1, "bridgeName": "test", "beaconMac": "1234", "rssi": -60, "timestamp": 12345678901234}'
  const device = validateMqttMessage(mqttMessage)

  expect(device).toEqual(undefined)
})
