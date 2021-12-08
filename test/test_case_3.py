import datetime
import json
import math
import random
import time

from config import HOME_LAT, HOME_LON, NUM_LISTENERS, TIME_BETWEEN_MSG

from utils import create_publish_data, get_random_element_from_list


# spike test, a bunch of data
def test_case_3(client):
    messagesSent = 0
    print("Running test 3 (spike test)")
    with open("./test/scientists.txt", "r") as f:
        listener_names = f.readlines()

    names = []
    for i in range(0, NUM_LISTENERS):
        name = get_random_element_from_list(listener_names, len(listener_names), names)
        names.append(name)

    num_cols = math.ceil(math.sqrt(NUM_LISTENERS))
    for k in range(0, 2):
        for i, name in enumerate(names):
            lat = HOME_LAT + (i // num_cols) * 0.005
            lon = HOME_LON + (i % num_cols) * 0.020
            for j in range(0, int(random.uniform(2, 10))):
                ts = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
                mac = f"t-3_b-{i+1}-{j + 1}"
                rssi = int(random.uniform(-25, -100))
                data = create_publish_data(lat, lon, ts, name, mac, rssi)
                client.publish("test", json.dumps(data))
                messagesSent += 1
                time.sleep(TIME_BETWEEN_MSG)

    print(f"{messagesSent} messages sent")
