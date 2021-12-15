import React, { useState } from 'react'

import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

import Environment from '../environment.config'
import SideBar from './SideBar'
import mapStyle from '../resources/mapStyles.json'
import markerIcon from "./markerIcon"

import { DetectedBridge } from './MqttListener'
import { Filters } from './FiltersBar'


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

  function onMarkerClick(index: number) {
    if (index === activeMarker) {
      return setActiveMarker(-1)
    }
    setActiveMarker(index)
  }

  function renderBridgeMarkers(bridges: DetectedBridge[]) {
    return bridges.map((d: DetectedBridge, idx: number) => {
      const visible: boolean = filters.bridges.indexOf(d.bridgeName) === -1
      return (
        <Marker
          title={`Bridge: ${d.bridgeName}`}
          key={`${d.bridgeName}${idx}`}
          position={{ lat: d.coordinates[0], lng: d.coordinates[1] }}
          icon={markerIcon(d.bridgeName, d.beacons?.length || 0, activeMarker === idx)}
          onClick={() => onMarkerClick(idx)}
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

    setActiveMarker(activeMarkerToSet)
  }

  function onGoToClick(d: DetectedBridge) {
    setMapCenter({ lat: d.coordinates[0], lng: d.coordinates[1] })
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
        onGoToClick={onGoToClick}
      />
    </>
  )
}
)

export default React.memo(BeaconMap)
