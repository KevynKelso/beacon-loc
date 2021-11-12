import React from 'react';

import Environment from './environment.config'
import MqttListener from './components/MqttListener'
import { Connector } from 'mqtt-react-hooks'


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <Connector brokerUrl={Environment().mqttBrokerUrl} options={{ keepalive: 0 }}>
        <MqttListener />
      </Connector>
    </>
  );
}

export default App;
