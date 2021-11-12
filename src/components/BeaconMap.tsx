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
  selectedPlace?: IMarkerProps
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

  function onMarkerClick(listener: DetectedBridge, props?: IMarkerProps, marker?: any) {
    setShowingInfoWindow({
      activeMarker: marker,
      listener: listener,
      selectedPlace: props,
      showingInfoWindow: true,
    });
  }

  return (
    <>
      <Map
        google={props.google}
        style={mapStyles}
        initialCenter={{ lat: 38.912378, lng: -104.819766 }}
        onReady={(_, map) => mapLoaded(map)}
        onClick={onMapClicked}
      >
        {detectedBridges.map((d: DetectedBridge) => {
          // if this bridge is not in the filters (-1), show it
          if (filters.bridges.indexOf(d.listenerName) === -1) {
            return (
              <Marker
                //@ts-ignore google map magic
                title={`Bridge: ${d.listenerName}`}
                position={{ lat: d.coordinates[0], lng: d.coordinates[1] }}
                label={d.listenerName}
                onClick={(props, marker) => onMarkerClick(d, props, marker)}
              />
            )
          }
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
              console.log(x, y)
              return (
                <Circle
                  radius={50}
                  center={{ lat: d.coordinates[0] + y, lng: d.coordinates[1] + x }}
                  onMouseover={() => console.log('mouseover')}
                  onClick={() => console.log('click')}
                  onMouseout={() => console.log('mouseout')}
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
        <InfoWindow
          google={props.google}
          map={null}
          marker={showingInfoWindow?.activeMarker}
          visible={showingInfoWindow?.showingInfoWindow}>
          <div>
            <p className="font-bold text-lg">Bridge: {showingInfoWindow?.listener?.listenerName}</p>
            <p className="text-base">Coordinates: {showingInfoWindow?.listener?.coordinates}</p>
            <p className="text-base">Number of beacons: {showingInfoWindow?.listener?.numberOfBeacons}</p>
          </div>
        </InfoWindow>
      </Map>
      <SideBar
        bridges={detectedBridges}
        className="max-w-1/3"
        detectedDevicesSum={detectedDevicesSum}
        filters={filters}
        setFilters={setFilters}
        setSettings={props.setSettings}
      />
    </>
  );
}

export default GoogleApiWrapper({
  //apiKey: Environment().googleMapsApiKey || '',
  apiKey: '',
})(BeaconMap);
