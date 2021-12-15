import json
import threading
import time
from datetime import datetime

import numpy as np
from config import HOME_LAT, HOME_LON

from utils import create_publish_data

# configure
max_dist = 0.022  # approx 1km?
test_time = 10  # test will run for 10 seconds
local_beacons = 3
TIME_BETWEEN_MSG = 1
warehouse_lat = HOME_LAT
warehouse_lon = HOME_LON + max_dist

# don't configure
running = True


# thread for creating mock messages from the warehouse
def warehouse_bridge(client):
    # warehouse about a km away
    lat = warehouse_lat
    lon = warehouse_lon
    rssi = -80
    while running:
        ts = datetime.now().strftime("%Y%m%d%H%M%S")
        for i in range(local_beacons):
            data = create_publish_data(
                lat, lon, ts, "Warehouse", f"t-4_b-warehouse-{i}", rssi
            )
            client.publish("test", json.dumps(data))
            time.sleep(TIME_BETWEEN_MSG)


def truck_bridge(client):
    global running
    lons = np.linspace(HOME_LON, warehouse_lon, 20)
    # truck will traverse between site and warehouse
    lat = HOME_LAT + 0.0001
    lon = HOME_LON
    rssi = -10
    index = 0
    while running:
        ts = datetime.now().strftime("%Y%m%d%H%M%S")
        lon = lons[index]
        index += 1
        for i in range(local_beacons):
            # stop condition
            if lon == lons[-1]:
                running = False

            # publish data for it's own beacons
            data = create_publish_data(lat, lon, ts, "Truck", f"t-4_b-truck-{i}", rssi)
            client.publish("test", json.dumps(data))

            # will see the site beacons for 3 seconds
            if lon < lons[5]:
                data = create_publish_data(
                    lat, lon, ts, "Truck", f"t-4_b-site-{i}", rssi
                )
                client.publish("test", json.dumps(data))

            # truck is @ the warehouse
            if lon > lons[-5]:
                data = create_publish_data(
                    lat, lon, ts, "Truck", f"t-4_b-warehouse-{i}", rssi
                )
                client.publish("test", json.dumps(data))
            time.sleep(TIME_BETWEEN_MSG)


def site_bridge(client):
    # site will be at home coordinates
    lat = HOME_LAT
    lon = HOME_LON
    rssi = -80
    while running:
        ts = datetime.now().strftime("%Y%m%d%H%M%S")
        for i in range(local_beacons):
            data = create_publish_data(lat, lon, ts, "Site", f"t-4_b-site-{i}", rssi)
            client.publish("test", json.dumps(data))
            time.sleep(TIME_BETWEEN_MSG)


def test_case_4(client):
    print("Running test 4 (3 bridges moving)")
    thread_funcs = [site_bridge, truck_bridge, warehouse_bridge]

    for thread_func in thread_funcs:
        x = threading.Thread(target=thread_func, args=(client,))
        x.start()
