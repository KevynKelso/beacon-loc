import { convertDevicesToBridges } from "./devices"
import { DetectedBridge, PublishedDevice } from '../components/MqttListener'

test('two devices at the same bridge', () => {
  const device1: PublishedDevice = {
    bridgeName: "test",
    bridgeCoordinates: [0, 0],
    beaconMac: "1234",
    timestamp: 0,
    rssi: 0,
    seenTimestamp: 0,
  }
  const device2: PublishedDevice = {
    bridgeName: "test",
    bridgeCoordinates: [0, 0],
    beaconMac: "1234",
    timestamp: 0,
    rssi: 0,
    seenTimestamp: 0,
  }

  const devices: PublishedDevice[] = [device1, device2]
  const bridges: DetectedBridge[] = convertDevicesToBridges(devices)

  expect(bridges.length).toEqual(1)
  expect(bridges[0]?.beacons?.length).toEqual(2)
})
