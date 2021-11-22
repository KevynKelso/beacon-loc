import datetime
import json
import random
import time

import paho.mqtt.client as mqtt

NUM_MESSAGES = 100
NUM_LISTENERS = 20
MAX_DIST = 0.02
TIME_BETWEEN_MSG = 0.2


def get_random_element_from_list(li: list, max_num: int) -> str:
    return li[int(random.uniform(0, max_num))]


def get_random_mac() -> str:
    lines = []
    with open("serial_mac.csv", "r") as f:
        lines = f.read().split("\n")

    return get_random_element_from_list(lines, len(lines)).split(",")[-1]


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

    for i in range(0, NUM_MESSAGES):
        client.publish("test", json.dumps(generate_random_dummy_data(listener_names)))
        time.sleep(TIME_BETWEEN_MSG)


if __name__ == "__main__":
    main()
