import { PublishedDevice, DetectedBridge } from '../components/MqttListener'
import { processRawMessage, recalculate } from './messageProcessing'


const existingDevice1 = {
  beaconMac: "1234",
  bridgeCoordinates: [0, 0],
  bridgeName: "test",
  rssi: -60,
  timestamp: 0,
  seenTimestamp: 0,
}
const defaultSettings = {
  definitivelyHereRSSI: 0,
  globalTimeout: 0,
  localTimeout: 0,
  lostDistance: 0,
  sinceTime: 0,
}

// tests for function separateDevicesTooFarAway -------------------------------
test('inDevice is too far away from device in devices', () => {
  let updaterBridgesCalled = 0
  let updaterDevicesCalled = 0
  let bridges: DetectedBridge[] = []
  let devices: PublishedDevice[] = []
  const message = {
    beaconMac: "new device",
    bridgeCoordinates: [999, 999],
    bridgeName: "test",
    rssi: 0,
    timestamp: 0,
    seenTimestamp: 0,
  }


  function updaterBridges(a: DetectedBridge[]) {
    updaterBridgesCalled++
    bridges = a
  }
  function updaterDevices(b: PublishedDevice[]) {
    updaterDevicesCalled++
    devices = b
  }

  devices = [existingDevice1] // existing device will get left behind
  processRawMessage(devices, message, defaultSettings, updaterBridges, updaterDevices)

  expect(updaterBridgesCalled).toEqual(1)
  expect(updaterDevicesCalled).toEqual(1)
  expect(devices.length).toEqual(2)
  expect(devices[0].bridgeName).toEqual("Out of range: test")
  expect(devices[1].bridgeName).toEqual("test")
  expect(bridges.length).toEqual(2)
  expect(bridges[0].coordinates).toEqual([0, 0])
  expect(bridges[0].bridgeName).toEqual("Out of range: test")
  expect(bridges[1].coordinates).toEqual([999, 999])
  expect(bridges[1].bridgeName).toEqual("test")
})

test('teleporting device', () => {
  let updaterBridgesCalled = 0
  let updaterDevicesCalled = 0
  let bridges: DetectedBridge[] = []
  let devices: PublishedDevice[] = []
  const message = {
    beaconMac: "1234",
    bridgeCoordinates: [999, 999],
    bridgeName: "test",
    rssi: 0,
    timestamp: 0,
    seenTimestamp: 0,
  }


  function updaterBridges(a: DetectedBridge[]) {
    updaterBridgesCalled++
    bridges = a
  }
  function updaterDevices(b: PublishedDevice[]) {
    updaterDevicesCalled++
    devices = b
  }

  devices = [existingDevice1] // existing device will teleport
  processRawMessage(devices, message, defaultSettings, updaterBridges, updaterDevices)

  expect(updaterBridgesCalled).toEqual(1)
  expect(updaterDevicesCalled).toEqual(1)
  expect(devices.length).toEqual(1)
  expect(devices[0].bridgeName).toEqual("test")
  expect(bridges.length).toEqual(1)
  expect(bridges[0].coordinates).toEqual([999, 999])
  expect(bridges[0].bridgeName).toEqual("test")
})

// tests for function processRawMessage ---------------------------------------
test('message not in devices (1)', () => {
  let updaterBridgesCalled = 0
  let updaterDevicesCalled = 0
  let devices: PublishedDevice[] = []
  const message = {
    beaconMac: "1234",
    bridgeCoordinates: [0, 0],
    bridgeName: "test",
    rssi: 0,
    timestamp: 0,
    seenTimestamp: 0,
  }

  function updaterBridges(_: DetectedBridge[]) {
    updaterBridgesCalled++
  }
  function updaterDevices(b: PublishedDevice[]) {
    updaterDevicesCalled++
    devices = b
  }

  processRawMessage(devices, message, defaultSettings, updaterBridges, updaterDevices)

  expect(updaterBridgesCalled).toEqual(1)
  expect(updaterDevicesCalled).toEqual(1)
  expect(devices.length).toEqual(1)
  expect(devices[0].beaconMac).toEqual("1234")
  expect(devices[0].bridgeName).toEqual("test")
})

