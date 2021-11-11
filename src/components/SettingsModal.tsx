import React, { useState } from "react";

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

import Status from './Status';

export interface ISettings {
  definitivelyHereRSSI: number  // dB
  globalTimeout: number         // seconds
  localTimeout: number          // seconds
  //mapUpateTime: number          // seconds
}

export const DefaultSettings: ISettings = {
  definitivelyHereRSSI: -40, //-40 dB might be a good default idk
  globalTimeout: 5 * 60,     // 5 mins
  localTimeout: 5,           // 5 seconds
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
      definitivelyHereRSSI: definitivelyHereRSSI,
      globalTimeout: globalTimeout,
      localTimeout: localTimeout,
      //mapUpateTime: mapUpdateTime,
    }

    props.setSettings(settings)
    props.setShow(false)
  }

  // we might not need this after all
  //
  //const GOOGLE_API_REQUEST_COST: number = 0.007
  //const [mapUpdateTime, setMapUpdateTime] = useState<number>(DefaultSettings.mapUpateTime)
  //function onChangeMapUpdateTime(e: React.ChangeEvent<HTMLInputElement>) {
  //e.preventDefault()
  //const value: number = parseInt(e.target.value, 10)
  //setMapUpdateTime(value || DefaultSettings.mapUpateTime)
  //}
  //<Form.Group className="mt-5" controlId="formGlobalTimeout">
  //<Form.Label>Map update time: {mapUpdateTime} seconds</Form.Label>
  //<Form.Control type="number" onChange={onChangeMapUpdateTime} />
  //<Form.Text className="text-muted">
  //Time required for map to update if there is a change in beacon whereabouts
  //</Form.Text>
  //<div>
  //<Form.Text className="text-red-500">
  //Estimated runtime cost: {Math.round(GOOGLE_API_REQUEST_COST * (3600 / mapUpdateTime) * 1e4) / 1e4} USD per hour
  //</Form.Text>
  //</div>
  //</Form.Group>

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
