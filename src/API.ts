/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateRawMqttInput = {
  bridgeLat: number,
  bridgeLng: number,
  ts: string,
  bridgeName: string,
  beaconMac: string,
  rssi: number,
  pdu: number,
  id?: string | null,
};

export type ModelRawMqttConditionInput = {
  bridgeLat?: ModelFloatInput | null,
  bridgeLng?: ModelFloatInput | null,
  ts?: ModelStringInput | null,
  bridgeName?: ModelStringInput | null,
  beaconMac?: ModelStringInput | null,
  rssi?: ModelFloatInput | null,
  pdu?: ModelFloatInput | null,
  and?: Array< ModelRawMqttConditionInput | null > | null,
  or?: Array< ModelRawMqttConditionInput | null > | null,
  not?: ModelRawMqttConditionInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type rawMqtt = {
  __typename: "rawMqtt",
  bridgeLat: number,
  bridgeLng: number,
  ts: string,
  bridgeName: string,
  beaconMac: string,
  rssi: number,
  pdu: number,
  id: string,
  createdAt: string,
  updatedAt: string,
};

export type UpdateRawMqttInput = {
  bridgeLat?: number | null,
  bridgeLng?: number | null,
  ts?: string | null,
  bridgeName?: string | null,
  beaconMac?: string | null,
  rssi?: number | null,
  pdu?: number | null,
  id: string,
};

export type DeleteRawMqttInput = {
  id: string,
};

export type ModelRawMqttFilterInput = {
  bridgeLat?: ModelFloatInput | null,
  bridgeLng?: ModelFloatInput | null,
  ts?: ModelStringInput | null,
  bridgeName?: ModelStringInput | null,
  beaconMac?: ModelStringInput | null,
  rssi?: ModelFloatInput | null,
  pdu?: ModelFloatInput | null,
  and?: Array< ModelRawMqttFilterInput | null > | null,
  or?: Array< ModelRawMqttFilterInput | null > | null,
  not?: ModelRawMqttFilterInput | null,
};

export type ModelRawMqttConnection = {
  __typename: "ModelRawMqttConnection",
  items:  Array<rawMqtt | null >,
  nextToken?: string | null,
};

export type CreateRawMqttMutationVariables = {
  input: CreateRawMqttInput,
  condition?: ModelRawMqttConditionInput | null,
};

export type CreateRawMqttMutation = {
  createRawMqtt?:  {
    __typename: "rawMqtt",
    bridgeLat: number,
    bridgeLng: number,
    ts: string,
    bridgeName: string,
    beaconMac: string,
    rssi: number,
    pdu: number,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateRawMqttMutationVariables = {
  input: UpdateRawMqttInput,
  condition?: ModelRawMqttConditionInput | null,
};

export type UpdateRawMqttMutation = {
  updateRawMqtt?:  {
    __typename: "rawMqtt",
    bridgeLat: number,
    bridgeLng: number,
    ts: string,
    bridgeName: string,
    beaconMac: string,
    rssi: number,
    pdu: number,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteRawMqttMutationVariables = {
  input: DeleteRawMqttInput,
  condition?: ModelRawMqttConditionInput | null,
};

export type DeleteRawMqttMutation = {
  deleteRawMqtt?:  {
    __typename: "rawMqtt",
    bridgeLat: number,
    bridgeLng: number,
    ts: string,
    bridgeName: string,
    beaconMac: string,
    rssi: number,
    pdu: number,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetRawMqttQueryVariables = {
  id: string,
};

export type GetRawMqttQuery = {
  getRawMqtt?:  {
    __typename: "rawMqtt",
    bridgeLat: number,
    bridgeLng: number,
    ts: string,
    bridgeName: string,
    beaconMac: string,
    rssi: number,
    pdu: number,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListRawMqttsQueryVariables = {
  filter?: ModelRawMqttFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListRawMqttsQuery = {
  listRawMqtts?:  {
    __typename: "ModelRawMqttConnection",
    items:  Array< {
      __typename: "rawMqtt",
      bridgeLat: number,
      bridgeLng: number,
      ts: string,
      bridgeName: string,
      beaconMac: string,
      rssi: number,
      pdu: number,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateRawMqttSubscription = {
  onCreateRawMqtt?:  {
    __typename: "rawMqtt",
    bridgeLat: number,
    bridgeLng: number,
    ts: string,
    bridgeName: string,
    beaconMac: string,
    rssi: number,
    pdu: number,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateRawMqttSubscription = {
  onUpdateRawMqtt?:  {
    __typename: "rawMqtt",
    bridgeLat: number,
    bridgeLng: number,
    ts: string,
    bridgeName: string,
    beaconMac: string,
    rssi: number,
    pdu: number,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteRawMqttSubscription = {
  onDeleteRawMqtt?:  {
    __typename: "rawMqtt",
    bridgeLat: number,
    bridgeLng: number,
    ts: string,
    bridgeName: string,
    beaconMac: string,
    rssi: number,
    pdu: number,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};