test('message def at this listener (2)', () => {
  let updaterBridgesCalled = 0
  let updaterDevicesCalled = 0
  const message = {
    beaconMac: "1234",
    bridgeCoordinates: [0, 0],
    bridgeName: "newBridgeName",
    rssi: -10,
    timestamp: 0,
    seenTimestamp: 0,
  }
  // start devices off with existing device so that there is a device already there
  let devices: PublishedDevice[] = [existingDevice1]
  defaultSettings.definitivelyHereRSSI = -10

  function updaterBridges(_: DetectedBridge[]) {
    updaterBridgesCalled++
  }
  function updaterDevices(b: PublishedDevice[]) {
    updaterDevicesCalled++
    devices = b
  }

  processRawMessage(devices, message, defaultSettings, updaterBridges, updaterDevices)
  defaultSettings.definitivelyHereRSSI = 0 // clean up the mutation of this global

  expect(updaterBridgesCalled).toEqual(1)
  expect(updaterDevicesCalled).toEqual(1)
  expect(devices.length).toEqual(1)
  expect(devices[0].beaconMac).toEqual("1234")
  expect(devices[0].bridgeName).toEqual("newBridgeName")
})

test('message has better rssi (3)', () => {
  let updaterBridgesCalled = 0
  let updaterDevicesCalled = 0
  const message = {
    beaconMac: "1234",
    bridgeCoordinates: [0, 0],
    bridgeName: "newBridgeName",
    rssi: -10,
    timestamp: 0,
    seenTimestamp: 0,
  }
  // start devices off with existing device so that there is a device already there
  let devices: PublishedDevice[] = [existingDevice1]

  function updaterBridges(_: DetectedBridge[]) {
    updaterBridgesCalled++
  }
  function updaterDevices(b: PublishedDevice[]) {
    updaterDevicesCalled++
    devices = b
  }

  processRawMessage(devices, message, defaultSettings, updaterBridges, updaterDevices)

  expect(updaterBridgesCalled).toEqual(1)
  expect(updaterDevicesCalled).toEqual(1)
  expect(devices.length).toEqual(1)
  expect(devices[0].beaconMac).toEqual("1234")
  expect(devices[0].bridgeName).toEqual("newBridgeName")
})

test('bridge name is the same (4)', () => {
  const existingDevice3 = {
    beaconMac: "1234",
    bridgeCoordinates: [0, 0],
    bridgeName: "test",
    rssi: -60,
    timestamp: 0,
    seenTimestamp: 0,
  }
  let updaterBridgesCalled = 0
  let updaterDevicesCalled = 0
  const message = {
    beaconMac: "1234",
    bridgeCoordinates: [0, 0],
    bridgeName: "test",
    rssi: -60,
    timestamp: 111111111,
    seenTimestamp: 0,
  }
  // start devices off with existing device so that there is a device already there
  let devices: PublishedDevice[] = [existingDevice3]

  function updaterBridges(_: DetectedBridge[]) {
    updaterBridgesCalled++
  }
  function updaterDevices(b: PublishedDevice[]) {
    updaterDevicesCalled++
    devices = b
  }

  processRawMessage(devices, message, defaultSettings, updaterBridges, updaterDevices)

  expect(updaterBridgesCalled).toEqual(1)
  expect(updaterDevicesCalled).toEqual(1)
  expect(devices.length).toEqual(1)
  expect(devices[0].beaconMac).toEqual("1234")
  expect(devices[0].bridgeName).toEqual("test")
  expect(devices[0].timestamp).toEqual(111111111)
})

test('timestamp is too old (5)', () => {
  let updaterBridgesCalled = 0
  let updaterDevicesCalled = 0
  const message = {
    beaconMac: "1234",
    bridgeCoordinates: [0, 0],
    bridgeName: "newInfoNotTimedOut",
    rssi: -60,
    timestamp: 1,
    seenTimestamp: 0,
  }
  // start devices off with existing device so that there is a device already there
  let devices: PublishedDevice[] = [existingDevice1]

  function updaterBridges(_: DetectedBridge[]) {
    updaterBridgesCalled++
  }
  function updaterDevices(b: PublishedDevice[]) {
    updaterDevicesCalled++
    devices = b
  }

  processRawMessage(devices, message, defaultSettings, updaterBridges, updaterDevices)

  expect(updaterBridgesCalled).toEqual(1)
  expect(updaterDevicesCalled).toEqual(1)
  expect(devices.length).toEqual(1)
  expect(devices[0].beaconMac).toEqual("1234")
  expect(devices[0].bridgeName).toEqual("newInfoNotTimedOut")
  expect(devices[0].timestamp).toEqual(1)
})

