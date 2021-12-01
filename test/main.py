import datetime
import random

import paho.mqtt.client as mqtt
from config import NUM_LISTENERS
from test_case_2 import test_case_2

from utils import (create_publish_data, get_random_element_from_list,
                   get_random_mac, random_coords_close_to_home)


def generate_random_dummy_data(listener_names) -> dict:
    lat, lon = random_coords_close_to_home()
    ts = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    name = get_random_element_from_list(listener_names, NUM_LISTENERS)
    mac = get_random_mac()
    rssi = int(random.uniform(-25, -100))

    return create_publish_data(lat, lon, ts, name, mac, rssi)


# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))


# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload))


def main():
    # with open("scientists.txt", "r") as f:
    # listener_names = f.readlines()

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect("localhost", 1883, 60)
    client.subscribe("test")

    # test_case_1(client)
    test_case_2(client)
    # names = []
    # for i in range(0, NUM_LISTENERS):
    # name = get_random_element_from_list(listener_names, len(listener_names), names)
    # names.append(name)

    # num_cols = math.ceil(math.sqrt(NUM_LISTENERS))
    # for k in range(0, 2):
    # for i, name in enumerate(names):
    # lat = HOME_LAT + (i // num_cols) * 0.005
    # lon = HOME_LON + (i % num_cols) * 0.020
    # for j in range(0, int(random.uniform(2, 10))):
    # ts = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    # mac = f"{i+1}-{j + 1}"
    # rssi = int(random.uniform(-25, -100))
    # data = create_publish_data(lat, lon, ts, name, mac, rssi)
    # client.publish("test", json.dumps(data))
    # time.sleep(TIME_BETWEEN_MSG)


if __name__ == "__main__":
    main()
