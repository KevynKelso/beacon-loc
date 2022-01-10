import React from "react";

import Form from 'react-bootstrap/Form'

import { DefaultSettings } from './SettingsModal'

interface SettingsMessageProcessingProps {
  definitivelyHereRSSI: number
  globalTimeout: number
  localTimeout: number
  lostDistance: number
  setDefinitivelyHereRSSI: (difinitivelyHereRSSI: number) => void
  setGlobalTimeout: (globalTimeout: number) => void
  setLocalTimeout: (localTimeout: number) => void
  setLostDistance: (lostDistance: number) => void
}

export default function SettingsMessageProcessing({
  definitivelyHereRSSI,
  globalTimeout,
  localTimeout,
  lostDistance,
  setDefinitivelyHereRSSI,
  setGlobalTimeout,
  setLocalTimeout,
  setLostDistance,
}: SettingsMessageProcessingProps) {
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

  return (
    <Form>
      <h3 className="mt-4 text-em-primary text-2xl">Message processing</h3>
      <Form.Group className="ml-2" controlId="formLocalTimeout">
        <Form.Label>Local timeout: {localTimeout} seconds</Form.Label>
        <Form.Control type="number" onChange={onChangeLocalTimeout} />
        <Form.Text className="text-muted">
          Time required to transfer beacon ownership if a bridge stops publishing and another bridge is seeing the same beacon.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mt-4 ml-2" controlId="formGlobalTimeout">
        <div className="flex">
          <Form.Label>Global timeout: {globalTimeout / 60} minutes</Form.Label>
          <p className="ml-3 text-red-400">development in progress</p>
        </div>
        <Form.Control type="number" onChange={onChangeGlobalTimeout} />
        <Form.Text className="text-muted">
          Time required for a beacon to be considered lost if nobody sees it.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mt-4 ml-2" controlId="formLostDistance">
        <Form.Label>Lost Distance: ~{lostDistance * 100} km</Form.Label>
        <Form.Control type="number" onChange={onChangeLostDistance} />
        <Form.Text className="text-muted">
          If a bridge gets this far away from a beacon, the beacon disassociates with the bridge and groups itself separately.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mt-4 ml-2" controlId="formDefinitiveRSSI">
        <Form.Label>Definitive RSSI {definitivelyHereRSSI} dB</Form.Label>
        <Form.Range onChange={onChangeDefinitivelyHereRSSI} />
        <Form.Text className="text-muted">
          If a bridge sees an RSSI this good, it is definitely at that bridge.
        </Form.Text>
      </Form.Group>
    </Form>

  );
}
