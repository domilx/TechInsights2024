import json
import random
import qrcode
import os

# Function to generate a random match with the updated flattened GamePiecesGrid
def generate_random_match():
    return {
        "ScoutName": f"Scout{random.randint(1, 10)}",
        "TeamNumber": 3990,
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

# Generate random match JSONs
random_matches = [generate_random_match() for _ in range(2)]

# Directory to save QR codes
qr_code_dir = "./qr_codes"
os.makedirs(qr_code_dir, exist_ok=True)

# Function to generate QR code
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

# Generate and save QR codes
for i, match in enumerate(random_matches):
    json_data = json.dumps(match, indent=4)
    file_path = os.path.join(qr_code_dir, f"match_{i+1}.png")
    generate_qr_code(json_data, file_path)

# Return the JSON
print(json.dumps(random_matches, indent=4))

