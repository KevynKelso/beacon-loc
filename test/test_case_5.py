# N bridges in a room seeing M beacons, randomly bridges will stop publishing
# for a while, rssi will spike randomly, and sometimes bridges will teleport?
import json
import random
import threading
import time
from datetime import datetime

from config import HOME_LAT, HOME_LON

from utils import create_publish_data

# configure
local_beacons = 5
TIME_BETWEEN_MSG = 0.25
test_time = 30  # time in seconds for test to run

# don't configure
running = True


def randomly_stops_pub_bridge_thread(client):
    loc = [HOME_LAT + 0.0001, HOME_LON + 0.00045]
    rssi = -50
    while running:
        for i in range(local_beacons):
            ts = datetime.now().strftime("%Y%m%d%H%M%S")
            data = create_publish_data(
                loc[0],
                loc[1],
                ts,
                "randomly stops",
                f"t-5_{i}",
                rssi,
            )
            client.publish("EM Beacon", json.dumps(data))
            time.sleep(TIME_BETWEEN_MSG)
        # ~5% of the time, I will stop publishing for a random amount of time
        stopped = random.randint(1, 100) < 50
        if stopped:
            time.sleep(random.randint(1, 20))


def z_bridge_thread(client):
    loc = [HOME_LAT - 0.0001, HOME_LON]
    while running:
        for i in range(local_beacons):
            rssi = random.randint(-100, -30)
            ts = datetime.now().strftime("%Y%m%d%H%M%S")
            data = create_publish_data(
                loc[0],
                loc[1],
                ts,
                "Z",
                f"t-5_{i}",
                rssi,
            )
            client.publish("EM Beacon", json.dumps(data))
            time.sleep(TIME_BETWEEN_MSG)


def main_publisher_bridge_thread(client):
    loc = [HOME_LAT, HOME_LON]
    rssi = -90
    while running:
        for i in range(local_beacons):
            ts = datetime.now().strftime("%Y%m%d%H%M%S")
            data = create_publish_data(
                loc[0],
                loc[1],
                ts,
                "Reliable, but low rssi",
                f"t-5_{i}",
                rssi,
            )
            client.publish("EM Beacon", json.dumps(data))
            time.sleep(TIME_BETWEEN_MSG)


def test_case_5(client):
    threads = [
        randomly_stops_pub_bridge_thread,
        z_bridge_thread,
        main_publisher_bridge_thread,
    ]

    for t in threads:
        x = threading.Thread(target=t, args=(client,))
        x.start()

    time.sleep(test_time)
    global running
    running = False
