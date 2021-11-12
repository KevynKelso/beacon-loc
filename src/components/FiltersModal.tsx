import { useState } from "react";

import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

interface ModalProps {
  availableItems: string[]
  existingFilters: string[]
  setFilters: (filters: string[]) => void
  setShow: (show: boolean) => void
  show: boolean
  title: string
}

export default function FiltersModal(props: ModalProps) {
  // if it's in the filters, we remove it
  // otherwise, add it
  function onClickCheck(element: string) {
    const idx: number = props.existingFilters.indexOf(element)
    // in the filters array, need to remove it
    if (idx > -1) {
      props.existingFilters.splice(idx, 1)
      return props.setFilters(props.existingFilters)
    }

    // not in the filters array, need to add it
    return props.setFilters([...props.existingFilters, element])
  }

  function onSubmitFilters() {
    props.setShow(false)
  }

  return (
    <Modal show={props.show} fullscreen={"lg-down"} onHide={() => props.setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Text className="text-muted">
          Unchecking an item will remove it from view on the sidebar and map.
        </Form.Text>
        {props.availableItems.map((element: string) => {
          return (
            <Form.Check
              className="mt-2"
              defaultChecked={props.existingFilters.indexOf(element) === -1 ? true : false}
              label={element}
              onClick={() => onClickCheck(element)}
              type="checkbox"
            />
          )
        })
        }
        <div className="grid mt-5">
          <Button
            className="justify-self-end"
            onClick={onSubmitFilters}
            type="submit"
            variant="primary"
          >
            Save and close
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
