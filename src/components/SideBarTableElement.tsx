import { useState } from 'react'

import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Table from 'react-bootstrap/Table'
import Tooltip from 'react-bootstrap/Tooltip'

import { DetectedBridge, Beacon } from "./BeaconMap"

interface SideBarTableElementProps {
  activeMarker: number
  bridge: DetectedBridge
  idx: number
  onClick: () => void
}

export default function SideBarTableElement(props: SideBarTableElementProps) {
  const [copied, setCopied] = useState<boolean>(false)

  const truncatedName: string = props.bridge.listenerName.substring(0, 15)
  const rowClasses: string = props.idx % 2 ? "text-white" : "bg-warm-black text-white"

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

  function onCopyButtonClick() {
    navigator.clipboard.writeText(`${props.bridge.coordinates[0]},${props.bridge.coordinates[1]}`)
    setCopied(true)
  }

  return (
    <OverlayTrigger
      trigger="click"
      placement={"right"}
      rootClose={true}
      show={props.idx === props.activeMarker}
      overlay={
        <Popover>
          <Popover.Header>
            <h6 className="mb-0"><strong>Bridge:</strong> {props.bridge.listenerName}</h6>
          </Popover.Header>
          <Popover.Body>
            <p className="font-bold">Devices: {props.bridge.beacons?.length || 0}</p>
            <div className="max-h-96 overflow-y-scroll" onScroll={(e) => console.log(e)}>
              <Table striped borderless hover>
                <thead className="sticky top-0 bg-white">
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
            </div>
            <p className="font-bold">Coordinates:</p>
            <p>Lat: {props.bridge.coordinates[0]}</p>
            <p>Lng: {props.bridge.coordinates[1]}</p>
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip>
                  {copied ? "Copied!" : "Copy to clipboard"}
                </Tooltip>
              }
            >
              <Button
                variant="outline-dark"
                onClick={onCopyButtonClick}
                onMouseEnter={() => setCopied(false)}
                size="sm"
              >
                Copy
              </Button>
            </OverlayTrigger>
          </Popover.Body>
        </Popover>
      }
    >
      <tr
        onClick={props.onClick}
        key={`sidebartableelement-${props.idx}`}
        className={props.activeMarker === props.idx ? "bg-dark-sky-blue" : rowClasses}
      >
        <td
          className={props.activeMarker === props.idx ? "text-gray-100" : "underline text-blue-400"}
        >
          {truncatedName}
        </td>
        <td
          className={props.activeMarker === props.idx ? "text-gray-100" : "text-white"}
        >
          {props.bridge.beacons?.length || 0}</td>
      </tr>
    </OverlayTrigger>
  )
}
