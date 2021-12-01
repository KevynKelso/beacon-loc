import datetime
import random

from config import MAX_DIST


def get_random_element_from_list(li: list, max_num: int, existing: list = []) -> str:
    element = li[int(random.uniform(0, max_num))]
    count = 0
    while element in existing:
        element = li[int(random.uniform(0, max_num))]
        count += 1
        if count > 5:
            print("ERROR: add more elements to list")
            return element

    return element


def get_random_mac() -> str:
    lines = []
    with open("serial_mac.csv", "r") as f:
        lines = f.read().split("\n")

    return get_random_element_from_list(lines, len(lines)).split(",")[1]


def random_coords_close_to_home():
    lat = 38.912387 + random.uniform(-MAX_DIST, MAX_DIST)
    lon = -104.819766 + random.uniform(-MAX_DIST, MAX_DIST)

    return lat, lon


def create_publish_data(lat, lon, ts, name, mac, rssi) -> dict:
    return {
        "listenerCoordinates": [lat, lon],
        "timestamp": ts,
        "listenerName": name,
        "beaconMac": mac,
        "rssi": rssi,
    }


def now():
    return datetime.datetime.now().strftime("%Y%m%d%H%M%S")
