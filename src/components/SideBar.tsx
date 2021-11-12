import { useState } from 'react';

import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'

import FiltersBar, { Filters, BridgeOrBeacon } from './FiltersBar'
import NavBar from './Navbar'
import { DetectedBridge } from './BeaconMap'
import { ISettings } from './SettingsModal'

interface SideBarProps {
  className?: string
  detectedDevicesSum: number
  bridges: DetectedBridge[]
  setSettings: (settings: ISettings) => void
  filters: Filters
  setFilters: (filters: Filters) => void
}

export default function SideBar(props: SideBarProps) {
  const [showBridges, setShowBridges] = useState<boolean>(true)

  function updateFilters(type: BridgeOrBeacon, elements: string[]) {
    if (type === 'BRIDGE') {
      return props.setFilters({ beacons: props.filters.beacons, bridges: elements })
    }

    if (type === 'BEACON') {
      return props.setFilters({ beacons: elements, bridges: props.filters.bridges })
    }
  }

  // TODO: add scrolling
  // TODO: do something about bridge names being too long
  return (
    <div className={props.className} >
      <div className={showBridges ? "shadow-md absolute bg-gray-100" : "absolute"}>
        <div className="flex m-3">
          <Button
            onClick={() => setShowBridges(!showBridges)}
            variant={showBridges ? "secondary" : "primary"}
          >
            {showBridges ? "Hide detected bridges" : "Show detected bridges"}
          </Button>
          <NavBar className="ml-2" setSettings={props.setSettings} />
        </div>
        {showBridges &&
          <div className="m-3">
            <h3>Detected bridges</h3>
            {props.bridges.length > 0 ?
              <div>
                <Table striped borderless hover className='whitespace-nowrap max-w-1/3'>
                  <thead>
                    <tr>
                      <th>Bridge</th>
                      <th>Number of devices at bridge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.bridges.map((d: DetectedBridge) => {
                      // if this bridge is not in the filters (-1), show it
                      if (props.filters.bridges.indexOf(d.listenerName) === -1) {
                        return (
                          // TODO: when row is clicked, display additional information
                          // TODO: make visual cue row is clickable
                          <tr onClick={() => console.log('hello!')}>
                            <td>{d.listenerName}</td>
                            <td>{d.numberOfBeacons}</td>
                          </tr>
                        )
                      }
                    })}
                  </tbody>
                </Table>
                <p>Total devices found: {props.detectedDevicesSum}</p>
              </div>
              : <p>No bridges publishing</p>
            }
            <FiltersBar
              availableBeacons={["test", "tes"]}
              availableBridges={props.bridges.map((d: DetectedBridge) => d.listenerName)}
              updateFilters={updateFilters}
              existingFilters={props.filters}
            />
          </div>
        }
      </div>
    </div>
  );
}
