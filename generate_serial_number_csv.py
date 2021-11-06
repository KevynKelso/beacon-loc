def sn_to_bytes(sn: int) -> str:
    temp = hex(int.from_bytes(sn.to_bytes(6, "little"), "big"))[2:]
    returnValue = temp[:2]
    for i in range(1, int(len(temp) / 2)):
        returnValue += f":{temp[2*i:2*i+2]}"

    return returnValue


# file will look like:
# serial_number, mac_address
def main():
    serial_numbers = []
    with open("serial_numbers.txt", "r") as f:
        serial_numbers = f.read().split("\n")

    serial_numbers = [x.strip() for x in serial_numbers if x != ""]

    lines = []
    for num in serial_numbers:
        mac = sn_to_bytes(int(num))
        lines.append(f"{num},{mac}")

    with open("serial_mac.csv", "w") as f:
        f.write("\n".join(lines))


if __name__ == "__main__":
    main()
