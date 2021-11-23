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
//const key: string = Environment().googleMapsApiKey
const key: string = ""

const BeaconMap = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${key}&v=3.exp`,
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

  const detectedBridges: DetectedBridge[] = props.detectedBridges

  function onMarkerClick(index: number, bridge: DetectedBridge) {
    setActiveMarker(index)
  }

  function renderBridgeMarkers(bridges: DetectedBridge[]) {
    return bridges.map((d: DetectedBridge, idx: number) => {
      // if this bridge is not in the filters (-1), show it, otherwise, don't
      if (filters.bridges.indexOf(d.listenerName) === -1) {
        return (
          <Marker
            title={`Bridge: ${d.listenerName}`}
            key={`${d.listenerName}${idx}`}
            position={{ lat: d.coordinates[0], lng: d.coordinates[1] }}
            //onClick={(_, marker) => onMarkerClick(d, marker)}
            icon={markerIcon(d.listenerName, d.beacons?.length || 0, activeMarker === idx)}
            onClick={() => onMarkerClick(idx, d)}
          />
        )
      }
      return null
    })
  }

  function onTableClick(d: DetectedBridge) {
    const activeMarkerToSet: number = detectedBridges.indexOf(d)
    if (activeMarker === activeMarkerToSet) return

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
        //key={new Date().getTime()}
        center={mapCenter}
        //onReady={(_, map) => mapLoaded(map)}
        options={{ styles: mapStyle }}
        onClick={onMapClick}
      >
        {renderBridgeMarkers(detectedBridges)}
      </GoogleMap>

      <SideBar
        bridges={detectedBridges}
        //detectedDevicesSum={props.detectedDevicesSum}
        filters={filters}
        setFilters={setFilters}
        setSettings={props.setSettings}
        onTableClick={onTableClick}
      />
    </>
  )
}
)

export default BeaconMap

