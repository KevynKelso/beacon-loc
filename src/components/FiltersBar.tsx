import React, { useState } from "react";

import Button from 'react-bootstrap/Button'

import FiltersModal from './FiltersModal'

interface FiltersBarProps {
}

export default function FiltersBar() {
  const [showFilterBeaconsModal, setShowFilterBeaconsModal] = useState(false)
  const [showFilterListenersModal, setShowFilterListenersModal] = useState(false)

  function openFilterBeaconsModal(e: React.MouseEvent): void {
    e.preventDefault()
    setShowFilterBeaconsModal(true)
  }

  function openFilterListenersModal(e: React.MouseEvent): void {
    e.preventDefault()
    setShowFilterListenersModal(true)
  }

  return (
    <div className="flex mt-3">
      <Button
        onClick={(e) => openFilterBeaconsModal(e)}
        variant="primary"
      >
        Filter Beacons
      </Button>

      <Button
        onClick={(e) => openFilterListenersModal(e)}
        className='ml-2'
        variant="primary"
      >
        Filter Listeners
      </Button>
      <FiltersModal
        setShow={setShowFilterBeaconsModal}
        show={showFilterBeaconsModal}
        title="Filter beacons"
      >

      </FiltersModal>
      <FiltersModal
        setShow={setShowFilterListenersModal}
        show={showFilterListenersModal}
        title="Filter listeners"
      >
      </FiltersModal>
    </div>
  );
}
