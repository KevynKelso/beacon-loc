import datetime
import os
import random

from dotenv import load_dotenv

load_dotenv()

import paho.mqtt.client as paho
from config import NUM_LISTENERS
from paho import mqtt
from test_case_1 import test_case_1
from test_case_2 import test_case_2
from test_case_3 import test_case_3
from test_case_4 import test_case_4
from test_case_5 import test_case_5

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
    client = paho.Client(client_id="", userdata=None, protocol=paho.MQTTv5)
    client.on_connect = on_connect
    client.on_message = on_message

    client.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS)
    print(os.environ["TEST_HOST"], int(os.environ["REACT_APP_MQTTPORT"]))
    client.username_pw_set(
        os.environ["REACT_APP_MQTTUSERNAME"], os.environ["REACT_APP_MQTTPASSWORD"]
    )
    client.connect(os.environ["TEST_HOST"], int(os.environ["TEST_PORT"]))
    client.subscribe("test")

    test_case_1(client)
    # test_case_2(client)
    # test_case_3(client)
    # test_case_4(client)
    # test_case_5(client)


if __name__ == "__main__":
    main()
