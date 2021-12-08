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
  const deltaLat: number = a.listenerCoordinates[0] - b.listenerCoordinates[0]
  const deltaLng: number = a.listenerCoordinates[1] - b.listenerCoordinates[1]
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
      (e: PublishedDevice) => e.listenerName === inDevice.listenerName
    )

  if (bridgeDevices?.length) {
    bridgeDevices.forEach((d: PublishedDevice) => {
      if (isTooFarAway(settings.lostDistance, d, inDevice)) {
        // this beacon is too far away from the listener and must be associated with it's
        // own location
        const newListenerName: string = `${inDevice.timestamp}`
        const index: number = devices.map(e => e.beaconMac).indexOf(d.beaconMac)
        let newDevice: PublishedDevice = devices[index]
        newDevice.listenerName = newListenerName
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
  if (message.listenerName === publishedDevice.listenerName) {
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

