import React from "react";

import Modal from 'react-bootstrap/Modal'

interface ModalProps {
  children?: React.ReactNode
  setShow: (show: boolean) => void
  show: boolean
  title: string
}

export default function FiltersModal(props: ModalProps) {
  return (
    <Modal show={props.show} fullscreen={"lg-down"} onHide={() => props.setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
    </Modal>
  );
}
