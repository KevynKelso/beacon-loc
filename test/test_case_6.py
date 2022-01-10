# This test is for a bridge seeing a beacon at one location, then teleporting
# to a different location far away with no updates in between. It is for testing
# the separateDevicesTooFarAway function
import json
import random
import threading
import time
from datetime import datetime

from config import HOME_LAT, HOME_LON

from utils import create_publish_data

TIME_BETWEEN_MSG = 1
test_time = 5

running = True


def heartbeat_bridge(client):
    loc = [HOME_LAT, HOME_LON]
    while running:
        rssi = random.randint(-100, -30)
        ts = datetime.now().strftime("%Y%m%d%H%M%S")
        data = create_publish_data(
            loc[0],
            loc[1],
            ts,
            "heartbeat",
            "t-6_0",
            rssi,
        )
        client.publish("EM Beacon", json.dumps(data))
        time.sleep(TIME_BETWEEN_MSG)


def teleport_bridge(client):
    loc = [HOME_LAT, HOME_LON]
    loc2 = [HOME_LAT + 0.1, HOME_LON + 0.1]
    teleport = False
    while running:
        location = loc
        if teleport:
            location = loc2

        teleport = not teleport

        rssi = random.randint(-100, -30)
        ts = datetime.now().strftime("%Y%m%d%H%M%S")
        data = create_publish_data(
            location[0],
            location[1],
            ts,
            "Teleport",
            "t-6_1",
            rssi,
        )
        client.publish("EM Beacon", json.dumps(data))
        time.sleep(TIME_BETWEEN_MSG)


def test_case_6(client):
    threads = [heartbeat_bridge, teleport_bridge]

    for t in threads:
        x = threading.Thread(target=t, args=(client,))
        x.start()

    time.sleep(test_time)
    global running
    running = False
