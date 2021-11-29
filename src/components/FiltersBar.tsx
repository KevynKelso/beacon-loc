import React, { useState } from "react";

import Button from 'react-bootstrap/Button'

import FiltersModal from './FiltersModal'

export type BridgeOrBeacon = 'BRIDGE' | 'BEACON'

export interface Filters {
  bridges: string[]
  beacons: string[]
}

interface FiltersBarProps {
  availableBeacons?: string[]
  availableBridges?: string[]
  updateFilters: (type: BridgeOrBeacon, elements: string[]) => void
  existingFilters: Filters
}

export default function FiltersBar(props: FiltersBarProps) {
  //const [showFilterBeaconsModal, setShowFilterBeaconsModal] = useState(false)
  const [showFilterBridgesModal, setShowFilterBridgesModal] = useState(false)

  //const filterBeaconsTitle: string = "Filter beacons"
  const filterBridgesTitle: string = "Filter bridges"

  //function openFilterBeaconsModal(e: React.MouseEvent): void {
  //e.preventDefault()
  //setShowFilterBeaconsModal(true)
  //}

  function openFilterBridgesModal(e: React.MouseEvent): void {
    e.preventDefault()
    setShowFilterBridgesModal(true)
  }

  return (
    <div className="flex mt-3">
      {/*{
        props.availableBeacons?.length ?
          <>
            <Button
              onClick={(e) => openFilterBeaconsModal(e)}
              variant="primary"
            >
              {filterBeaconsTitle}
            </Button>
            <FiltersModal
              existingFilters={props.existingFilters.beacons}
              availableItems={props.availableBeacons}
              setFilters={(elements: string[]) => props.updateFilters('BEACON', elements)}
              setShow={setShowFilterBeaconsModal}
              show={showFilterBeaconsModal}
              title={filterBeaconsTitle}
            />
          </>
          : null
      }
        */}
      {props.availableBridges?.length ?
        <>
          <Button
            onClick={(e) => openFilterBridgesModal(e)}
            //className='ml-2'
            variant="primary"
          >
            {filterBridgesTitle}
          </Button>
          <FiltersModal
            availableItems={props.availableBridges}
            //existingFilters={props.existingFilters.bridges}
            setFilters={(elements: string[]) => props.updateFilters('BRIDGE', elements)}
            setShow={setShowFilterBridgesModal}
            show={showFilterBridgesModal}
            title={filterBridgesTitle}
          />
        </>
        : null
      }
    </div>
  );
}
