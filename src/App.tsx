import React, { useState } from 'react';

import { Connector } from 'mqtt-react-hooks'
import Navbar from './components/Navbar'
//import BeaconMap from './components/BeaconMap'
import MqttListener from './components/MqttListener'
import { ISettings, DefaultSettings } from './components/SettingsModal'


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [settings, setSettings] = useState<ISettings>(DefaultSettings)


  return (
    <>
      <Connector brokerUrl="ws://localhost:9001" options={{ keepalive: 0 }}>
        <Navbar setSettings={setSettings} />
        <MqttListener
          definitivelyHereRSSI={settings.definitivelyHereRSSI}
          localTimeout={settings.localTimeout}
          debugMode={settings.debugMode}
        />
      </Connector>
    </>
  );
}

export default App;