test('seen timestamp update (6)', () => {
  let updaterBridgesCalled = 0
  let updaterDevicesCalled = 0
  const message: PublishedDevice = {
    beaconMac: "1234",
    bridgeCoordinates: [0, 0],
    bridgeName: "updated... bad, something went wrong",
    rssi: -60,
    timestamp: 5, // this field should be the only thing that updates
    seenTimestamp: -1, // this field should not update
  }
  const existingDevice2: PublishedDevice = {
    beaconMac: "1234",
    bridgeCoordinates: [0, 0],
    bridgeName: "shouldNotUpdate",
    rssi: 0,
    timestamp: 99999999999999,
    seenTimestamp: 0,
  }
  // start devices off with existing device so that there is a device already there
  let devices: PublishedDevice[] = [existingDevice2]

  function updaterBridges(_: DetectedBridge[]) {
    updaterBridgesCalled++
  }
  function updaterDevices(b: PublishedDevice[]) {
    updaterDevicesCalled++
    devices = b
  }

  processRawMessage(devices, message, defaultSettings, updaterBridges, updaterDevices)

  expect(updaterBridgesCalled).toEqual(1)
  expect(updaterDevicesCalled).toEqual(1)
  expect(devices.length).toEqual(1)
  expect(devices[0].beaconMac).toEqual("1234")
  expect(devices[0].bridgeName).toEqual("shouldNotUpdate")
  expect(devices[0].timestamp).toEqual(99999999999999)
  expect(devices[0].seenTimestamp).toEqual(5)
})

// tests for function recalculate ---------------------------------------------
test('no records (1)', () => {
  let updaterBridgesCalled = 0
  let updaterDevicesCalled = 0

  const records: Record<string, any>[] = []
  let bridges: DetectedBridge[] = []
  let devices: PublishedDevice[] = []

  function updaterBridges(a: DetectedBridge[]) {
    updaterBridgesCalled++
    bridges = a
  }
  function updaterDevices(b: PublishedDevice[]) {
    updaterDevicesCalled++
    devices = b
  }

  recalculate(records, defaultSettings, updaterBridges, updaterDevices)
  expect(updaterBridgesCalled).toEqual(0)
  expect(updaterDevicesCalled).toEqual(0)
  expect(bridges.length).toEqual(0)
  expect(devices.length).toEqual(0)
})

test('invalid db record (2)', () => {
  let updaterBridgesCalled = 0
  let updaterDevicesCalled = 0

  const records: Record<string, any>[] = [{
    bridgeLat: undefined
  }]
  let bridges: DetectedBridge[] = []
  let devices: PublishedDevice[] = []

  function updaterBridges(a: DetectedBridge[]) {
    updaterBridgesCalled++
    bridges = a
  }
  function updaterDevices(b: PublishedDevice[]) {
    updaterDevicesCalled++
    devices = b
  }

  recalculate(records, defaultSettings, updaterBridges, updaterDevices)
  expect(updaterBridgesCalled).toEqual(1)
  expect(updaterDevicesCalled).toEqual(1)
  expect(bridges.length).toEqual(0)
  expect(devices.length).toEqual(0)
})

test('valid db record (3)', () => {
  let updaterBridgesCalled = 0
  let updaterDevicesCalled = 0

  const records: Record<string, any>[] = [{
    bridgeLat: 5,
    bridgeLng: 5,
    rssi: -60,
    ts: 12345678901234,
    bridgeName: "dbrecord",
    beaconMac: "dbmac",
  }]
  let bridges: DetectedBridge[] = []
  let devices: PublishedDevice[] = []

  function updaterBridges(a: DetectedBridge[]) {
    updaterBridgesCalled++
    bridges = a
  }
  function updaterDevices(b: PublishedDevice[]) {
    updaterDevicesCalled++
    devices = b
  }

  recalculate(records, defaultSettings, updaterBridges, updaterDevices)
  expect(updaterBridgesCalled).toEqual(1)
  expect(updaterDevicesCalled).toEqual(1)
  expect(bridges.length).toEqual(1)
  expect(devices.length).toEqual(1)
  expect(bridges[0].coordinates).toEqual([5, 5])
  expect(bridges[0]?.beacons?.length).toEqual(1)
  expect(devices[0].bridgeName).toEqual("dbrecord")
})
