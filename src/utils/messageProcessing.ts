import { getCurrentTimestamp } from './timestamp'
import { PublishedDevice, DetectedBridge, PublishedDeviceUpdater, DetectedBridgeUpdater } from '../components/MqttListener'
import { ISettings } from '../components/SettingsModal'
import { convertDevicesToBridges } from './devices'
import { validateDBRecord } from './validation'

function pushDevicesUpdate(
  device: PublishedDevice,
  devices: PublishedDevice[],
  index: number,
  isNewDevice: boolean,
  updaterBridges: DetectedBridgeUpdater,
  updaterDevices: PublishedDeviceUpdater,
): void {
  if (isNewDevice) {
    updaterDevices([...devices, device])
    updaterBridges(convertDevicesToBridges([...devices, device]))
    return
  }

  devices[index] = device
  updaterDevices(devices)
  updaterBridges(convertDevicesToBridges(devices))
}

// calculates pythagoean distance based on lat, lng coords, returns whether or
// not it's too far away
function isTooFarAway(lostDistance: number, a: PublishedDevice, b: PublishedDevice) {
  const deltaLat: number = a.bridgeCoordinates[0] - b.bridgeCoordinates[0]
  const deltaLng: number = a.bridgeCoordinates[1] - b.bridgeCoordinates[1]
  const distanceChanged = Math.sqrt(Math.pow(deltaLat, 2) + Math.pow(deltaLng, 2))

  return distanceChanged > lostDistance
}

// groups beacons into a new listener group if they are too far away from the inDevice
function separateDevicesTooFarAway(
  inDevice: PublishedDevice,
  devices: PublishedDevice[],
  settings: ISettings,
  updaterBridges: DetectedBridgeUpdater,
  updaterDevices: PublishedDeviceUpdater,
) {
  // find all the published devices associated w/ this received message listener
  const bridgeDevices: PublishedDevice[] | undefined =
    devices.filter(
      (e: PublishedDevice) => e.bridgeName === inDevice.bridgeName
    )

  if (bridgeDevices?.length) {
    bridgeDevices.forEach((d: PublishedDevice) => {
      if (isTooFarAway(settings.lostDistance, d, inDevice)) {
        // this beacon is too far away from the listener and must be associated with it's
        // own location
        const newListenerName: string = `Out of range: ${d.bridgeName}`
        const index: number = devices.map(e => e.beaconMac).indexOf(d.beaconMac)
        let newDevice: PublishedDevice = devices[index]
        newDevice.bridgeName = newListenerName
        pushDevicesUpdate(newDevice, devices, index, false, updaterBridges, updaterDevices)
      }
    })
  }
}

export function processRawMessage(
  devices: PublishedDevice[],
  message: PublishedDevice,
  settings: ISettings,
  updaterBridges: DetectedBridgeUpdater,
  updaterDevices: PublishedDeviceUpdater,
) {
  console.log(message)
  separateDevicesTooFarAway(message, devices, settings, updaterBridges, updaterDevices)

  // check if beaconMac is in devices
  if (!devices.some((e: PublishedDevice) => e.beaconMac === message.beaconMac)) {
    return pushDevicesUpdate(message, devices, -1, true, updaterBridges, updaterDevices)
  }

  // from this point on, beacon is in devices already (we've seen it
  // before)
  const index: number = devices.map(e => e.beaconMac).indexOf(message.beaconMac)

  // it is definitely at this listener if this is the case
  if (message.rssi >= settings.definitivelyHereRSSI) {
    return pushDevicesUpdate(message, devices, index, false, updaterBridges, updaterDevices)
  }

  const publishedDevice: PublishedDevice = devices[index]

  // receive an update from the same device we've seen before
  if (message.bridgeName === publishedDevice.bridgeName) {
    return pushDevicesUpdate(message, devices, index, false, updaterBridges, updaterDevices)
  }

  // larger rssi's take priority
  if (message.rssi > publishedDevice.rssi) {
    return pushDevicesUpdate(message, devices, index, false, updaterBridges, updaterDevices)
  }

  // check if it's too old of information, if it is, we update with new info
  const currentTime: number = getCurrentTimestamp()
  if (publishedDevice.timestamp + settings.localTimeout < currentTime) {
    return pushDevicesUpdate(message, devices, index, false, updaterBridges, updaterDevices)
  }

  // we see the beacon, but it is not here
  devices[index].seenTimestamp = message.timestamp
  updaterDevices(devices)
}

export function recalculate(
  records: Record<string, any>[],
  settings: ISettings,
  updaterBridges: DetectedBridgeUpdater,
  updaterDevices: PublishedDeviceUpdater
) {
  console.log(records)
  // reset devices and bridges
  updaterBridges([])
  updaterDevices([])

  if (!records.length) return

  // variables for rebuilding state. We can't use existing state because we
  // need the loop below to happen synchronously
  let newPublishedDevices: PublishedDevice[] = []
  let newBridges: DetectedBridge[] = []

  // callbacks for building new state
  function setNewBridges(bridges: DetectedBridge[]) {
    newBridges = bridges
  }
  function setNewPublishedDevices(devices: PublishedDevice[]) {
    newPublishedDevices = devices
  }

  // processRawMessage for every element returned in the database
  records.forEach((record: Record<string, any>) => {
    // need to build the array of publishedDevices first, then set the state
    const device: PublishedDevice | undefined = validateDBRecord(record)
    console.log(device)
    if (!device) return
    processRawMessage(
      newPublishedDevices, device, settings,
      setNewBridges, setNewPublishedDevices
    )
  })

  // reset react state
  console.log(newPublishedDevices)
  updaterBridges(newBridges)
  updaterDevices(newPublishedDevices)
}

//export function timeoutDevices(
  //devices: PublishedDevice[],
  //globalTimeout: number, // this must be in seconds
  //updaterBridges: DetectedBridgeUpdater,
  //updaterDevices: PublishedDeviceUpdater,
//) {
  //const currentTime: number = getCurrentTimestamp()
  //let newPublishedDevices: PublishedDevice[] = []
  ////let newBridges: DetectedBridge[] = []

  //devices.forEach((device: PublishedDevice) => {
    //// global timeout is in seconds, so should be able to determine if device
    //// is timed out by subtracting current time - timestamp and seeing if it's
    //// greater than the global timeout
    //if (currentTime - device.seenTimestamp > globalTimeout) {
      //let newDevice: PublishedDevice = device
      //newDevice.timedOut = true
      //newPublishedDevices = [...newPublishedDevices, newDevice]
      //return
    //}
    //newPublishedDevices = [...newPublishedDevices, device]
  //})



