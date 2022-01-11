import { useState } from 'react';

import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'

import FiltersBar, { Filters, BridgeOrBeacon } from './FiltersBar'
import NavBar from './Navbar'
import { DetectedBridge } from './MqttListener'
import { ISettings } from './settings/SettingsModal'
import SideBarTableElement from './SideBarTableElement'
import { MapCoords } from './BeaconMap'

interface SideBarProps {
  loading: boolean
  activeMarker: number
  bridges: DetectedBridge[]
  className?: string
  detectedDevicesSum?: number
  filters: Filters
  myLocation?: MapCoords
  onGoToClick: (d: DetectedBridge) => void
  onTableClick: (d: DetectedBridge) => void
  setFilters: (filters: Filters) => void
  setMapCenterMyLocation: () => void
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
      <div className={showBridges ? "p-3 shadow-md absolute bg-gray-100" : "p-3 absolute"}>
        <div className="flex">
          <Button
            onClick={() => setShowBridges(!showBridges)}
            className={showBridges ? "" : "bg-em-primary border-none"}
            variant={showBridges ? "secondary" : "primary"}
          >
            {showBridges ? "Hide table view" : "Show table view"}
          </Button>
          <NavBar
            className="ml-2"
            setSettings={props.setSettings}
            showBridges={showBridges}
            myLocation={props.myLocation}
          />
        </div>
        {showBridges &&
          <div className="mt-3">
            <p className="text-em-primary text-2xl font-bold">DETECTED BRIDGES</p>
            {props.loading &&
              <Spinner className="text-em-primary" animation="border" role="status"> <span className="visually-hidden">Loading...</span> </Spinner>
            }
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
                        return <></>
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
              : <p className="text-em-primary">No messages in the last hour</p>
            }
            <div className="flex mt-3">
              <FiltersBar
                availableBeacons={["test", "tes"]}
                availableBridges={props.bridges.map((d: DetectedBridge) => d.bridgeName)}
                updateFilters={updateFilters}
                existingFilters={props.filters}
              />
              <Button
                onClick={() => props.setMapCenterMyLocation()}
                className="bg-em-primary border-none ml-2"
                variant="primary"
              >
                Center on me
              </Button>
            </div>
          </div>
        }
      </div>
    </div>
  );
}
