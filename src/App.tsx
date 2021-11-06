import React from 'react';


import { Connector } from 'mqtt-react-hooks'
import Navbar from './components/Navbar'
import BeaconMap from './components/BeaconMap'

//import mqtt from 'mqtt';


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  //const { connectionStatus } = useMqttState();

  //var mqtt = require('mqtt')
  //const options: mqtt.IClientOptions = {
  //hostname: 'localhost',
  //port: 9001,
  //protocol: 'ws',
  //clientId: 'react-app',
  //}

  //var client = mqtt.connect(options);

  ////setup the callbacks
  //client.on('connect', function() {
  //console.log('Connected');
  //});

  //client.on('error', function(error: string) {
  //console.log(error);
  //});

  //client.on('message', function(topic: string, message: string) {
  ////Called each time a message is received
  //console.log('Received message:', topic, message.toString());
  //});

  //client.subscribe('test');

  //client.publish('test', 'Hello react');

  return (
    <>
      <Connector brokerUrl="ws://localhost:9001">
        <Navbar />
      </Connector>
      <BeaconMap />
    </>
  );
}

export default App;
