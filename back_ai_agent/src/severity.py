def calculate_severity(cpu, ram, disk):

    if cpu >= 95 or ram >= 95 or disk >= 95:
        return "Critical"

    elif cpu >= 85 or ram >= 85:
        return "High"

    elif cpu >= 70:
        return "Medium"

    else:
        return "Low"