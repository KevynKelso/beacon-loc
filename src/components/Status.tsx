import Badge from 'react-bootstrap/Badge'

import { useMqttState } from 'mqtt-react-hooks'

export default function Status() {
  /*
   * Status list
   * - Offline
   * - Connected
   * - Reconnecting
   * - Closed
   * - Error: printed in console too
   */
  const { connectionStatus } = useMqttState();
  const badgeConnectionColor: string =
    connectionStatus === "Connecting" ? "warning" :
      connectionStatus === "Connected" ? "success" : "danger"

  return (
    <Badge className="shadow-md" pill bg={badgeConnectionColor}>
      {`Broker status: ${connectionStatus}`}
    </Badge>
  )
}
