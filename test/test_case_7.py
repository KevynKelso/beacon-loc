# This test is for a bridge seeing a beacon at one location, then teleporting
# to a different location far away with no updates in between. It is for testing
# the separateDevicesTooFarAway function
import json
import random
import threading
import time
from datetime import datetime

from utils import create_publish_data

TIME_BETWEEN_MSG = 1
test_time = 5

running = True


def far_away_bridge(client):
    loc = [40.7986448, -73.9722251]
    while running:
        rssi = random.randint(-100, -30)
        ts = datetime.now().strftime("%Y%m%d%H%M%S")
        data = create_publish_data(
            loc[0],
            loc[1],
            ts,
            "! \"#$&%'()*+,-.\\ ?=<></>@{}",
            "t-7_1",
            rssi,
        )
        client.publish("EM Beacon", json.dumps(data))
        time.sleep(TIME_BETWEEN_MSG)


def test_case_7(client):
    threads = [far_away_bridge]

    for t in threads:
        x = threading.Thread(target=t, args=(client,))
        x.start()

    time.sleep(test_time)
    global running
    running = False
