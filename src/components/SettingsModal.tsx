import React, { useState } from "react";

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

import Status from './Status';

export interface ISettings {
  debugMode: boolean
  definitivelyHereRSSI: number  // dB
  globalTimeout: number         // seconds
  localTimeout: number          // seconds
}

interface SettingsModalProps {
  children?: React.ReactNode
  setSettings: (settings: ISettings) => void
  setShow: (show: boolean) => void
  show: boolean
}

export const DefaultSettings: ISettings = {
  debugMode: false,
  definitivelyHereRSSI: -40,
  globalTimeout: 5 * 60,
  localTimeout: 5,
}

export default function SettingsModal(props: SettingsModalProps) {

  const [definitivelyHereRSSI, setDefinitivelyHereRSSI] = useState<number>(DefaultSettings.definitivelyHereRSSI)
  const [localTimeout, setLocalTimeout] = useState<number>(DefaultSettings.localTimeout)
  const [globalTimeout, setGlobalTimeout] = useState<number>(DefaultSettings.globalTimeout)
  const [debugMode, setDebugMode] = useState<boolean>(DefaultSettings.debugMode)

  function onChangeDefinitivelyHereRSSI(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    const value: number = -parseInt(e.target.value, 10)
    setDefinitivelyHereRSSI(value || DefaultSettings.definitivelyHereRSSI)
  }

  function onChangeLocalTimeout(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    const value: number = parseInt(e.target.value, 10)
    setLocalTimeout(value || DefaultSettings.localTimeout)
  }

  function onChangeGlobalTimeout(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    const value: number = parseInt(e.target.value, 10) * 60
    setGlobalTimeout(value || DefaultSettings.globalTimeout)
  }

  function onSubmitSettings() {
    const settings: ISettings = {
      debugMode: debugMode,
      definitivelyHereRSSI: definitivelyHereRSSI,
      globalTimeout: globalTimeout,
      localTimeout: localTimeout,
    }

    props.setSettings(settings)
    props.setShow(false)
  }

  return (
    <Modal show={props.show} fullscreen={"lg-down"} onHide={() => props.setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Status />

        <Form>
          <Form.Group className="mt-5" controlId="formLocalTimeout">
            <Form.Label>Local timeout: {localTimeout} seconds</Form.Label>
            <Form.Control type="number" onChange={onChangeLocalTimeout} />
            <Form.Text className="text-muted">
              Time required to forget information if a bridge stops publishing and another bridge is seeing the same beacon
            </Form.Text>
          </Form.Group>

          <Form.Group className="mt-5" controlId="formGlobalTimeout">
            <Form.Label>Global timeout: {globalTimeout / 60} minutes</Form.Label>
            <Form.Control type="number" onChange={onChangeGlobalTimeout} />
            <Form.Text className="text-muted">
              Time required for a beacon to be considered lost if nobody sees it
            </Form.Text>
          </Form.Group>

          <Form.Group className="mt-5" controlId="formDefinitiveRSSI">
            <Form.Label>Definitive RSSI {definitivelyHereRSSI} dB</Form.Label>
            <Form.Range onChange={onChangeDefinitivelyHereRSSI} />
            <Form.Text className="text-muted">
              If a bridge sees an RSSI this good, it is definately at that bridge
            </Form.Text>
          </Form.Group>

          <Form.Switch
            className="mt-5"
            label="Toggle debug mode"
            onChange={() => setDebugMode(!debugMode)}
          />
        </Form>

        <div className="grid mt-5">
          <Button className="justify-self-end" variant="primary" type="submit" onClick={onSubmitSettings}>
            Save and close
          </Button>
        </div>

        {props.children}
      </Modal.Body>
    </Modal >
  );
}
