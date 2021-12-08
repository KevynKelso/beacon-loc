import React, { useState } from "react";

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

import Status from './Status'

import { getCurrentTimestamp, formatTimestamp, replaceDateInTs, replaceTimeInTs } from '../utils/timestamp'

export interface ISettings {
  definitivelyHereRSSI: number  // dB
  globalTimeout: number         // seconds
  localTimeout: number          // seconds
  lostDistance: number          // km * 10^-2 ... Stupid I know, but this is best for coordinates
  sinceTime: number             // same timestamp format as json mqtt data
}

export const DefaultSettings: ISettings = {
  definitivelyHereRSSI: -40, //-40 dB might be a good default idk
  globalTimeout: 5 * 60,     // 5 mins
  localTimeout: 5,           // 5 seconds
  lostDistance: 0.01,         // approximately 1km
  sinceTime: getCurrentTimestamp(),
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
  const [sinceTime, setSinceTime] = useState<number>(DefaultSettings.sinceTime)

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

  function onChangeDate(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setSinceTime(replaceDateInTs(e.target.value, sinceTime))
  }

  function onChangeTime(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setSinceTime(replaceTimeInTs(e.target.value, sinceTime))
  }

  function onReset() {
    setSinceTime(getCurrentTimestamp())
  }

  function onSubmitSettings() {
    const settings: ISettings = {
      definitivelyHereRSSI: definitivelyHereRSSI,
      globalTimeout: globalTimeout,
      localTimeout: localTimeout,
      lostDistance: lostDistance,
      sinceTime: sinceTime,
      //mapUpateTime: mapUpdateTime,
    }

    props.setSettings(settings)
    props.setShow(false)
  }

  return (
    <Modal show={props.show} fullscreen={"lg-down"} onHide={() => props.setShow(false)}>
      <Modal.Header closeButton className="bg-steel-teal">
        <Modal.Title className="mr-3 text-white">Settings</Modal.Title>
        <Status />
      </Modal.Header>
      <Modal.Body>

        <Form>
          <Form.Group controlId="formSinceTime">
            <div className="flex">
              <Form.Label className="flex-grow">Messages since: {formatTimestamp(sinceTime)}</Form.Label>
              <Button
                className="mr-2"
                size="sm"
                onClick={() => setSinceTime(0)}
                variant="danger"
              >
                All messages
              </Button>
              <Button
                size="sm"
                onClick={onReset}
                variant="success"
              >
                Reset
              </Button>
            </div>
            <Form.Control className="mt-1" type="date" value={formatTimestamp(sinceTime).split(' ')[0]} onChange={onChangeDate} />
            <Form.Control className="mt-1" type="time" value={formatTimestamp(sinceTime).split(' ')[1]} onChange={onChangeTime} />
            <Form.Text className="text-muted">
              Pull messages from database since this date.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mt-4" controlId="formLocalTimeout">
            <Form.Label>Local timeout: {localTimeout} seconds</Form.Label>
            <Form.Control type="number" onChange={onChangeLocalTimeout} />
            <Form.Text className="text-muted">
              Time required to transfer beacon ownership if a bridge stops publishing and another bridge is seeing the same beacon.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mt-4" controlId="formGlobalTimeout">
            <Form.Label>Global timeout: {globalTimeout / 60} minutes</Form.Label>
            <Form.Control type="number" onChange={onChangeGlobalTimeout} />
            <Form.Text className="text-muted">
              Time required for a beacon to be considered lost if nobody sees it.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mt-4" controlId="formLostDistance">
            <Form.Label>Lost Distance: ~{lostDistance * 100} km</Form.Label>
            <Form.Control type="number" onChange={onChangeLostDistance} />
            <Form.Text className="text-muted">
              If a bridge gets this far away from a beacon, the beacon disassociates with the bridge and groups itself separately.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mt-4" controlId="formDefinitiveRSSI">
            <Form.Label>Definitive RSSI {definitivelyHereRSSI} dB</Form.Label>
            <Form.Range onChange={onChangeDefinitivelyHereRSSI} />
            <Form.Text className="text-muted">
              If a bridge sees an RSSI this good, it is definitely at that bridge.
            </Form.Text>
          </Form.Group>
        </Form>

        <div className="grid mt-4">
          <Button className="justify-self-end" variant="primary" type="submit" onClick={onSubmitSettings}>
            Save and close
          </Button>
        </div>

        {props.children}
      </Modal.Body>
    </Modal >
  );
}
