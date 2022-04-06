import { useState } from 'react'

import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Table from 'react-bootstrap/Table'
import Tooltip from 'react-bootstrap/Tooltip'

import { DetectedBridge, Beacon } from "./MqttListener"
import { formatTimestamp } from "../utils/timestamp"

interface SideBarTableElementProps {
  activeMarker: number
  bridge: DetectedBridge
  idx: number
  onClick: () => void
  onGoToClick: (d: DetectedBridge) => void
}

export default function SideBarTableElement(props: SideBarTableElementProps) {
  const [copied, setCopied] = useState<boolean>(false)

  const truncatedName: string = props.bridge.bridgeName.substring(0, 15)
  const rowClasses: string = props.idx % 2 ? "text-white dark-sky-blue-hover" : "dark-sky-blue-hover bg-em-secondary text-white"

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
        <Popover className="max-w-1/3">
          <Popover.Header className="bg-em-primary">
            <h6 className="mb-0 text-white"><strong>Bridge:</strong> {props.bridge.bridgeName}</h6>
          </Popover.Header>
          <Popover.Body>
            <div className="flex">
              <p className="font-bold flex-grow">Devices: {props.bridge.beacons?.length || 0}</p>
              <Button
                className="self-start border-none bg-em-primary text-white"
                variant="primary"
                onClick={() => props.onGoToClick(props.bridge)}
                size="sm"
              >
                Go to location
              </Button>
            </div>
            <div className="mt-2 max-h-96 overflow-y-scroll">
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
                    <tr key={`${props.bridge.bridgeName}-${beacon.beaconMac}`}>
                      <td>{beacon.beaconMac}</td>
                      <td>{formatTimestamp(beacon.timestamp)}</td>
                    </tr>
                  )
                  )}
                </tbody>
              </Table>
            </div>
            <p className="font-bold">Coordinates:</p>
            <p className="mt-2">Lat: {props.bridge.coordinates[0]}</p>
            <p className="mt-2">Lng: {props.bridge.coordinates[1]}</p>
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip>
                  {copied ? "Copied!" : "Copy to clipboard"}
                </Tooltip>
              }
            >
              <Button
                className="mt-2"
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
          className={props.activeMarker === props.idx ? "text-white cursor-pointer" : "cursor-pointer underline text-white"}
        >
          {truncatedName}
        </td>
        <td
          className={props.activeMarker === props.idx ? "text-gray-100 cursor-pointer" : "cursor-pointer text-white"}
        >
          {props.bridge.beacons?.length || 0}</td>
      </tr>
    </OverlayTrigger>
  )
}
