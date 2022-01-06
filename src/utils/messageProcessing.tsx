import { getCurrentTimestamp } from './timestamp'
import { PublishedDevice, DetectedBridge, PublishedDeviceUpdater, DetectedBridgeUpdater } from '../components/MqttListener'
import { ISettings } from '../components/settings/SettingsModal'
import { convertDevicesToBridges } from './devices'
import { validateDBRecord } from './validation'

// util function for updating the array of devices
function pushDevicesUpdate(
  device: PublishedDevice,
  devices: PublishedDevice[],
  index: number,
  isNewDevice: boolean,
): PublishedDevice[] {
  if (isNewDevice) {
    return [...devices, device]
  }

  devices[index] = device

  return devices
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
  //updaterBridges: DetectedBridgeUpdater,
  //updaterDevices: PublishedDeviceUpdater,
): PublishedDevice[] {
  // find all the published devices associated w/ this received message listener
  const bridgeDevices: PublishedDevice[] | undefined =
    devices.filter(
      (e: PublishedDevice) => e.bridgeName === inDevice.bridgeName
    )

  if (bridgeDevices?.length) {
    bridgeDevices.forEach((d: PublishedDevice) => {
      if (isTooFarAway(settings.lostDistance, d, inDevice)) {
        // this beacon is too far away from the bridge and must be associated with it's
        // own location, to do that we give it a new bridgeName
        const newBridgeName: string = `Out of range: ${d.bridgeName}`
        const index: number = devices.map(e => e.beaconMac).indexOf(d.beaconMac)
        let newDevice: PublishedDevice = devices[index]
        newDevice.bridgeName = newBridgeName
        devices = pushDevicesUpdate(newDevice, devices, index, false)
      }
    })
  }

  return devices
}

// this function must only be called once in processRawMessage since the updater
// bridges and devices are async state calls which get queued and may be processed
// in an unpredictable order
// https://reactjs.org/docs/state-and-lifecycle.html
function updateReactState(
  updaterBridges: DetectedBridgeUpdater,
  updaterDevices: PublishedDeviceUpdater,
  devices: PublishedDevice[]
) {
  updaterDevices(devices)
  updaterBridges(convertDevicesToBridges(devices))
}


// this function is the main logic for determining where each beacon is.
// see /docs/processRawMessage.png for a logic diagram
export function processRawMessage(
  devices: PublishedDevice[],
  message: PublishedDevice,
  settings: ISettings,
  updaterBridges: DetectedBridgeUpdater,
  updaterDevices: PublishedDeviceUpdater,
) {

  // check if beaconMac is in devices, if it is not, add it
  if (!devices.some((e: PublishedDevice) => e.beaconMac === message.beaconMac)) {
    devices = pushDevicesUpdate(message, devices, -1, true)
    devices = separateDevicesTooFarAway(message, devices, settings)
    return updateReactState(updaterBridges, updaterDevices, devices)
  }

  // from this point on, beacon is in devices already (we've seen it before)
  const index: number = devices.map(e => e.beaconMac).indexOf(message.beaconMac)

  // it is definitely at this listener if this is the case
  if (message.rssi >= settings.definitivelyHereRSSI) {
    devices = pushDevicesUpdate(message, devices, index, false)
    devices = separateDevicesTooFarAway(message, devices, settings)
    return updateReactState(updaterBridges, updaterDevices, devices)
  }

  // get existing device in the PublishedDevices
  const publishedDevice: PublishedDevice = devices[index]

  // larger rssi's take priority
  if (message.rssi > publishedDevice.rssi) {
    devices = pushDevicesUpdate(message, devices, index, false)
    devices = separateDevicesTooFarAway(message, devices, settings)
    return updateReactState(updaterBridges, updaterDevices, devices)
  }

  // receive an update from the same bridge we've seen before
  if (message.bridgeName === publishedDevice.bridgeName) {
    devices = pushDevicesUpdate(message, devices, index, false)
    devices = separateDevicesTooFarAway(message, devices, settings)
    return updateReactState(updaterBridges, updaterDevices, devices)
  }

  // check if it's too old of information, if it is, we update with new info
  const currentTime: number = getCurrentTimestamp()
  // TODO: we can't compare time this way
  if (+publishedDevice.timestamp + +settings.localTimeout < currentTime) {
    devices = pushDevicesUpdate(message, devices, index, false)
    devices = separateDevicesTooFarAway(message, devices, settings)
    return updateReactState(updaterBridges, updaterDevices, devices)
  }

  devices = separateDevicesTooFarAway(message, devices, settings)
  // we see the beacon, but it is not here
  devices[index].seenTimestamp = message.timestamp
  return updateReactState(updaterBridges, updaterDevices, devices)
}

export function recalculate(
  records: Record<string, any>[],
  settings: ISettings,
  updaterBridges: DetectedBridgeUpdater,
  updaterDevices: PublishedDeviceUpdater
) {
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
    if (!device) return
    processRawMessage(
      newPublishedDevices, device, settings,
      setNewBridges, setNewPublishedDevices
    )
  })

  // reset react state
  updaterBridges(newBridges)
  updaterDevices(newPublishedDevices)
}
