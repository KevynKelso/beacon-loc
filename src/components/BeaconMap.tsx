//@ts-ignore
import React, { useState } from "react"

import { Map, GoogleApiWrapper, GoogleAPI, Marker, IMarkerProps, InfoWindow } from 'google-maps-react'

import { PublishedDevice } from './MqttListener'
import SideBar from './SideBar'
import mapStyle from '../resources/mapStyles.json'
import { ISettings } from './SettingsModal'

export interface DetectedListener {
  coordinates: number[]
  listenerName: string
  numberOfBeacons: number
}

interface showInfoWindow {
  activeMarker: Marker | null
  listener?: DetectedListener
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

  const mapStyles = {
    width: "100%",
    height: "100%",
  }

  let detectedListeners: DetectedListener[] = []
  let detectedDevicesSum: number = 0

  // filter out only unique names to add to detected listeners
  props.devices.forEach((device: PublishedDevice) => {
    const i: number = detectedListeners.findIndex((listener: DetectedListener) => listener.listenerName == device.listenerName);
    if (i <= -1) {
      return detectedListeners.push(
        {
          listenerName: device.listenerName,
          numberOfBeacons: 1,
          coordinates: device.listenerCoordinates,
        });
    }
    detectedListeners[i].numberOfBeacons++
    detectedDevicesSum++
  });

  detectedListeners.sort((a, b) => (a.listenerName > b.listenerName) ? 1 : ((b.listenerName > a.listenerName) ? -1 : 0))
  detectedDevicesSum += detectedListeners.length

  //@ts-ignore
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

  function onMarkerClick(listener: DetectedListener, props?: IMarkerProps, marker?: any) {
    setShowingInfoWindow({
      activeMarker: marker,
      listener: listener,
      selectedPlace: props,
      showingInfoWindow: true,
    });
  }

  return (
    <div className="mt-2">
      <Map
        google={props.google}
        style={mapStyles}
        initialCenter={{ lat: 38.912378, lng: -104.819766 }}
        onReady={(_, map) => mapLoaded(map)}
        onClick={onMapClicked}
      >
        {detectedListeners.map((listener: DetectedListener) => {
          return (
            <Marker
              //@ts-ignore
              title={`Bridge: ${listener.listenerName}`}
              position={{ lat: listener.coordinates[0], lng: listener.coordinates[1] }}
              label={listener.listenerName}
              onClick={(props, marker) => onMarkerClick(listener, props, marker)}
            />
          )
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
        className="max-w-1/3"
        detectedDevicesSum={detectedDevicesSum}
        listeners={detectedListeners}
        setSettings={props.setSettings}
      />
    </div>
  );
}

export default GoogleApiWrapper({
  // TODO: get api key from env. Also change this key
  apiKey: '',
})(BeaconMap);
//export default BeaconMap
