import json
import random
import qrcode
import os

# Enums updated to match TypeScript models
class DriveBaseType:
    Swerve = 'Swerve'
    Tank = 'Tank'
    Other = 'Other'

class DriveBaseMotor:
    CIM = 'CIM'
    NEO = 'NEO'
    FALCON = 'FALCON'
    KRAKEN = 'KRAKEN'

class Years:
    Zero = '0'
    One = '1'
    Two = '2'
    ThreePlus = '3+'
    Unknown = 'Unknown'

class Stability:
    NotStable = 'Not Stable'
    Stable = 'Stable'
    VeryStable = 'Very Stable'

class WellMade:
    No = 'No'
    Yes = 'Yes'
    Very = 'Very'

class PickupSpots:
    SourceOnly = 'Source Only'
    GroundOnly = 'Ground Only'
    Both = 'Both'
    Neither = 'Neither'

class ScoreSpots:
    SpeakerOnly = 'Speaker Only'
    AmpOnly = 'Amp Only'
    Both = 'Both'
    Neither = 'Neither'

class Gravity:
    Low = 'Low'
    Medium = 'Medium'
    High = 'High'

class HumanPlayerSpotlight:
    OneOfThree = '1 of 3 High Notes'
    TwoOfThree = '2 of 3 High Notes'
    AllHighNotes = '3 of 3 High Notes'

class Position:
    Left = 'Left'
    Middle = 'Middle'
    Right = 'Right'

class ExtraNotes:
    LeftWing = 'Left Wing'
    CentreWing = 'Centre Wing'
    RightWing = 'Right Wing'
    FarLeftCentre = 'Far Left Centre'
    LeftCentre = 'Left Centre'
    CentreCentre = 'Centre Centre'
    RightCentre = 'Right Centre'
    FarRight = 'Far Right'

class ShootSpots:
    StartingZone = 'Starting Zone'
    Podium = 'Podium'
    ElsewhereInWing = 'Elsewhere in Wing'
    NearCentreLine = 'Near Centre Line'

class EndGameOnStage:
    Park = 'Park'
    OnStage = 'OnStage'

class EndGameHarmony:
    ZeroPoints = '0 Points'
    TwoPoints = '2 Points'
    HarmonyFailed = 'Harmony Failed'

class Trap:
    ZeroPoints = '0 Points'
    FivePoints = '5 Points'
    TenPoints = '10 Points'
    FifteenPoints = '15 Points'
    TrapFailed = 'Trap Failed'

class RankingPoints:
    Lose = 'Lose'
    Tie = 'Tie'
    Win = 'Win'

class DefenseLevel:
    No = 'No'
    A_Little = 'A Little'
    Average = 'Average'
    A_Lot = 'A Lot'

class Tippiness:
    Not = 'Not'
    A_Little = 'A Little'
    Very = 'Very'

class Speed:
    Slow = 'Slow'
    Average = 'Average'
    Fast = 'Fast'

class Awareness:
    LessAware = 'Less Aware'
    Average = 'Average'
    VeryAware = 'Very Aware'
    
class AutoPositions:
    RedLeft = 'Red Left'
    RedRight = 'Red Right'
    RedCenter = 'Red Center'
    BlueLeft = 'Blue Left'
    BlueRight = 'Blue Right'
    BlueCenter = 'Blue Center'

# Generate team data based on PitModel
def generate_team_data(TeamNb):
    return {
        "ScoutName": f"Scout{random.randint(1, 10)}",
        "TeamNumber": TeamNb,
        "TeamName": f"Team{TeamNb}",
        "DriveBaseType": random.choice([DriveBaseType.Swerve, DriveBaseType.Tank, DriveBaseType.Other]),
        "DriveBaseMotor": random.choice([DriveBaseMotor.CIM, DriveBaseMotor.NEO, DriveBaseMotor.FALCON, DriveBaseMotor.KRAKEN]),
        "DriverExperience": random.choice([Years.Zero, Years.One, Years.Two, Years.ThreePlus, Years.Unknown]),
        "WeightLbs": random.randint(0, 100),
        "WidthInches": random.randint(0, 100),
        "LengthInches": random.randint(0, 100),
        "Stability": random.choice([Stability.NotStable, Stability.Stable, Stability.VeryStable]),
        "WellMade": random.choice([WellMade.No, WellMade.Yes, WellMade.Very]),
        "SingleIntakeShooter": random.choice([True, False]),
        "PickupSpots": random.choice([PickupSpots.SourceOnly, PickupSpots.GroundOnly, PickupSpots.Both, PickupSpots.Neither]),
        "ScoreSpots": random.choice([ScoreSpots.SpeakerOnly, ScoreSpots.AmpOnly, ScoreSpots.Both, ScoreSpots.Neither]),
        "CenterOfGravity": random.choice([Gravity.Low, Gravity.Medium, Gravity.High]),
        "YearsUsingSwerve": random.choice([Years.Zero, Years.One, Years.Two, Years.ThreePlus, Years.Unknown]),
        "ShootsFrom": random.sample([ShootSpots.StartingZone, ShootSpots.Podium, ShootSpots.ElsewhereInWing, ShootSpots.NearCentreLine], k=random.randint(1, 3)),
        "ObjectRecognition": random.choice([True, False]),
        "ReadAprilTags": random.choice([True, False]),
        "AutonomousProgram": random.sample([AutoPositions.RedLeft, AutoPositions.RedRight, AutoPositions.RedCenter, AutoPositions.BlueLeft, AutoPositions.BlueRight, AutoPositions.BlueCenter], k=random.randint(1, 3)),
        "AutoProgramsForSpeaker": random.choice([True, False]),
        "CanGetOnStage": random.choice([True, False]),
        "CanScoreNotesInTrap": random.choice([True, False]),
        "HumanPlayerSpotlight": random.choice([HumanPlayerSpotlight.OneOfThree, HumanPlayerSpotlight.TwoOfThree, HumanPlayerSpotlight.AllHighNotes]),
        "CheesecakeAbility": random.choice([True, False]),
        "Comments": f"Comment {random.randint(1, 100)}",
        "HeightInches": random.randint(0, 100),
        "FrameClearanceInches": random.randint(0, 100),
        "matches": []  # Empty list for simplicity
    }

