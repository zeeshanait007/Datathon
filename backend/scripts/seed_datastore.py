import sys
import os
import zcatalyst_sdk

# Add parent dir to path so we can import from database
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.sqlite import SessionLocal, CaseMaster, AccusedTable, VictimTable, Inv_OccuranceTime

def seed_cloud_datastore():
    print("=============================================")
    print(" Catalyst Cloud Scale Data Store Seeder")
    print("=============================================")
    
    try:
        # Initialize the Catalyst SDK (this requires you to run the script in a valid Catalyst environment,
        # or via a custom API endpoint in AppSail if local auth is not configured)
        app = zcatalyst_sdk.initialize()
    except Exception as e:
        print(f"[ERROR] Failed to initialize Catalyst SDK: {e}")
        print("Please ensure you run this from within the Catalyst CLI or expose it as an API endpoint.")
        return

    datastore = app.datastore()
    db = SessionLocal()

    # Query the first 100 cases from SQLite to upload
    cases = db.query(CaseMaster).limit(100).all()
    accused_list = db.query(AccusedTable).limit(100).all()
    victims_list = db.query(VictimTable).limit(100).all()
    
    print(f"\nFound {len(cases)} Cases, {len(accused_list)} Accused, and {len(victims_list)} Victims in local SQLite.")
    print("Preparing to push to Zoho Catalyst Data Store...")

    # 1. Push CaseMaster
    try:
        print("\n[1/3] Pushing to 'CaseMaster' table...")
        case_table = datastore.table("CaseMaster")
        
        # Batch insert for performance
        case_payload = []
        for c in cases:
            case_payload.append({
                "CrimeNo": c.CrimeNo,
                "CaseNo": c.CaseNo,
                "CrimeRegisteredDate": str(c.CrimeRegisteredDate),
                "PolicePersonID": c.PolicePersonID,
                "PoliceStationID": c.PoliceStationID,
                "CaseCategoryID": c.CaseCategoryID,
                "GravityOffenceID": c.GravityOffenceID,
                "CaseStatusID": c.CaseStatusID
            })
            
        case_table.insert_rows(case_payload)
        print("  -> Success! CaseMaster records inserted.")
    except Exception as e:
        print(f"  -> [FAILED] Could not insert CaseMaster. Ensure the table exists in Catalyst Console. Error: {e}")

    # 2. Push AccusedTable
    try:
        print("\n[2/3] Pushing to 'AccusedTable'...")
        acc_table = datastore.table("AccusedTable")
        
        acc_payload = []
        for a in accused_list:
            acc_payload.append({
                "AccusedName": a.AccusedName,
                "AgeYear": a.AgeYear,
                "GenderID": a.GenderID,
                "CaseMasterID": a.CaseMasterID
            })
            
        acc_table.insert_rows(acc_payload)
        print("  -> Success! AccusedTable records inserted.")
    except Exception as e:
        print(f"  -> [FAILED] Could not insert AccusedTable. Error: {e}")

    # 3. Push VictimTable
    try:
        print("\n[3/3] Pushing to 'VictimTable'...")
        vic_table = datastore.table("VictimTable")
        
        vic_payload = []
        for v in victims_list:
            vic_payload.append({
                "VictimName": v.VictimName,
                "AgeYear": v.AgeYear,
                "GenderID": v.GenderID,
                "CaseMasterID": v.CaseMasterID
            })
            
        vic_table.insert_rows(vic_payload)
        print("  -> Success! VictimTable records inserted.")
    except Exception as e:
        print(f"  -> [FAILED] Could not insert VictimTable. Error: {e}")

    db.close()
    print("\n=============================================")
    print(" Cloud Data Store Seeding Complete!")
    print("=============================================")

if __name__ == "__main__":
    seed_cloud_datastore()
