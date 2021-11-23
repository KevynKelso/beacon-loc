import { useState } from 'react'
//@ts-ignore
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import mapStyle from '../resources/mapStyles.json'
import { DetectedBridge } from './BeaconMap'
import { Filters } from './FiltersBar'
import markerIcon from "./markerIcon"
import SideBar from './SideBar'

interface MapCoords {
  lat: number
  lng: number
}

const TestBeaconMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100vh` }} />,
    mapElement: <div className="static" />,
  }),
  withScriptjs,
  withGoogleMap
)((props: any) => {
  const [filters, setFilters] = useState<Filters>({ beacons: [], bridges: [] })
  const [mapCenter, setMapCenter] = useState<MapCoords>({ lat: 38.912378, lng: -104.819766 })
  const [activeMarker, setActiveMarker] = useState<number>(-1)

  const detectedBridges = props.detectedBridges

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

  // migth not need this now
  //function mapLoaded(map: any) {
  //map.setOptions({
  //styles: mapStyle
  //})
  //}

  return (
    <>
      <GoogleMap
        defaultCenter={{ lat: 38.912378, lng: -104.819766 }}
        defaultZoom={14}
        center={mapCenter}
        //onReady={(_, map) => mapLoaded(map)}
        options={{ styles: mapStyle }}
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

export default TestBeaconMap