# Generate a random match based on MatchModel
def generate_random_match(TeamNb):
    return {
        "ScoutName": f"Scout{random.randint(1, 10)}",
        "TeamNumber": TeamNb,
        "MatchNumber": random.randint(1, 100),
        "AutoAmp": random.randint(0, 10),
        "AutoSpeaker": random.randint(0, 10),
        "AutoStartingPosition": random.choice([Position.Left, Position.Middle, Position.Right]),
        "AutoLeave": random.choice([True, False]),
        "AutoExtraNotes": random.sample([ExtraNotes.LeftWing, ExtraNotes.CentreWing, ExtraNotes.RightWing, ExtraNotes.FarLeftCentre, ExtraNotes.LeftCentre, ExtraNotes.CentreCentre, ExtraNotes.RightCentre, ExtraNotes.FarRight], k=random.randint(1, 3)),
        "AutoDropped": random.randint(0, 10),
        "AutoAStopPressed": random.choice([True, False]),
        "AutoIncapacitated": random.choice([True, False]),
        "AutoFell": random.choice([True, False]),
        "AutoRobotDidNotPlay": random.choice([True, False]),
        "TeleopSpeakerAmplified": random.randint(0, 10),
        "TeleopSpeaker": random.randint(0, 10),
        "TeleopAmplifier": random.randint(0, 10),
        "TeleopCycleTime": [random.uniform(0.0, 10.0) for _ in range(random.randint(1, 5))],
        "TeleopDropped": random.randint(0, 10),
        "TeleopTrap": random.choice([Trap.ZeroPoints, Trap.FivePoints, Trap.TenPoints, Trap.FifteenPoints, Trap.TrapFailed]),
        "TeleopFell": random.choice([True, False]),
        "TeleopIncapacitated": random.choice([True, False]),
        "TeleopGamePieceStuck": random.randint(0, 10),
        "TeleopShootsFrom": random.sample([ShootSpots.StartingZone, ShootSpots.Podium, ShootSpots.ElsewhereInWing, ShootSpots.NearCentreLine], k=random.randint(1, 3)),
        "TeleopUnderStage": random.choice([True, False]),
        "EndGameOnStage": random.choice([EndGameOnStage.Park, EndGameOnStage.OnStage]),
        "EndGameHarmony": random.choice([EndGameHarmony.ZeroPoints, EndGameHarmony.TwoPoints, EndGameHarmony.HarmonyFailed]),
        "EndGameTrap": random.choice([Trap.ZeroPoints, Trap.FivePoints, Trap.TenPoints, Trap.FifteenPoints, Trap.TrapFailed]),
        "EndGameRobotFell": random.choice([True, False]),
        "EndGameRobotIncapacitated": random.choice([True, False]),
        "EndGameSpotLighted": random.choice([True, False]),
        "AllianceTotalPoints": random.randint(0, 100),
        "AllianceRankingPoints": random.choice([RankingPoints.Lose, RankingPoints.Tie, RankingPoints.Win]),
        "AllianceMelody": random.choice([True, False]),
        "AllianceCoopertition": random.choice([True, False]),
        "AllianceEnsemble": random.choice([True, False]),
        "PlaysDefense": random.choice([DefenseLevel.No, DefenseLevel.A_Little, DefenseLevel.Average, DefenseLevel.A_Lot]),
        "RobotTippy": random.choice([Tippiness.Not, Tippiness.A_Little, Tippiness.Very]),
        "RobotSpeed": random.choice([Speed.Slow, Speed.Average, Speed.Fast]),
        "FieldAwareness": random.choice([Awareness.LessAware, Awareness.Average, Awareness.VeryAware]),
        "Comment": f"Comment {random.randint(1, 100)}",
        "gotScanned": random.choice([True, False])
    }

# QR code generation function
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
qr_code_dir = "./qr_codes"
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
    random_matches = [generate_random_match(team_number) for _ in range(10)]
    for i, match in enumerate(random_matches):
        json_data = json.dumps(match, indent=4)
        file_path = os.path.join(team_dir, f"match_{i+1}.png")
        generate_qr_code(json_data, file_path)

# Print message indicating completion
print("QR codes generated and saved.")
