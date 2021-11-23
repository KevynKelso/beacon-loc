import { useState } from 'react';

import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'

import FiltersBar, { Filters, BridgeOrBeacon } from './FiltersBar'
import NavBar from './Navbar'
import { DetectedBridge } from './BeaconMap'
import { ISettings } from './SettingsModal'
import SideBarTableElement from './SideBarTableElement'

interface SideBarProps {
  className?: string
  detectedDevicesSum?: number
  bridges: DetectedBridge[]
  setSettings: (settings: ISettings) => void
  filters: Filters
  setFilters: (filters: Filters) => void
  onTableClick: (d: DetectedBridge) => void
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
                <div className="max-h-96 overflow-y-scroll">
                  <Table striped borderless hover className='whitespace-nowrap max-w-1/3'>
                    <thead>
                      <tr>
                        <th>Bridge</th>
                        <th>Devices</th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.bridges.map((d: DetectedBridge, idx: number) => {
                        // if this bridge is not in the filters (-1), show it
                        if (props.filters.bridges.indexOf(d.listenerName) === -1) {
                          return (
                            <SideBarTableElement
                              key={`sidebartable-${idx}`}
                              bridge={d}
                              idx={idx}
                              onClick={() => props.onTableClick(d)}
                            />
                          )
                        }
                      })}
                    </tbody>
                  </Table>
                </div>
                {
                  props.detectedDevicesSum ? <p>Total devices found: {props.detectedDevicesSum}</p>
                    : null
                }
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
