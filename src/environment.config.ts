export default function Environment() {
  const googleMapsApiKey = process.env.REACT_APP_GOOGLEMAPSAPIKEY || ""
  const mqttBrokerUrl = process.env.REACT_APP_MQTTBROKERURL || ""
  const mqttPassword = process.env.REACT_APP_MQTTPASSWORD || ""
  const mqttPort = parseInt(process.env.REACT_APP_MQTTPORT || "")
  const mqttUsername = process.env.REACT_APP_MQTTUSERNAME || ""

  const environment = {
    googleMapsApiKey: googleMapsApiKey,
    mqttBrokerUrl: mqttBrokerUrl,
    mqttPassword: mqttPassword,
    mqttPort: mqttPort,
    mqttUsername: mqttUsername,
  }

  if (!mqttPassword || !mqttBrokerUrl || !mqttUsername || !googleMapsApiKey || !mqttPort) {
    throw new Error("Missing environment variables")
  }

  return environment
}
