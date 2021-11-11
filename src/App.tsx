import React from 'react';

import { Connector } from 'mqtt-react-hooks'
//import BeaconMap from './components/BeaconMap'
import MqttListener from './components/MqttListener'


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <Connector brokerUrl="ws://localhost:9001" options={{ keepalive: 0 }}>
        <div className="mt-2">
          <MqttListener />
        </div>
      </Connector>
    </>
  );
}

export default App;
