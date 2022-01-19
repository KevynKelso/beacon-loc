import Environment from './environment.config'
import MqttListener from './components/MqttListener'
import { Connector } from 'mqtt-react-hooks'

import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

Amplify.configure(awsconfig);
function App() {

  return (
    <Connector
      brokerUrl={'wss://34.229.84.136'}
      options={{
        keepalive: 0,
        port: 9001,
      }}
    >
      <MqttListener />
    </Connector>
  );
}

export default App;
