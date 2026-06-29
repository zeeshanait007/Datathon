import sys
import os
import zcatalyst_sdk
from sqlalchemy.orm import class_mapper

# Add parent dir to path so we can import from database
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.sqlite import SessionLocal, CasteMaster, ReligionMaster, OccupationMaster, CaseStatusMaster, CaseCategory, GravityOffence, Act, LegalSection, CrimeHead, CrimeSubHead, CrimeHeadLegalSection, GeoState, GeoDistrict, LegalCourt, PoliceUnitType, PoliceUnit, PoliceRank, PoliceDesignation, PoliceEmployee, CaseMaster, Inv_OccuranceTime, ComplainantDetails, ActLegalSectionAssociation, VictimTable, AccusedTable, ArrestSurrender, ChargesheetDetails

def seed_cloud_datastore_full(req=None):
    print("=============================================")
    print(" Catalyst Cloud Scale Full ER Schema Seeder")
    print("=============================================")
    
    try:
        if req:
            app = zcatalyst_sdk.initialize(req=req)
        else:
            app = zcatalyst_sdk.initialize()
    except Exception as e:
        print(f"[ERROR] Failed to initialize Catalyst SDK: {e}")
        return str(e)

    datastore = app.datastore()
    db = SessionLocal()

    # Ordered list of all 27 tables representing the exact ER Schema
    models = [
        GeoState, GeoDistrict, LegalCourt, PoliceUnitType, PoliceUnit, PoliceRank, PoliceDesignation, PoliceEmployee,
        CaseStatusMaster, CaseCategory, GravityOffence, OccupationMaster, ReligionMaster, CasteMaster,
        Act, LegalSection, CrimeHead, CrimeSubHead, CrimeHeadLegalSection,
        CaseMaster, Inv_OccuranceTime, ComplainantDetails, ActLegalSectionAssociation, VictimTable, AccusedTable, ArrestSurrender, ChargesheetDetails
    ]

    for model in models:
        table_name = model.__tablename__
        print(f"\nProcessing table: {table_name}...")
        try:
            records = db.query(model).all()
            if not records:
                print(f"  -> Skipping {table_name} (No local records found)")
                continue
                
            payload = []
            for record in records:
                row_dict = {}
                for col in class_mapper(record.__class__).columns:
                    val = getattr(record, col.key)
                    if val is not None:
                        # Serialize non-primitive types safely for Catalyst SDK JSON ingestion
                        row_dict[col.key] = str(val) if not isinstance(val, (int, float, bool)) else val
                payload.append(row_dict)
                
            # Catalyst SDK batch insert
            batch_size = 100
            for i in range(0, len(payload), batch_size):
                batch = payload[i:i + batch_size]
                datastore.table(table_name).insert_rows(batch)
                
            print(f"  -> Success! Inserted {len(payload)} rows into {table_name}.")
        except Exception as e:
            print(f"  -> [FAILED] Could not insert into {table_name}. Ensure table exists in Console. Error: {e}")

    db.close()
    print("\n=============================================")
    print(" Full Cloud Data Store Seeding Complete!")
    print("=============================================")
    return "Seeding successfully completed! Check your Catalyst Data Store Console."

if __name__ == "__main__":
    seed_cloud_datastore_full()
