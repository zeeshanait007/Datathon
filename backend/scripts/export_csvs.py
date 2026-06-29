import sys
import os
import csv
from sqlalchemy.orm import class_mapper

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.sqlite import SessionLocal, CasteMaster, ReligionMaster, OccupationMaster, CaseStatusMaster, CaseCategory, GravityOffence, Act, LegalSection, CrimeHead, CrimeSubHead, CrimeHeadLegalSection, GeoState, GeoDistrict, LegalCourt, PoliceUnitType, PoliceUnit, PoliceRank, PoliceDesignation, PoliceEmployee, CaseMaster, Inv_OccuranceTime, ComplainantDetails, ActLegalSectionAssociation, VictimTable, AccusedTable, ArrestSurrender, ChargesheetDetails

def export_csvs():
    db = SessionLocal()
    
    csv_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "csv_exports")
    os.makedirs(csv_dir, exist_ok=True)
    
    models = [
        GeoState, GeoDistrict, LegalCourt, PoliceUnitType, PoliceUnit, PoliceRank, PoliceDesignation, PoliceEmployee,
        CaseStatusMaster, CaseCategory, GravityOffence, OccupationMaster, ReligionMaster, CasteMaster,
        Act, LegalSection, CrimeHead, CrimeSubHead, CrimeHeadLegalSection,
        CaseMaster, Inv_OccuranceTime, ComplainantDetails, ActLegalSectionAssociation, VictimTable, AccusedTable, ArrestSurrender, ChargesheetDetails
    ]
    
    for model in models:
        table_name = model.__tablename__
        records = db.query(model).all()
        
        if not records:
            continue
            
        csv_path = os.path.join(csv_dir, f"{table_name}.csv")
        
        with open(csv_path, mode='w', newline='', encoding='utf-8') as file:
            columns = [col.key for col in class_mapper(model).columns]
            writer = csv.writer(file)
            writer.writerow(columns) # Header
            
            for record in records:
                row = []
                for col in columns:
                    val = getattr(record, col)
                    # Convert True/False to true/false for Catalyst boolean columns
                    if isinstance(val, bool):
                        row.append("true" if val else "false")
                    elif val is None:
                        row.append("")
                    else:
                        row.append(str(val))
                writer.writerow(row)
                
        print(f"Exported {len(records)} rows to {csv_path}")

if __name__ == "__main__":
    export_csvs()
