import datetime
import json
import random
import time

import paho.mqtt.client as mqtt

listener_names = "A B C D".split()
NUM_MESSAGES = 50


def get_random_element_from_list(li: list) -> str:
    return li[int(random.uniform(0, len(li)))]


def get_random_mac() -> str:
    lines = []
    with open("serial_mac.csv", "r") as f:
        lines = f.read().split("\n")

    return get_random_element_from_list(lines).split(",")[-1]


def random_coords_close_to_home():
    lat = 38.912387 + random.uniform(-0.001, 0.01)
    lon = -104.819766 + random.uniform(-0.001, 0.01)

    return lat, lon


def create_publish_data(lat, lon, ts, name, mac, rssi) -> dict:
    return {
        "listenerCoordinates": [lat, lon],
        "timestamp": ts,
        "listenerName": name,
        "beaconMac": mac,
        "rssi": rssi,
    }


def generate_random_dummy_data() -> dict:
    lat, lon = random_coords_close_to_home()
    ts = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    name = get_random_element_from_list(listener_names)
    mac = get_random_mac()
    rssi = int(random.uniform(-25, -100))

    return create_publish_data(lat, lon, ts, name, mac, rssi)


def publish_beacon_is_definately_at_listener_B(client):
    lat, lon = random_coords_close_to_home()
    ts = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    name = listener_names[0]
    mac = get_random_mac()
    rssi = -80
    data1 = create_publish_data(lat, lon, ts, name, mac, rssi)

    client.publish("test", json.dumps(data1))
    time.sleep(5)
    name = listener_names[1]
    rssi = -20
    data2 = create_publish_data(lat, lon, ts, name, mac, rssi)

    client.publish("test", json.dumps(data2))


# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))


# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload))


def main():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect("localhost", 1883, 60)
    client.subscribe("test")

    for i in range(0, NUM_MESSAGES):
        client.publish("test", json.dumps(generate_random_dummy_data()))
        time.sleep(0.5)

    # publish_beacon_is_definately_at_listener_B(client)

    client.loop_forever()


if __name__ == "__main__":
    main()
