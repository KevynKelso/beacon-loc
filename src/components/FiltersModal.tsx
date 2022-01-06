import { useState } from "react";

import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

interface ModalProps {
  availableItems: string[]
  setFilters: (filters: string[]) => void
  setShow: (show: boolean) => void
  show: boolean
  title: string
}

export default function FiltersModal(props: ModalProps) {
  const [unchecked, setUnchecked] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState<boolean>(true)

  // if it's in the filters, we remove it
  // otherwise, add it
  function onClickCheck(element: string) {
    if (unchecked.indexOf(element) === -1) {
      setUnchecked([...unchecked, element])
      return props.setFilters([...unchecked, element])
    }

    const newFilters: string[] = unchecked.filter((e: string) => e !== element)
    setUnchecked(newFilters)

    return props.setFilters(newFilters)
  }

  function onSubmitFilters() {
    props.setShow(false)
  }

  function onClickCheckAll() {
    setSelectAll(!selectAll)

    if (selectAll) {
      setUnchecked(props.availableItems)
      return props.setFilters(props.availableItems)
    }

    setUnchecked([])
    return props.setFilters([])
  }

  return (
    <Modal show={props.show} fullscreen={"lg-down"} onHide={() => props.setShow(false)}>
      <Modal.Header closeButton className="bg-em-primary">
        <Modal.Title className="text-white">{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Text className="text-muted">
          Unchecking an item will remove it from view on the sidebar and map.
        </Form.Text>
        <div className="flex flex-col max-h-96 overflow-scroll">
          <Form.Check
            className="place-self-center mt-2"
            defaultChecked={selectAll}
            label="Uncheck all"
            onClick={() => onClickCheckAll()}
            type="checkbox"
          />
          {props.availableItems.map((element: string, idx: number) => {
            return (
              <Form.Check
                checked={!(unchecked.indexOf(element) !== -1)}
                className="mt-2"
                key={idx}
                label={element}
                onClick={() => onClickCheck(element)}
                type="checkbox"
              />
            )
          })
          }
        </div>
        <div className="grid mt-5">
          <Button
            className="bg-em-primary border-none justify-self-end"
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
