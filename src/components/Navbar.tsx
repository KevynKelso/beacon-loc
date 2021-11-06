import React, { useState, useEffect } from "react";
import { useSubscription } from 'mqtt-react-hooks'

import Button from 'react-bootstrap/Button'
import FiltersModal from './FiltersModal'
import SettingsModal from './SettingsModal'

export default function Navbar() {
  const [showFilterBeaconsModal, setShowFilterBeaconsModal] = useState(false)
  const [showFilterListenersModal, setShowFilterListenersModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  function openFilterBeaconsModal(e: React.MouseEvent): void {
    e.preventDefault()
    setShowFilterBeaconsModal(true)
  }

  function openFilterListenersModal(e: React.MouseEvent): void {
    e.preventDefault()
    setShowFilterListenersModal(true)
  }

  function openSettingsModal(e: React.MouseEvent): void {
    e.preventDefault()
    setShowSettingsModal(true)
  }

  const { message } = useSubscription('test');

  useEffect(() => {
    console.log(message)
  }, [message])


  return (
    <div>
      <Button
        onClick={(e) => openFilterBeaconsModal(e)}
        className='m-2'
        variant="primary"
      >
        Filter Beacons
      </Button>

      <Button
        onClick={(e) => openFilterListenersModal(e)}
        className='m-2'
        variant="primary"
      >
        Filter Listeners
      </Button>
      <Button
        onClick={(e) => openSettingsModal(e)}
        className='m-2'
        variant="outline-primary"
      >
        Settings
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
      <SettingsModal
        setShow={setShowSettingsModal}
        show={showSettingsModal}
      >
      </SettingsModal>
    </div >
  );
}
