import { useState, useEffect, useMemo, useCallback } from "react"

import { Map, GoogleApiWrapper, GoogleAPI, Marker, Circle } from 'google-maps-react'

import Environment from '../environment.config'
import SideBar from './SideBar'
import mapStyle from '../resources/mapStyles.json'
import { Filters } from './FiltersBar'
import { ISettings } from './SettingsModal'
import markerIcon from "./markerIcon"


export interface DetectedBridge {
  coordinates: number[]
  listenerName: string
  beacons?: Beacon[]
}

export interface Beacon {
  identifier: string
  timestamp: number
}

interface BeaconMapProps {
  className?: string
  detectedBridges: DetectedBridge[]
  //detectedDevicesSum: number
  google: GoogleAPI
  setSettings: (settings: ISettings) => void
}

interface MapCoords {
  lat: number
  lng: number
}


export function BeaconMap(props: BeaconMapProps) {
  // if it's in the filters, we want to ignore it
  const [filters, setFilters] = useState<Filters>({ beacons: [], bridges: [] })
  const [mapCenter, setMapCenter] = useState<MapCoords>({ lat: 38.912378, lng: -104.819766 })
  const [activeMarker, setActiveMarker] = useState<number>(-1)

  const mapStyles = {
    width: "100%",
    height: "100%",
  }

  //let detectedDevicesSum: number = 0

  //function setDetectedBridges(devices: PublishedDevice[]): DetectedBridge[] {
  //let detectedBridges: DetectedBridge[] = []
  //// filter out only unique names to add to detected bridges
  //devices.forEach((device: PublishedDevice) => {
  //// determine if this device is in detectedBridges
  //const i: number = detectedBridges.findIndex((listener: DetectedBridge) => listener.listenerName == device.listenerName);
  //if (i <= -1) {
  //// it is not, so make a new bridge entry
  //return detectedBridges.push(
  //{
  //listenerName: device.listenerName,
  //numberOfBeacons: 1,
  //coordinates: device.listenerCoordinates,
  //// TODO: possibly convert the mac address to a useful name for the beacon here
  //beaconIdentifiers: [device.beaconMac],
  //});
  //}
  //// already in there, update the information for this device
  //detectedBridges[i].beaconIdentifiers?.push(device.beaconMac)
  //detectedBridges[i].numberOfBeacons++
  //detectedDevicesSum++
  //})

  //// sorted by name
  //detectedBridges.sort((a, b) => (a.listenerName > b.listenerName) ? 1 : ((b.listenerName > a.listenerName) ? -1 : 0))

  //return detectedBridges
  //}

  //let detectedBridges: DetectedBridge[] = setDetectedBridges(props.devices)
  //detectedDevicesSum += detectedBridges.length

  function mapLoaded(map: any) {
    map.setOptions({
      styles: mapStyle
    })
  }

  function onTableClick(d: DetectedBridge) {
    setMapCenter({ lat: d.coordinates[0], lng: d.coordinates[1] })
    setActiveMarker(props.detectedBridges.indexOf(d))
  }

  function renderBridgeMarkers(bridges: DetectedBridge[]) {
    return bridges.map((d: DetectedBridge, idx: number) => {
      // if this bridge is not in the filters (-1), show it, otherwise, don't
      if (filters.bridges.indexOf(d.listenerName) === -1) {
        //@ts-ignore
        return (
          <Marker
            //@ts-ignore google map magig
            title={`Bridge: ${d.listenerName}`}
            key={`${d.listenerName}${idx}`}
            position={{ lat: d.coordinates[0], lng: d.coordinates[1] }}
            //onClick={(_, marker) => onMarkerClick(d, marker)}
            icon={markerIcon(d.listenerName, d.beacons?.length || 0, activeMarker === idx)}
          />
        )
      }
      return null
    })
  }

  function renderBeaconMarkers(bridges: DetectedBridge[]) {
    return bridges.map((d: DetectedBridge, i: number) => {
      // if this bridge is not in the filters (-1), show it, otherwise, don't
      if (filters.bridges.indexOf(d.listenerName) === -1 && d.beacons && activeMarker === i) {
        return d.beacons.map((_: Beacon, idx: number) => {
          const numColumns = Math.ceil(Math.sqrt(d.beacons?.length || 0))

          //const numBeacons: number = d.beacons?.length || 1
          //const radius: number = numBeacons * 0.00015
          //const theta: number = (Math.PI * 2) / numBeacons * idx
          //const x: number = radius * Math.sin(theta)
          //const y: number = radius * Math.cos(theta) - 0.001
          const x: number = (idx % numColumns) * 0.0012
          const y: number = Math.floor(idx / numColumns) * 0.0012

          const offsetx = 0.01
          return (
            <Circle
              radius={50}
              center={{ lat: d.coordinates[0] + y, lng: d.coordinates[1] + x + offsetx }}
              strokeColor='transparent'
              strokeOpacity={0}
              strokeWeight={5}
              fillColor='#00d9ff'
              fillOpacity={0.9}
            >
            </Circle>
          )
        }
        )
      }
      return null
    })
  }

  return (
    <div id="map-container">
      <Map
        google={props.google}
        style={mapStyles}
        initialCenter={{ lat: 38.912378, lng: -104.819766 }}
        center={mapCenter}
        onReady={(_, map) => mapLoaded(map)}
      //onClick={onMapClicked}
      >
        {renderBridgeMarkers(props.detectedBridges)}
        {renderBeaconMarkers(props.detectedBridges)}
      </Map >

      <SideBar
        bridges={props.detectedBridges}
        className="max-w-1/3"
        //detectedDevicesSum={props.detectedDevicesSum}
        filters={filters}
        setFilters={setFilters}
        setSettings={props.setSettings}
        onTableClick={onTableClick}
      />
    </div>
  );
}

export default GoogleApiWrapper({
  //apiKey: Environment().googleMapsApiKey || '',
  apiKey: '',
})(BeaconMap);
