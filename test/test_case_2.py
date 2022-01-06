import datetime
import json
import time

from config import HOME_LAT, HOME_LON, NUM_BEACONS

from utils import create_publish_data, now


# listener is on the move
def test_case_2(client):
    print("Running test 2 (listener on the move)")
    listener_name = "journey w/ b-0"
    home_lat = HOME_LAT - 0.001
    rssi = -10
    # listener will move twice slightly, then twice greatly
    for i in range(0, NUM_BEACONS):
        ts = now()
        rssi = -10
        data = create_publish_data(
            home_lat, HOME_LON, ts, listener_name, f"t-2_b-{i}", rssi
        )
        client.publish("EM Beacon", json.dumps(data))
        time.sleep(0.1)

    # first move slight
    ts = now()
    rssi = -10
    data = create_publish_data(
        home_lat + 0.0005, HOME_LON + 0.0005, ts, listener_name, "t-2_b-0", rssi
    )
    client.publish("EM Beacon", json.dumps(data))
    time.sleep(1)

    # second move slight
    ts = now()
    rssi = -10
    data = create_publish_data(
        home_lat, HOME_LON - 0.0005, ts, listener_name, "t-2_b-0", rssi
    )
    client.publish("EM Beacon", json.dumps(data))
    time.sleep(1)

    # first move great
    ts = now()
    rssi = -10
    data = create_publish_data(
        home_lat, HOME_LON + 0.012, ts, listener_name, "t-2_b-0", rssi
    )
    client.publish("EM Beacon", json.dumps(data))
    time.sleep(1)

    # second move great
    ts = now()
    rssi = -10
    data = create_publish_data(
        home_lat, HOME_LON + 0.022, ts, listener_name, "t-2_b-0", rssi
    )
    client.publish("EM Beacon", json.dumps(data))
    time.sleep(10)

    # move back
    ts = now()
    rssi = -10
    data = create_publish_data(
        home_lat, HOME_LON + 0.012, ts, listener_name, "t-2_b-0", rssi
    )
    client.publish("EM Beacon", json.dumps(data))
    time.sleep(1)

    for i in range(0, NUM_BEACONS):
        ts = now()
        rssi = -10
        data = create_publish_data(
            home_lat - 0.001, HOME_LON, ts, listener_name, f"t-2_b-{i}", rssi
        )
        client.publish("EM Beacon", json.dumps(data))
        time.sleep(0.1)
