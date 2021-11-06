import React from 'react';


import { Connector } from 'mqtt-react-hooks'
import Navbar from './components/Navbar'
import BeaconMap from './components/BeaconMap'

//import mqtt from 'mqtt';


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <>
      <Connector brokerUrl="ws://localhost:9001" options={{ keepalive: 0 }}>
        <Navbar />
      </Connector>
    </>
  );
}

export default App;
