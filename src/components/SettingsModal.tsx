import React from "react";

import Modal from 'react-bootstrap/Modal'
import Status from './Status';

interface SettingsModalProps {
  children?: React.ReactNode
  setShow: (show: boolean) => void
  show: boolean
}
// TODO: add a form here for the various settings

export default function FiltersModal(props: SettingsModalProps) {
  return (
    <Modal show={props.show} fullscreen={"lg-down"} onHide={() => props.setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Status />
        {props.children}
      </Modal.Body>
    </Modal>
  );
}
