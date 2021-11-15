import React, { useState } from "react"

import { Map, GoogleApiWrapper, GoogleAPI, Marker, IMarkerProps, InfoWindow, Circle } from 'google-maps-react'

import Environment from '../environment.config'
import SideBar from './SideBar'
import mapStyle from '../resources/mapStyles.json'
import { Filters } from './FiltersBar'
import { ISettings } from './SettingsModal'
import { PublishedDevice } from './MqttListener'


export interface DetectedBridge {
  coordinates: number[]
  listenerName: string
  numberOfBeacons: number
  beaconIdentifiers?: string[]
}

interface showInfoWindow {
  activeMarker: Marker | null
  listener?: DetectedBridge
  showingInfoWindow: boolean
}

interface BeaconMapProps {
  className?: string
  devices: PublishedDevice[]
  google: GoogleAPI
  setSettings: (settings: ISettings) => void
}


export function BeaconMap(props: BeaconMapProps) {
  const [showingInfoWindow, setShowingInfoWindow] = useState<showInfoWindow>()
  // if it's in the filters, we want to ignore it
  const [filters, setFilters] = useState<Filters>({ beacons: [], bridges: [] })
  const [infoVisible, setInfoVisible] = useState<boolean>(false)

  const mapStyles = {
    width: "100%",
    height: "100%",
  }

  let detectedBridges: DetectedBridge[] = []
  let detectedDevicesSum: number = 0

  // filter out only unique names to add to detected bridges
  props.devices.forEach((device: PublishedDevice) => {
    // determine if this device is in detectedBridges
    const i: number = detectedBridges.findIndex((listener: DetectedBridge) => listener.listenerName == device.listenerName);
    if (i <= -1) {
      // it is not, so make a new bridge entry
      return detectedBridges.push(
        {
          listenerName: device.listenerName,
          numberOfBeacons: 1,
          coordinates: device.listenerCoordinates,
          // TODO: possibly convert the mac address to a useful name for the beacon here
          beaconIdentifiers: [device.beaconMac],
        });
    }
    // already in there, update the information for this device
    detectedBridges[i].beaconIdentifiers?.push(device.beaconMac)
    detectedBridges[i].numberOfBeacons++
    detectedDevicesSum++
  });

  // sorted by name
  detectedBridges.sort((a, b) => (a.listenerName > b.listenerName) ? 1 : ((b.listenerName > a.listenerName) ? -1 : 0))
  detectedDevicesSum += detectedBridges.length

  //@ts-ignore the google map type is weird
  function mapLoaded(map) {
    map.setOptions({
      styles: mapStyle
    })
  }

  function onMapClicked() {
    if (showingInfoWindow) {
      setShowingInfoWindow({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }

  function onMarkerClick(listener: DetectedBridge, marker?: any) {
    setShowingInfoWindow({
      activeMarker: marker,
      listener: listener,
      showingInfoWindow: true,
    })
  }

  function onTableClick(d: DetectedBridge) {
    setInfoVisible(!infoVisible)
  }

  function getMarker(d: DetectedBridge, idx: number): Marker | null {
    // if this bridge is not in the filters (-1), show it
    if (filters.bridges.indexOf(d.listenerName) === -1) {
      //@ts-ignore
      return (
        <Marker
          //@ts-ignore google map magig
          title={`Bridge: ${d.listenerName}`}
          position={{ lat: d.coordinates[0], lng: d.coordinates[1] }}
          label={`${d.listenerName}
            ${d.numberOfBeacons}`}
          onClick={(_, marker) => onMarkerClick(d, marker)}
          id={`markerNo${idx}`}
        >
          <InfoWindow
            visible={infoVisible}
            google={props.google}
            map={null}
            marker={null}
          >
            <div>
              <p> test </p>
            </div>
          </InfoWindow>
        </Marker>
      )
    }
    return null
  }

  //<InfoWindow
  //google={props.google}
  //map={null}
  //marker={showingInfoWindow?.activeMarker}
  //// TODO: make this the proper information
  //visible={showingInfoWindow?.showingInfoWindow}>
  //<div>
  //<p className="font-bold text-lg">Bridge: {showingInfoWindow?.listener?.listenerName}</p>
  //<p className="text-base">Coordinates: {showingInfoWindow?.listener?.coordinates}</p>
  //<p className="text-base">Number of beacons: {showingInfoWindow?.listener?.numberOfBeacons}</p>
  //</div>
  //</InfoWindow>
  return (
    <>
      <Map
        google={props.google}
        style={mapStyles}
        // TODO: initialCenter based off of current location?
        initialCenter={{ lat: 38.912378, lng: -104.819766 }}
        onReady={(_, map) => mapLoaded(map)}
        onClick={onMapClicked}
      >
        {detectedBridges.map((d: DetectedBridge, idx: number) => {
          return getMarker(d, idx)
        })}
        {detectedBridges.map((d: DetectedBridge) => {
          // if this bridge is not in the filters (-1), show it
          if (filters.bridges.indexOf(d.listenerName) === -1 && d.beaconIdentifiers) {
            return d.beaconIdentifiers.map((identifier: string, idx: number) => {
              const numBeacons: number = d.beaconIdentifiers?.length || 1
              const radius: number = numBeacons * 0.0002
              const theta: number = ((14 * Math.PI / 9) / numBeacons) * idx + Math.PI / 3
              const x: number = radius * Math.sin(theta)
              const y: number = radius * Math.cos(theta)
              return (
                <Circle
                  radius={50}
                  center={{ lat: d.coordinates[0] + y, lng: d.coordinates[1] + x }}
                  //onMouseover={() => console.log('mouseover')}
                  //onClick={() => console.log('click')}
                  //onMouseout={() => console.log('mouseout')}
                  strokeColor='transparent'
                  strokeOpacity={0}
                  strokeWeight={5}
                  fillColor='#39FF14'
                  fillOpacity={0.9}
                />
              )
            }
            )
          }
        })}
      </Map>
      <SideBar
        bridges={detectedBridges}
        className="max-w-1/3"
        detectedDevicesSum={detectedDevicesSum}
        filters={filters}
        setFilters={setFilters}
        setSettings={props.setSettings}
        onTableClick={onTableClick}
      />
    </>
  );
}

export default GoogleApiWrapper({
  //apiKey: Environment().googleMapsApiKey || '',
  apiKey: '',
})(BeaconMap);
