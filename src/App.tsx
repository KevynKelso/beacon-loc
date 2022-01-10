import Environment from './environment.config'
import MqttListener from './components/MqttListener'
import { Connector } from 'mqtt-react-hooks'
import { EasybaseProvider } from 'easybase-react'
import ebconfig from './ebconfig'


import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {

  return (
    <Connector
      brokerUrl={Environment().mqttBrokerUrl}
      options={{
        keepalive: 0,
        port: Environment().mqttPort,
        username: Environment().mqttUsername,
        password: Environment().mqttPassword,
      }}
    >
      <EasybaseProvider ebconfig={ebconfig}>
        <MqttListener />
      </EasybaseProvider>
    </Connector>
  );
}

export default App;
