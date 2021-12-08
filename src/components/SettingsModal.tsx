import React, { useState } from "react";

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

import Status from './Status';

export interface ISettings {
  definitivelyHereRSSI: number  // dB
  globalTimeout: number         // seconds
  localTimeout: number          // seconds
  lostDistance: number
  //mapUpateTime: number          // seconds
}

export const DefaultSettings: ISettings = {
  definitivelyHereRSSI: -40, //-40 dB might be a good default idk
  globalTimeout: 5 * 60,     // 5 mins
  localTimeout: 5,           // 5 seconds
  lostDistance: 0.01         // approximately 1km
  //mapUpateTime: 1 * 60,
}

interface SettingsModalProps {
  children?: React.ReactNode
  setSettings: (settings: ISettings) => void
  setShow: (show: boolean) => void
  show: boolean
}

export default function SettingsModal(props: SettingsModalProps) {

  const [definitivelyHereRSSI, setDefinitivelyHereRSSI] = useState<number>(DefaultSettings.definitivelyHereRSSI)
  const [localTimeout, setLocalTimeout] = useState<number>(DefaultSettings.localTimeout)
  const [globalTimeout, setGlobalTimeout] = useState<number>(DefaultSettings.globalTimeout)
  const [lostDistance, setLostDistance] = useState<number>(DefaultSettings.lostDistance)

  function onChangeDefinitivelyHereRSSI(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    const value: number = -parseInt(e.target.value, 10)
    setDefinitivelyHereRSSI(value || DefaultSettings.definitivelyHereRSSI)
  }

  function onChangeLocalTimeout(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    let value: number = parseInt(e.target.value, 10)
    if (value < 0) value = DefaultSettings.localTimeout
    setLocalTimeout(value || DefaultSettings.localTimeout)
  }

  function onChangeGlobalTimeout(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    let value: number = parseInt(e.target.value, 10) * 60
    if (value < 0) value = DefaultSettings.globalTimeout
    setGlobalTimeout(value || DefaultSettings.globalTimeout)
  }

  function onChangeLostDistance(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    let value: number = parseFloat(e.target.value) * 0.01
    if (value < 0) value = DefaultSettings.lostDistance
    setLostDistance(value || DefaultSettings.lostDistance)
  }

  function onSubmitSettings() {
    const settings: ISettings = {
      definitivelyHereRSSI: definitivelyHereRSSI,
      globalTimeout: globalTimeout,
      localTimeout: localTimeout,
      lostDistance: lostDistance,
      //mapUpateTime: mapUpdateTime,
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
              Time required to transfer beacon ownership if a bridge stops publishing and another bridge is seeing the same beacon
            </Form.Text>
          </Form.Group>

          <Form.Group className="mt-5" controlId="formGlobalTimeout">
            <Form.Label>Global timeout: {globalTimeout / 60} minutes</Form.Label>
            <Form.Control type="number" onChange={onChangeGlobalTimeout} />
            <Form.Text className="text-muted">
              Time required for a beacon to be considered lost if nobody sees it
            </Form.Text>
          </Form.Group>

          <Form.Group className="mt-5" controlId="formLostDistance">
            <Form.Label>Lost Distance: ~{lostDistance * 100} km</Form.Label>
            <Form.Control type="number" onChange={onChangeLostDistance} />
            <Form.Text className="text-muted">
              If a bridge gets this far away from a beacon, the beacon disassociates with the bridge and groups itself separately. NOTE: This distance is highly approximate and based on the latitude/longitude coordinate system. Results will be highly inaccurate for distances larger than 1,000 km.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mt-5" controlId="formDefinitiveRSSI">
            <Form.Label>Definitive RSSI {definitivelyHereRSSI} dB</Form.Label>
            <Form.Range onChange={onChangeDefinitivelyHereRSSI} />
            <Form.Text className="text-muted">
              If a bridge sees an RSSI this good, it is definitely at that bridge
            </Form.Text>
          </Form.Group>
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
