import React from "react";

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { getCurrentTimestamp, formatTimestamp, replaceDateInTs, replaceTimeInTs } from '../../utils/timestamp'

interface SettingsDatabaseProps {
  sinceTime: number
  setSinceTime: (sinceTime: number) => void
}

export default function SettingsDatabase({ sinceTime, setSinceTime }: SettingsDatabaseProps) {
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

  return (
    <Form>
      <h3 className="mt-4 text-em-primary">Database</h3>
      <Form.Group className="ml-2" controlId="formSinceTime">
        <Form.Label className="flex-grow">Messages since: {formatTimestamp(sinceTime)}</Form.Label>
        <Form.Control className="mt-1" type="date" value={formatTimestamp(sinceTime).split(' ')[0]} onChange={onChangeDate} />
        <Form.Control className="mt-1" type="time" value={formatTimestamp(sinceTime).split(' ')[1]} onChange={onChangeTime} />
        <Form.Text className="text-muted">
          Pull messages from database since this date.
        </Form.Text>
        <div className="flex mt-2">
          <div className="flex-grow" />
          <Button
            className="mr-2"
            size="sm"
            onClick={() => setSinceTime(getCurrentTimestamp(-168))}
            variant="danger"
          >
            Last 7 days
          </Button>
          <Button
            className="mr-2"
            size="sm"
            onClick={() => setSinceTime(getCurrentTimestamp(-48))}
            variant="danger"
          >
            Last 2 days
          </Button>
          <Button
            size="sm"
            onClick={onReset}
            variant="success"
          >
            Reset
          </Button>
        </div>
      </Form.Group>
    </Form>
  );
}
