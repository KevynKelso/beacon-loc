import React, { useState, useEffect } from "react";

import { useEasybase } from 'easybase-react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { MapCoords } from '../BeaconMap'

interface TopicLocation {
  name: string
  coords: MapCoords
}

interface SettingsTopicLocationsProps {
  myLocation?: MapCoords
}

export default function SettingsTopicLocations({ myLocation }: SettingsTopicLocationsProps) {
  const { db } = useEasybase()

  const defaultTopicLoc: TopicLocation = { name: '', coords: myLocation || { lat: 0, lng: 0 } }
  const [topicLoc, setTopicLoc] = useState<TopicLocation>(defaultTopicLoc)

  const fetchRecords = async () => {
    return await db("TOPIC LOCATIONS")
      .return().all() as Record<string, any>[]
  }

  function onChangeTopicName(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setTopicLoc({ name: e.target.value, coords: topicLoc.coords })
  }

  function onChangeTopicLat(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    let value: number = parseFloat(e.target.value)
    const coords: MapCoords = { lat: value, lng: topicLoc.coords.lng }
    setTopicLoc({ name: topicLoc.name, coords: coords })
  }

  function onChangeTopicLng(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    let value: number = parseFloat(e.target.value)
    const coords: MapCoords = { lat: value, lng: topicLoc.coords.lng }
    setTopicLoc({ name: topicLoc.name, coords: coords })
  }

  useEffect(() => {
    let tl: TopicLocation = topicLoc
    if (myLocation) tl.coords = myLocation
    setTopicLoc(tl)
  }, [myLocation])

  return (
    <Form>
      <h3 className="mt-4 text-red-500">This feature is still in development</h3>
      <h3 className="mt-4 text-em-primary">Topic locations</h3>
      <Form.Group className="ml-2" controlId="formTopicLocations">
        <Form.Label className="mt-3">Topic name: {topicLoc.name}</Form.Label>
        <Form.Control disabled onChange={onChangeTopicName} type="text" placeholder="Enter the topic name your bridge will publish to" />

        <Form.Label className="mt-3">Topic latitude: {topicLoc.coords.lat} degrees</Form.Label>
        <Form.Control disabled type="number" onChange={onChangeTopicLat} />

        <Form.Label className="mt-3">Topic longitude: {topicLoc.coords.lng} degrees</Form.Label>
        <Form.Control disabled type="number" onChange={onChangeTopicLng} />

        <Form.Text className="text-muted">
          Topic locations are for bridges who don't have the capability to report their locations.
        </Form.Text>
      </Form.Group>
      <div className="flex">
        <Button
          className="mt-3 ml-2"
          variant="danger"
          size="sm"
          disabled
        >
          Submit topic location
        </Button>
        <Button
          onClick={() => fetchRecords().then((records) => console.log(records))}
          className="mt-3 ml-2"
          variant="success"
          size="sm"
          disabled
        >
          Show existing topic locations
        </Button>
      </div>
    </Form>
  );
}
