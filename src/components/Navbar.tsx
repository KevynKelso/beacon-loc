import React, { useState } from "react";

import Button from 'react-bootstrap/Button'
import SettingsModal, { ISettings } from './SettingsModal'

interface NavbarProps {
  setSettings: (settings: ISettings) => void
  className?: string
}

export default function Navbar(props: NavbarProps) {
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  function openSettingsModal(e: React.MouseEvent): void {
    e.preventDefault()
    setShowSettingsModal(true)
  }

  return (
    <div className={props.className}>
      <Button
        onClick={(e) => openSettingsModal(e)}
        variant="outline-primary"
      >
        Settings
      </Button>
      <SettingsModal
        setSettings={props.setSettings}
        setShow={setShowSettingsModal}
        show={showSettingsModal}
      >
      </SettingsModal>
    </div >
  );
}
