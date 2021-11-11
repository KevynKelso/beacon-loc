import React, { useState } from 'react';

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'

import FiltersBar from './FiltersBar'
import NavBar from './Navbar'
import { DetectedListener } from './BeaconMap'
import { ISettings } from './SettingsModal'

interface SideBarProps {
  className?: string
  detectedDevicesSum: number
  listeners: DetectedListener[]
  setSettings: (settings: ISettings) => void
}

export default function SideBar(props: SideBarProps) {
  const [showBridges, setShowBridges] = useState<boolean>(true)

  return (
    <div className={props.className} >
      <div className="shadow-md absolute bg-gray-100">
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
            {props.listeners.length > 0 ?
              <div>
                <Table striped borderless hover className='whitespace-nowrap'>
                  <thead>
                    <tr>
                      <th>Bridge</th>
                      <th>Number of devices at bridge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.listeners.map((d: DetectedListener) => {
                      return (
                        <tr onClick={() => console.log('hello!')}>
                          <td>{d.listenerName}</td>
                          <td>{d.numberOfBeacons}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
                <p>Total devices found: {props.detectedDevicesSum}</p>
              </div>
              : <p>No bridges publishing</p>
            }
            <FiltersBar />
          </div>
        }
      </div>
    </div>
  );
}
