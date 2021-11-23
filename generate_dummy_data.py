import datetime
import json
import math
import random
import time

import paho.mqtt.client as mqtt

NUM_MESSAGES = 100
NUM_LISTENERS = 10
MAX_DIST = 0.02
TIME_BETWEEN_MSG = 0.01
HOME_LAT = 38.912387
HOME_LON = -104.819766


def get_random_element_from_list(li: list, max_num: int, existing: list = []) -> str:
    element = li[int(random.uniform(0, max_num))]
    count = 0
    while element in existing:
        element = li[int(random.uniform(0, max_num))]
        count += 1
        if count > 5:
            print("ERROR: add more elements to list")
            return element

    return element


def get_random_mac() -> str:
    lines = []
    with open("serial_mac.csv", "r") as f:
        lines = f.read().split("\n")

    return get_random_element_from_list(lines, len(lines)).split(",")[1]


def random_coords_close_to_home():
    lat = 38.912387 + random.uniform(-MAX_DIST, MAX_DIST)
    lon = -104.819766 + random.uniform(-MAX_DIST, MAX_DIST)

    return lat, lon


def create_publish_data(lat, lon, ts, name, mac, rssi) -> dict:
    return {
        "listenerCoordinates": [lat, lon],
        "timestamp": ts,
        "listenerName": name,
        "beaconMac": mac,
        "rssi": rssi,
    }


def generate_random_dummy_data(listener_names) -> dict:
    lat, lon = random_coords_close_to_home()
    ts = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    name = get_random_element_from_list(listener_names, NUM_LISTENERS)
    mac = get_random_mac()
    rssi = int(random.uniform(-25, -100))

    return create_publish_data(lat, lon, ts, name, mac, rssi)


# def publish_beacon_is_definately_at_listener_B(client):
# lat, lon = random_coords_close_to_home()
# ts = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
# name = listener_names[0]
# mac = get_random_mac()
# rssi = -80
# data1 = create_publish_data(lat, lon, ts, name, mac, rssi)

# client.publish("test", json.dumps(data1))
# time.sleep(5)
# name = listener_names[1]
# rssi = -20
# data2 = create_publish_data(lat, lon, ts, name, mac, rssi)

# client.publish("test", json.dumps(data2))


# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))


# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload))


def main():
    with open("scientists.txt", "r") as f:
        listener_names = f.readlines()

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect("localhost", 1883, 60)
    client.subscribe("test")

    names = []
    num_cols = math.ceil(math.sqrt(NUM_LISTENERS))
    for i in range(0, NUM_LISTENERS):
        lat = HOME_LAT + (i // num_cols) * 0.005
        lon = HOME_LON + (i % num_cols) * 0.020
        name = get_random_element_from_list(listener_names, len(listener_names), names)
        names.append(name)
        for j in range(0, int(random.uniform(2, 10))):
            ts = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
            mac = f"{i+1}-{j + 1}"
            rssi = int(random.uniform(-25, -100))
            data = create_publish_data(lat, lon, ts, name, mac, rssi)
            client.publish("test", json.dumps(data))
            time.sleep(TIME_BETWEEN_MSG)


if __name__ == "__main__":
    main()
