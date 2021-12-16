import React, { useState } from "react";

import { useMqttState } from 'mqtt-react-hooks';

import Button from 'react-bootstrap/Button'
import SettingsModal, { ISettings } from './SettingsModal'

interface NavbarProps {
  showBridges: boolean
  setSettings: (settings: ISettings) => void
  className?: string
}

export default function Navbar(props: NavbarProps) {
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const { connectionStatus } = useMqttState();
  let settingsButtonColor: string = props.showBridges ? "outline-danger" : "danger"
  if (connectionStatus === "Connected" && !props.showBridges) settingsButtonColor = "success"
  if (connectionStatus === "Connected" && props.showBridges) settingsButtonColor = "outline-success"
  if (connectionStatus === "Connecting" && !props.showBridges) settingsButtonColor = "warning"
  if (connectionStatus === "Connecting" && props.showBridges) settingsButtonColor = "outline-warning"

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
