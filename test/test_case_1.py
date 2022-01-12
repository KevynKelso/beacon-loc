import datetime
import json
import time

from config import HOME_LAT, HOME_LON

from utils import create_publish_data

NUM_BEACONS = 1

# beacons move between 2 listeners
def test_case_1(client):
    print("Running test 1 (beacons moving btn bridges)")
    # need 2 listeners, A & B
    latA = HOME_LAT
    lngA = HOME_LON
    latB = HOME_LAT
    lngB = HOME_LON + 0.006
    for i in range(0, NUM_BEACONS):
        # A
        ts = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        rssi = -10
        data = create_publish_data(latA, lngA, ts, "A", f"t-1_b-{i}", rssi)
        client.publish("EM Beacon", json.dumps(data))
        time.sleep(1)
    for i in range(0, NUM_BEACONS):
        # B
        rssi = -10
        ts = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        data = create_publish_data(latB, lngB, ts, "B", f"t-1_b-{i}", rssi)
        client.publish("EM Beacon", json.dumps(data))
        time.sleep(1)
