import React from "react";

import Form from 'react-bootstrap/Form'


interface SettingsMqttProps {
  subscribeTopic: string
  setSubscribeTopic: (topic: string) => void

}

export default function SettingsTopicLocations(props: SettingsMqttProps) {
  function onChangeTopic(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    props.setSubscribeTopic(e.target.value)
  }

  return (
    <Form>
      <h3 className="mt-4 text-em-primary text-2xl">MQTT</h3>
      <Form.Group className="ml-2" controlId="formMqtt">
        <Form.Label className="mt-3">Subscribe to topic: {props.subscribeTopic}</Form.Label>
        <Form.Control onChange={onChangeTopic} type="text" placeholder="Enter the topic name your bridge will publish to" />
        <Form.Text className="text-muted">
          Changing topic may require resetting information in the database. Otherwise, previously recorded information (on the old topic) will still be present when old data needs to be pulled from the database.
        </Form.Text>
        <p className="mt-3 text-em-primary">Note: to permanently change the topic, the environment variables must be changed.</p>
      </Form.Group>
    </Form>
  )
}
