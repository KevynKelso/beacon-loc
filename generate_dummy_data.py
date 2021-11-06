import datetime
import json
import random
import time

import paho.mqtt.client as mqtt

listener_names = "A B C D".split()
NUM_MESSAGES = 10


def get_random_element_from_list(li: list) -> str:
    return li[int(random.uniform(0, len(li)))]


def get_random_mac() -> str:
    lines = []
    with open("serial_mac.csv", "r") as f:
        lines = f.read().split("\n")

    return get_random_element_from_list(lines).split(",")[-1]


def generate_dummy_data() -> dict:
    lat = 38.912387 + random.uniform(-0.001, 0.01)
    lon = -104.819766 + random.uniform(-0.001, 0.01)
    ts = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    name = get_random_element_from_list(listener_names)
    mac = get_random_mac()
    rssi = int(random.uniform(-25, -100))
    return {
        "listenerCoordinates": [lat, lon],
        "timestamp": ts,
        "listenerName": name,
        "beaconMac": mac,
        "rssi": rssi,
    }


# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))

    client.subscribe("test")
    for i in range(0, NUM_MESSAGES + 1):
        client.publish("test", json.dumps(generate_dummy_data()))
        time.sleep(2)


# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload))


def main():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect("localhost", 1883, 60)
    client.loop_forever()


if __name__ == "__main__":
    main()
