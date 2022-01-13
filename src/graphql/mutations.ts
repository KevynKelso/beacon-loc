/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createRawMqtt = /* GraphQL */ `
  mutation CreateRawMqtt(
    $input: CreateRawMqttInput!
    $condition: ModelRawMqttConditionInput
  ) {
    createRawMqtt(input: $input, condition: $condition) {
      bridgeLat
      bridgeLng
      ts
      bridgeName
      beaconMac
      rssi
      pdu
      id
      createdAt
      updatedAt
    }
  }
`;
export const updateRawMqtt = /* GraphQL */ `
  mutation UpdateRawMqtt(
    $input: UpdateRawMqttInput!
    $condition: ModelRawMqttConditionInput
  ) {
    updateRawMqtt(input: $input, condition: $condition) {
      bridgeLat
      bridgeLng
      ts
      bridgeName
      beaconMac
      rssi
      pdu
      id
      createdAt
      updatedAt
    }
  }
`;
export const deleteRawMqtt = /* GraphQL */ `
  mutation DeleteRawMqtt(
    $input: DeleteRawMqttInput!
    $condition: ModelRawMqttConditionInput
  ) {
    deleteRawMqtt(input: $input, condition: $condition) {
      bridgeLat
      bridgeLng
      ts
      bridgeName
      beaconMac
      rssi
      pdu
      id
      createdAt
      updatedAt
    }
  }
`;
