import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Table from 'react-bootstrap/Table'

import { DetectedBridge, Beacon } from "./BeaconMap"

interface SideBarTableElementProps {
  bridge: DetectedBridge
  idx: number
  onClick: () => void
}

export default function SideBarTableElement(props: SideBarTableElementProps) {
  const truncatedName: string = props.bridge.listenerName.substring(0, 15)

  function formatTimestamp(ts: number): string {
    if (ts.toString().length !== 14) {
      console.error("invalid timestamp", ts.toString().length)
      return "unknown"
    }
    // expecting timestamps in the form "20211119145525"
    // need to separate yyyy-mm-dd-HH-mm-ss
    const year: string = ts.toString().substring(0, 4)
    const month: string = ts.toString().substring(4, 6)
    const day: string = ts.toString().substring(6, 8)
    const hour: string = ts.toString().substring(8, 10)
    const min: string = ts.toString().substring(10, 12)
    const sec: string = ts.toString().substring(12, 14)

    return `${year}-${month}-${day} ${hour}:${min}:${sec}`
  }

  return (
    <OverlayTrigger
      trigger="click"
      placement={"right"}
      rootClose={true}
      overlay={
        <Popover>
          <Popover.Header as="h3"><strong>Bridge:</strong> {props.bridge.listenerName}</Popover.Header>
          <Popover.Body>
            <p className="font-bold">Devices: {props.bridge.beacons?.length || 0}</p>
            <Table striped borderless hover>
              <thead>
                <tr>
                  <th>Serial number</th>
                  <th>Last seen</th>
                </tr>
              </thead>
              <tbody>
                {props.bridge.beacons?.map((beacon: Beacon) =>
                (
                  <tr key={`${props.bridge.listenerName}-${beacon.identifier}`}>
                    <td>{beacon.identifier}</td>
                    <td>{formatTimestamp(beacon.timestamp)}</td>
                  </tr>
                )
                )}
              </tbody>
            </Table>
            <p className="font-bold">Coordinates:</p>
            <p>Lat: {props.bridge.coordinates[0]}</p>
            <p>Lng: {props.bridge.coordinates[1]}</p>
            <p onClick={() => navigator.clipboard.writeText(`${props.bridge.coordinates[0]},${props.bridge.coordinates[1]}`)}>
              <i className="far fa-clipboard"></i>
              test </p>
          </Popover.Body>
        </Popover>
      }
    >
      <tr
        key={`sidebartableelement-${props.idx}`}
        onClick={props.onClick}
      >
        <td className="underline text-blue-500">
          {truncatedName}
        </td>
        <td>{props.bridge.beacons?.length || 0}</td>
      </tr>
    </OverlayTrigger>

  );
}
