import { DetectedBridge, PublishedDevice, Beacon } from '../components/MqttListener'

export function convertDevicesToBridges(devices: PublishedDevice[]): DetectedBridge[] {
  let detectedBridges: DetectedBridge[] = []
  // filter out only unique names to add to detected bridges
  devices.forEach((device: PublishedDevice) => {
    // determine if this device is in detectedBridges
    const i: number = detectedBridges.findIndex((listener: DetectedBridge) => listener.bridgeName === device.bridgeName);
    if (i <= -1) {
      // it is not, so make a new bridge entry
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
    if (!detectedBridges[i].beacons) return

    // already in there, add this device to the bridge
    detectedBridges[i].beacons?.push(
      {
        beaconMac: device.beaconMac,
        timestamp: device.seenTimestamp,
        coordinates: device.bridgeCoordinates,
      })

    // get the most recently seen device's coordinates
    const mostRecentBeacon: Beacon | undefined = detectedBridges[i].beacons?.reduce(
      (previousBeacon, currentBeacon) =>
        previousBeacon.timestamp > currentBeacon.timestamp ? previousBeacon : currentBeacon
    )
    if (mostRecentBeacon) {
      detectedBridges[i].coordinates = mostRecentBeacon.coordinates
    }
  })

  return detectedBridges
}

