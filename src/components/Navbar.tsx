import React, { useState } from "react";

import { useMqttState } from 'mqtt-react-hooks';

import Button from 'react-bootstrap/Button'
import SettingsModal, { ISettings } from './SettingsModal'

interface NavbarProps {
  setSettings: (settings: ISettings) => void
  className?: string
}

export default function Navbar(props: NavbarProps) {
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const { connectionStatus } = useMqttState();
  const settingsButtonColor: string =
    connectionStatus === "Connecting" ? "outline-warning" :
      connectionStatus === "Connected" ? "outline-success" : "outline-danger"

  function openSettingsModal(e: React.MouseEvent): void {
    e.preventDefault()
    setShowSettingsModal(true)
  }

  return (
    <div className={props.className}>
      <Button
        onClick={(e) => openSettingsModal(e)}
        variant={settingsButtonColor}
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
