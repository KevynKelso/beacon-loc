export default function Environment() {
  const mqttPassword = process.env.REACT_APP_MQTTPASSWORD
  const mqttBrokerUrl = process.env.REACT_APP_MQTTBROKERURL
  const mqttUsername = process.env.REACT_APP_MQTTUSERNAME
  const googleMapsApiKey = process.env.REACT_APP_GOOGLEMAPSAPIKEY

  const environment = {
    mqttPassword: mqttPassword,
    mqttBrokerUrl: mqttBrokerUrl,
    mqttUsername: mqttUsername,
    googleMapsApiKey: googleMapsApiKey,
  }

  if (!mqttPassword || !mqttBrokerUrl || !mqttUsername || !googleMapsApiKey) {
    throw new Error("Missing environment variables")
  }

  return environment
}
