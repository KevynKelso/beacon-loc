import { useState } from "react";

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Nav from 'react-bootstrap/Nav'
import CloseButton from 'react-bootstrap/CloseButton'

import Status from '../Status'
import SettingsDatabase from './SettingsDatabase'
import SettingsMessageProcessing from './SettingsMessageProcessing'
import SettingsTopicLocations from './SettingsTopicLocations'
import SettingsMqtt from './SettingsMqtt'
import { MapCoords } from '../BeaconMap'

import { getCurrentTimestamp } from '../../utils/timestamp'
import Environment from '../../environment.config'


export interface ISettings {
  definitivelyHereRSSI: number  // dB
  errorReports: boolean         // used for whether or not to send logging email to EM
  globalTimeout: number         // seconds
  localTimeout: number          // seconds
  lostDistance: number          // km * 10^-2 ... Stupid I know, but this is best for coordinates
  sinceTime: number             // same timestamp format as json mqtt data
  subscribeTopic: string        // topic this app will subscribe to
}

export const DefaultSettings: ISettings = {
  definitivelyHereRSSI: -40, //-40 dB might be a good default idk
  errorReports: false,
  globalTimeout: 5 * 60,     // 5 mins
  localTimeout: 5,           // 5 seconds
  lostDistance: 0.01,         // approximately 1km
  sinceTime: getCurrentTimestamp(),
  subscribeTopic: Environment().mqttTopic, // EM Beacon
}

export interface TopicLocation {
  name: string
  coords: MapCoords
}

interface SettingsModalProps {
  errorReports: boolean
  myLocation?: MapCoords
  setSettings: (settings: ISettings) => void
  setShow: (show: boolean) => void
  show: boolean
}

export default function SettingsModal(props: SettingsModalProps) {
  const [definitivelyHereRSSI, setDefinitivelyHereRSSI] = useState<number>(DefaultSettings.definitivelyHereRSSI)
  const [globalTimeout, setGlobalTimeout] = useState<number>(DefaultSettings.globalTimeout)
  const [localTimeout, setLocalTimeout] = useState<number>(DefaultSettings.localTimeout)
  const [lostDistance, setLostDistance] = useState<number>(DefaultSettings.lostDistance)
  const [sinceTime, setSinceTime] = useState<number>(DefaultSettings.sinceTime)
  const [subscribeTopic, setSubscribeTopic] = useState<string>(DefaultSettings.subscribeTopic)

  // component state
  const [tab, setTab] = useState<number>(1)
  const [showQR, setShowQR] = useState<boolean>(false)

  function onSubmitSettings() {
    const settings: ISettings = {
      definitivelyHereRSSI: definitivelyHereRSSI,
      errorReports: props.errorReports,
      globalTimeout: globalTimeout,
      localTimeout: localTimeout,
      lostDistance: lostDistance,
      sinceTime: sinceTime,
      subscribeTopic: subscribeTopic,
    }

    props.setSettings(settings)
    props.setShow(false)
  }
  return (
    <Modal show={props.show} fullscreen={"lg-down"} onHide={() => props.setShow(false)}>
      <Modal.Header className="bg-em-primary">
        <Modal.Title className="mr-3 text-white">Settings</Modal.Title>
        <Status />
        <CloseButton aria-label="Hide" variant="white" onClick={() => props.setShow(false)} />
      </Modal.Header>
      <Modal.Body>

        <Nav className="border-em-primary border-b" fill variant="tabs" defaultActiveKey="/home">
          <Nav.Item onClick={() => setTab(1)}>
            <Nav.Link className="text-em-primary">Database</Nav.Link>
          </Nav.Item>
          <Nav.Item onClick={() => setTab(2)}>
            <Nav.Link className="text-em-primary">Message processing</Nav.Link>
          </Nav.Item>
          <Nav.Item onClick={() => setTab(3)}>
            <Nav.Link className="text-em-primary">Topic locations</Nav.Link>
          </Nav.Item>
          <Nav.Item onClick={() => setTab(4)}>
            <Nav.Link className="text-em-primary">MQTT</Nav.Link>
          </Nav.Item>
        </Nav>

        {tab === 1 &&
          <SettingsDatabase sinceTime={sinceTime} setSinceTime={setSinceTime} />
        }
        {tab === 2 &&
          <SettingsMessageProcessing
            definitivelyHereRSSI={definitivelyHereRSSI}
            globalTimeout={globalTimeout}
            localTimeout={localTimeout}
            lostDistance={lostDistance}
            setDefinitivelyHereRSSI={setDefinitivelyHereRSSI}
            setGlobalTimeout={setGlobalTimeout}
            setLocalTimeout={setLocalTimeout}
            setLostDistance={setLostDistance}
          />
        }
        {tab === 3 &&
          <SettingsTopicLocations myLocation={props.myLocation} />
        }
        {tab === 4 &&
          <SettingsMqtt subscribeTopic={subscribeTopic} setSubscribeTopic={setSubscribeTopic} />
        }
        <div className="flex mt-4">
          <div className="flex-grow">
            <Button className="bg-em-primary border-none justify-self-end" variant="primary" onClick={() => setShowQR(!showQR)}>
              {showQR ? "Hide QR code" : "Show QR code"}
            </Button>
          </div>
          <Button className="bg-em-primary border-none justify-self-end" variant="primary" type="submit" onClick={onSubmitSettings}>
            Save and close
          </Button>
        </div>
        {showQR &&
          <>
            <div className="flex">
              <img src='/apk-qr.png' alt='https://www.embeacons.com/em-ble-bridge.apk' />
              <p className="mt-5 text-em-primary">Scan to download APK for EM BLE Bridge app</p>
            </div>
            <p className="mt-3 text-em-primary text-sm">Or alternatively go to https://fathomless-dawn-96149.herokuapp.com/em-ble-bridge.apk</p>
          </>
        }
      </Modal.Body>
    </Modal >
  );
}
