import React from "react";

import { Map, GoogleApiWrapper, GoogleAPI, Marker } from 'google-maps-react';

interface BeaconMapProps {
  google: GoogleAPI
}

export function BeaconMap(props: BeaconMapProps) {
  const mapStyles = {
    width: "70%",
    height: "90%",
  }

  return (
    <>
      <Map
        google={props.google}
        style={mapStyles}
        initialCenter={{ lat: 38.912378, lng: -104.819766 }}
      >
        <Marker
          //@ts-ignore
          title={'The marker`s title will appear as a tooltip.'}
          name={'SOMA'}
          position={{ lat: 38.912284, lng: -104.819723 }} />
      </Map>
    </>
  );
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAgLMrAdC1LAWwnEtdM9K_r31FxSJcEU2U'
})(BeaconMap);
