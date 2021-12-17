import React, { useState, useEffect } from 'react'

import Spinner from 'react-bootstrap/Spinner'

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
const mapsAPIKey: string = Environment().environmentType === "production" ? Environment().googleMapsApiKey : ""

const BeaconMap = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${mapsAPIKey}&v=3.exp`,
    loadingElement: <Spinner animation="border" role="status"> <span className="visually-hidden">Loading...</span> </Spinner>,
    containerElement: <div />,
    mapElement: <div className="static" />,
  }),
  withScriptjs,
  withGoogleMap
)((props: any) => {
  const [filters, setFilters] = useState<Filters>({ beacons: [], bridges: [] })
  const [mapCenter, setMapCenter] = useState<MapCoords>()
  const [activeMarker, setActiveMarker] = useState<number>(-1)
  const [firstLoad, setFirstLoad] = useState<boolean>(true)


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
          title={`Bridge: ${d.bridgeName}; Beacons: ${d.beacons?.length || 0}`}
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

  // button in popover for going to bridge location
  function onGoToClick(d: DetectedBridge) {
    setMapCenter({ lat: d.coordinates[0], lng: d.coordinates[1] })
  }

  // deselect marker when you click on the map
  function onMapClick() {
    setActiveMarker(-1)
  }

  function setMapCenterMyLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setMapCenter({ lat: position.coords.latitude, lng: position.coords.longitude })
        }
      )
    }
  }

  // center the map on your location when client connects
  useEffect(() => {
    if (firstLoad) {
      setMapCenterMyLocation()
      setFirstLoad(false)
    }
  }, [firstLoad])

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
        setMapCenterMyLocation={setMapCenterMyLocation}
      />
    </>
  )
}
)

export default React.memo(BeaconMap)
