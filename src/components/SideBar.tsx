import { useState } from 'react';

import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'

import FiltersBar, { Filters, BridgeOrBeacon } from './FiltersBar'
import NavBar from './Navbar'
import { DetectedBridge } from './MqttListener'
import { ISettings } from './SettingsModal'
import SideBarTableElement from './SideBarTableElement'

interface SideBarProps {
  onGoToClick: (d: DetectedBridge) => void
  activeMarker: number
  bridges: DetectedBridge[]
  className?: string
  detectedDevicesSum?: number
  filters: Filters
  onTableClick: (d: DetectedBridge) => void
  setFilters: (filters: Filters) => void
  setSettings: (settings: ISettings) => void
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
            className={showBridges ? "" : "bg-em-primary border-none"}
            variant={showBridges ? "secondary" : "primary"}
          >
            {showBridges ? "Hide detected bridges" : "Show detected bridges"}
          </Button>
          <NavBar
            className="ml-2"
            setSettings={props.setSettings}
            showBridges={showBridges}
          />
        </div>
        {showBridges &&
          <div className="m-3">
            <p className="text-em-primary text-2xl font-bold">DETECTED BRIDGES</p>
            {props.bridges.length > 0 ?
              <div>
                <div className="max-h-96 overflow-y-scroll">
                  <Table striped borderless hover className='mt-3 bg-em-primary whitespace-nowrap w-64'>
                    <thead className="sticky top-0 bg-prussian-blue text-white">
                      <tr>
                        <th>Bridge</th>
                        <th>Devices</th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.bridges.map((d: DetectedBridge, idx: number) => {
                        // if this bridge is not in the filters (-1), show it
                        if (props.filters.bridges.indexOf(d.bridgeName) === -1) {
                          return (
                            <SideBarTableElement
                              activeMarker={props.activeMarker}
                              bridge={d}
                              idx={idx}
                              key={`sidebartable-${idx}`}
                              onClick={() => props.onTableClick(d)}
                              onGoToClick={props.onGoToClick}
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
              : <p className="text-em-primary">No messages in the last hour</p>
            }
            <FiltersBar
              availableBeacons={["test", "tes"]}
              availableBridges={props.bridges.map((d: DetectedBridge) => d.bridgeName)}
              updateFilters={updateFilters}
              existingFilters={props.filters}
            />
          </div>
        }
      </div>
    </div>
  );
}
