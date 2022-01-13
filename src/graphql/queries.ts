/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRawMqtt = /* GraphQL */ `
  query GetRawMqtt($id: ID!) {
    getRawMqtt(id: $id) {
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
export const listRawMqtts = /* GraphQL */ `
  query ListRawMqtts(
    $filter: ModelRawMqttFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRawMqtts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
