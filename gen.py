import json
import random
import qrcode
import os


class DriveBaseType:
    Swerve = 'Swerve'
    Tank = 'Tank'
    Other = 'Other'


class DriveBaseMotor:
    CIM = 'CIM'
    NEO = 'NEO'
    FALCON = 'FALCON'
    KRAKEN = 'KRAKEN'


class DriverExperience:
    Zero = 'Zero'
    One = 'One'
    Two = 'Two'
    Three = 'Three'
    Four = 'Four'
    Unknown = 'Unknown'


class Stability:
    NO = 'Not Stable'
    YES = 'Stable'
    VERY_STABLE = 'Very Stable'

# generate pit data


def generate_team_data(TeamNb):
    return {
        "RobScout": f"Scout{random.randint(1, 10)}",
        "TeamNb": TeamNb,
        "RobTeamNm": f"Team{TeamNb}",
        "RobDrive": random.choice([DriveBaseType.Swerve, DriveBaseType.Tank, DriveBaseType.Other]),
        "RobMotor": random.choice([DriveBaseMotor.CIM, DriveBaseMotor.NEO, DriveBaseMotor.FALCON, DriveBaseMotor.KRAKEN]),
        "RobDriveExp": random.choice([DriverExperience.Zero, DriverExperience.One, DriverExperience.Two, DriverExperience.Three, DriverExperience.Four, DriverExperience.Unknown]),
        "RobWtlbs": random.randint(0, 100),
        "RobWidth": random.randint(0, 100),
        "RobLength": random.randint(0, 100),
        "RobStble": random.choice([Stability.NO, Stability.YES, Stability.VERY_STABLE]),
        "RobQuest1": random.choice([True, False]),
        "RobQuest2": random.choice([True, False]),
        "RobQuest3": random.choice([True, False]),
        "RobQuest4": random.choice([True, False]),
        "RobQuest5": random.choice([True, False]),
        "RobQuest6": random.choice([True, False]),
        "RobQuest7": random.choice([True, False]),
        "RobQuest8": random.choice([True, False]),
        "RobQuest9": random.choice([True, False]),
        "RobQuest10": random.choice([True, False]),
        "RobQuest11": random.choice([True, False]),
        "RobQuest12": random.choice([True, False]),
        "RobQuest13": random.choice([True, False]),
        "RobQuest14": random.choice([True, False]),
        "RobQuest15": random.choice([True, False]),
        "RobComm1": f"Comment {random.randint(1, 100)}",
        "matches": []  # Assuming an empty list for simplicity
    }

# Function to generate a random match with the updated flattened GamePiecesGrid


def generate_random_match(TeamNb):
    return {
        "ScoutName": f"Scout{random.randint(1, 10)}",
        "TeamNumber": TeamNb,
        "MatchNumber": random.randint(1, 100),
        "AutoGamePiece1": random.randint(0, 10),
        "AutoGamePiece2": random.randint(0, 10),
        "AutoGamePiece3": random.randint(0, 10),
        "AutoGamePiece4": random.randint(0, 10),
        "AutoPosition": random.choice(["Left", "Middle", "Right"]),
        "AutoMobility": random.choice([True, False]),
        "AutoObjective1": random.choice(["Stage 1", "Stage 2", "Stage 3", "Stage 4"]),
        "AutoObjective2": random.choice(["Stage 1", "Stage 2", "Stage 3", "Stage 4"]),
        "AutoRobotFalls": random.choice([True, False]),
        "CycleTime": [random.uniform(0.0, 10.0) for _ in range(random.randint(1, 5))],
        "EndGameObjective1": random.choice(["Stage 1", "Stage 2", "Stage 3", "Stage 4"]),
        "EndGameObjective2": random.choice(["Stage 1", "Stage 2", "Stage 3", "Stage 4"]),
        "DroppedGamePiece": random.randint(0, 10),
        "Comment": f"Comment {random.randint(1, 100)}",
        "TotalPointsAlliance": random.randint(0, 100),
        "RankingPointsAlliance": random.randint(0, 100),
        "AllianceObjective1": random.randint(0, 10),
        "AllianceObjective2": random.choice([True, False]),
        "WonMatch": random.choice([True, False]),
        "TeleopStatus1": random.choice([True, False]),
        "TeleopStatus2": random.choice([True, False]),
        "TeleopStatus3": random.choice([True, False]),
        "TeleopStatus4": random.choice([True, False]),
        "TeleopStatus5": random.choice(["Slow", "Average", "Fast"]),
        "TeleopStatus6": random.choice(["Less aware", "Average", "Very aware"]),
        "TeleopGamePiece1": random.randint(0, 10),
        "TeleopGamePiece2": random.randint(0, 10),
        "TeleopGamePiece3": random.randint(0, 10),
        "TeleopGamePiece4": random.randint(0, 10),
        "GamePiecesGrid": [
            {
                "rowIndex": i,
                "columnIndex": j,
                "autoScored": random.randint(0, 5),
                "GamePieceType": random.choice(["GamePiece1", "GamePiece2", "GamePiece3", "GamePiece4"]),
                "count": random.randint(0, 5)
            }
            for i in range(3) for j in range(3)
        ],
        "gotScanned": random.choice([True, False])
    }


def generate_qr_code(data, file_path):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(file_path)


# Directory to save QR codes
qr_code_dir = "./qr_codes2"
os.makedirs(qr_code_dir, exist_ok=True)

# Number of teams
num_teams = 3
# Generate and save QR codes for each team
for _ in range(1, num_teams + 1):
    team_number = random.randint(1, 9999)
    # Create a directory for each team
    team_dir = os.path.join(qr_code_dir, f"Team{team_number}")
    os.makedirs(team_dir, exist_ok=True)
    # Generate team data and save QR code
    team_data = generate_team_data(team_number)
    file_path = os.path.join(team_dir, f"team{team_number}.png")
    json_data = json.dumps(team_data, indent=4)
    print(json_data)
    generate_qr_code(json_data, file_path)

    # Generate and save QR codes for five random matches
    random_matches = [generate_random_match(team_number) for _ in range(5)]
    for i, match in enumerate(random_matches):
        json_data = json.dumps(match, indent=4)
        file_path = os.path.join(team_dir, f"match_{i+1}.png")
        generate_qr_code(json_data, file_path)

# Print a message indicating that the QR codes have been generated
print(
    f"QR codes for {num_teams} teams with team data and 5 random matches each have been generated and saved.")
