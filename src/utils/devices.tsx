import { DetectedBridge, PublishedDevice } from '../components/MqttListener'

export function convertDevicesToBridges(devices: PublishedDevice[]): DetectedBridge[] {
  let detectedBridges: DetectedBridge[] = []
  devices.forEach((device: PublishedDevice) => {
    // determine if this device's bridgeName is in detectedBridges
    const i: number = detectedBridges.findIndex(
      (bridge: DetectedBridge) => bridge.bridgeName === device.bridgeName
    )
    if (i <= -1) {
      // it is not, so make a new bridge entry. Bridge inherits the coordinates
      // of the first device in the devices list for that bridge name
      return detectedBridges.push(
        {
          bridgeName: device.bridgeName,
          coordinates: device.bridgeCoordinates,
          beacons: [{
            beaconMac: device.beaconMac,
            timestamp: device.seenTimestamp,
            coordinates: device.bridgeCoordinates,
          }],
        })
    }

    // already in there, add this device to the bridge
    detectedBridges[i]?.beacons?.push(
      {
        beaconMac: device.beaconMac,
        timestamp: device.seenTimestamp,
        coordinates: device.bridgeCoordinates,
      })
  })

  return detectedBridges
}

