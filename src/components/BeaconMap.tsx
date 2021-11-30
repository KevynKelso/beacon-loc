import React from 'react'
import { useState } from 'react'
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import mapStyle from '../resources/mapStyles.json'
import { Filters } from './FiltersBar'
import markerIcon from "./markerIcon"
import SideBar from './SideBar'
import Environment from '../environment.config'

export interface DetectedBridge {
  coordinates: number[]
  listenerName: string
  beacons?: Beacon[]
}

export interface Beacon {
  identifier: string
  timestamp: number
}

interface MapCoords {
  lat: number
  lng: number
}
//const mapsAPIKey: string = Environment().googleMapsApiKey
const mapsAPIKey: string = ""

const BeaconMap = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${mapsAPIKey}&v=3.exp`,
    loadingElement: <div />,
    containerElement: <div />,
    mapElement: <div className="static" />,
  }),
  withScriptjs,
  withGoogleMap
)((props: any) => {
  const [filters, setFilters] = useState<Filters>({ beacons: [], bridges: [] })
  const [mapCenter, setMapCenter] = useState<MapCoords>({ lat: 38.912378, lng: -104.819766 })
  const [activeMarker, setActiveMarker] = useState<number>(-1)

  function onMarkerClick(index: number, bridge: DetectedBridge) {
    if (index === activeMarker) {
      return setActiveMarker(-1)
    }
    setActiveMarker(index)
  }

  function renderBridgeMarkers(bridges: DetectedBridge[]) {
    return bridges.map((d: DetectedBridge, idx: number) => {
      const visible: boolean = filters.bridges.indexOf(d.listenerName) === -1
      return (
        <Marker
          title={`Bridge: ${d.listenerName}`}
          key={`${d.listenerName}${idx}`}
          position={{ lat: d.coordinates[0], lng: d.coordinates[1] }}
          icon={markerIcon(d.listenerName, d.beacons?.length || 0, activeMarker === idx)}
          onClick={() => onMarkerClick(idx, d)}
          visible={visible}
          zIndex={activeMarker === idx ? 100 : undefined}
        />
      )
    })
  }

  function onTableClick(d: DetectedBridge) {
    const activeMarkerToSet: number = props.detectedBridges.indexOf(d)
    if (activeMarker === activeMarkerToSet) {
      setActiveMarker(-1)
      return
    }

    setMapCenter({ lat: d.coordinates[0], lng: d.coordinates[1] })
    setActiveMarker(activeMarkerToSet)
  }

  function onMapClick() {
    setActiveMarker(-1)
  }

  return (
    <>
      <GoogleMap
        defaultCenter={{ lat: 38.912378, lng: -104.819766 }}
        defaultZoom={14}
        center={mapCenter}
        options={{ styles: mapStyle }}
        onClick={onMapClick}
      >
        {renderBridgeMarkers(props.detectedBridges)}
      </GoogleMap>

      <SideBar
        bridges={props.detectedBridges}
        filters={filters}
        setFilters={setFilters}
        setSettings={props.setSettings}
        onTableClick={onTableClick}
        activeMarker={activeMarker}
      />
    </>
  )
}
)

export default React.memo(BeaconMap)

