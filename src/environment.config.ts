export default function Environment() {
  const environmentType = process.env.REACT_APP_ENVIRONMENT || "production"
  const firebaseApiKey = process.env.REACT_APP_FIREBASEAPIKEY || ""
  const firebaseAuthDomain = process.env.REACT_APP_FIREBASEAUTHDOMAIN || ""
  const firebaseUrl = process.env.REACT_APP_FIREBASEURL || ""
  const googleMapsApiKey = process.env.REACT_APP_GOOGLEMAPSAPIKEY || ""
  const mqttBrokerUrl = process.env.REACT_APP_MQTTBROKERURL || ""
  const mqttPassword = process.env.REACT_APP_MQTTPASSWORD || ""
  const mqttPort = parseInt(process.env.REACT_APP_MQTTPORT || "")
  const mqttTopic = process.env.REACT_APP_MQTTTOPIC || ""
  const mqttUsername = process.env.REACT_APP_MQTTUSERNAME || ""

  const environment = {
    environmentType: environmentType,
    firebaseApiKey: firebaseApiKey,
    firebaseAuthDomain: firebaseAuthDomain,
    firebaseUrl: firebaseUrl,
    googleMapsApiKey: googleMapsApiKey,
    mqttBrokerUrl: mqttBrokerUrl,
    mqttPassword: mqttPassword,
    mqttPort: mqttPort,
    mqttTopic: mqttTopic,
    mqttUsername: mqttUsername,
  }

  if (!mqttPassword || !mqttBrokerUrl || !mqttUsername ||
    !googleMapsApiKey || !mqttPort || !mqttTopic || !firebaseApiKey ||
    !firebaseAuthDomain || !firebaseUrl) {
    throw new Error("Missing environment variables")
  }

  return environment
}
