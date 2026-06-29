import sys
import os
import random
from datetime import datetime, timedelta

# Add parent dir to path so we can import from database
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.sqlite import engine, Base, SessionLocal, GeoState, GeoDistrict, LegalCourt, PoliceUnitType, PoliceUnit, PoliceRank, PoliceDesignation, PoliceEmployee, CaseStatusMaster, CaseCategory, GravityOffence, OccupationMaster, ReligionMaster, CasteMaster, Act, LegalSection, CrimeHead, CrimeSubHead, CaseMaster, Inv_OccuranceTime, ComplainantDetails, ActLegalSectionAssociation, VictimTable, AccusedTable, ArrestSurrender

def seed_data():
    print("Initializing Database with Karnataka Police ER Schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # 1. Master Lookups
    print("Seeding Master Lookups...")
    state = GeoState(StateName="Karnataka", IsActive=True)
    db.add(state); db.commit()
    
    district = GeoDistrict(DistrictName="Bengaluru City", StateID=state.StateID, IsActive=True)
    db.add(district); db.commit()
    
    court = LegalCourt(CourtName="City Civil Court", DistrictID=district.DistrictID, StateID=state.StateID, IsActive=True)
    utype = PoliceUnitType(UnitTypeName="Police Station", HierarchyLevel=1, IsActive=True)
    db.add_all([court, utype]); db.commit()
    
    unit = PoliceUnit(UnitName="Indiranagar PS", TypeID=utype.UnitTypeID, StateID=state.StateID, DistrictID=district.DistrictID, IsActive=True)
    rank = PoliceRank(RankName="Inspector", HierarchyLevel=2, IsActive=True)
    designation = PoliceDesignation(DesignationName="SHO", IsActive=True)
    db.add_all([unit, rank, designation]); db.commit()
    
    emp = PoliceEmployee(DistrictID=district.DistrictID, UnitID=unit.UnitID, RankID=rank.RankID, DesignationID=designation.DesignationID, FirstName="Rajesh Kumar", GenderID=1)
    db.add(emp); db.commit()
    
    status = CaseStatusMaster(CaseStatusName="Under Investigation")
    category = CaseCategory(LookupValue="FIR")
    gravity = GravityOffence(LookupValue="Heinous")
    act = Act(ActCode="IPC", ActDescription="Indian Penal Code", IsActive=True)
    db.add_all([status, category, gravity, act]); db.commit()
    
    section = LegalSection(LegalSectionCode="302", ActCode="IPC", LegalSectionDescription="Murder", IsActive=True)
    chead = CrimeHead(CrimeGroupName="Crimes Against Body", IsActive=True)
    subhead = CrimeSubHead(CrimeHeadID=chead.CrimeHeadID, CrimeHeadName="Murder")
    caste = CasteMaster(caste_master_name="General")
    rel = ReligionMaster(ReligionName="Hindu")
    occ = OccupationMaster(OccupationName="Business")
    db.add_all([section, chead, subhead, caste, rel, occ]); db.commit()
    
    print("Generating CaseMaster and Operational Data...")
    
    # Bangalore approximate bounding box
    lat_min, lat_max = 12.85, 13.05
    lon_min, lon_max = 77.45, 77.75
    
    for i in range(1, 101):
        # Create CaseMaster
        case = CaseMaster(
            CrimeNo=f"1044300062026{str(i).zfill(5)}",
            CaseNo=f"2026{str(i).zfill(5)}",
            CrimeRegisteredDate=datetime.utcnow().date() - timedelta(days=random.randint(0, 365)),
            PolicePersonID=emp.EmployeeID,
            PoliceStationID=unit.UnitID,
            CaseCategoryID=category.CaseCategoryID,
            GravityOffenceID=gravity.GravityOffenceID,
            CrimeMajorHeadID=chead.CrimeHeadID,
            CrimeMinorHeadID=subhead.CrimeSubHeadID,
            CaseStatusID=status.CaseStatusID,
            CourtID=court.CourtID
        )
        db.add(case)
        db.commit()
        db.refresh(case)
        
        # Inv_OccuranceTime
        loc = Inv_OccuranceTime(
            CaseMasterID=case.CaseMasterID,
            IncidentFromDate=datetime.utcnow() - timedelta(days=random.randint(0, 365)),
            latitude=random.uniform(lat_min, lat_max),
            longitude=random.uniform(lon_min, lon_max),
            BriefFacts=f"Incident reported at Indiranagar jurisdiction."
        )
        db.add(loc)
        
        # Complainant
        comp = ComplainantDetails(
            CaseMasterID=case.CaseMasterID,
            ComplainantName=f"Complainant_{i}",
            AgeYear=random.randint(20, 60),
            OccupationID=occ.OccupationID,
            ReligionID=rel.ReligionID,
            CasteID=caste.caste_master_id,
            GenderID=1
        )
        db.add(comp)
        
        # ActLegalSectionAssociation
        asa = ActLegalSectionAssociation(CaseMasterID=case.CaseMasterID, ActID=act.ActCode, SectionID=section.LegalSectionCode, ActOrderID=1, SectionOrderID=1)
        db.add(asa)
        
        # Inv_OccuranceTime (Critical for Peak Crime Analytics)
        rand_hour = random.randint(0, 23)
        rand_minute = random.choice([0, 15, 30, 45])
        occurrance_date = datetime.utcnow() - timedelta(days=random.randint(1, 180))
        occurrance_time_str = f"{occurrance_date.strftime('%Y-%m-%d')} {rand_hour:02d}:{rand_minute:02d}:00"
        
        inv_time = Inv_OccuranceTime(
            CaseMasterID=case.CaseMasterID,
            IncidentFromDate=datetime.strptime(occurrance_time_str, "%Y-%m-%d %H:%M:%S"),
            latitude=12.9716 + random.uniform(-0.1, 0.1),
            longitude=77.5946 + random.uniform(-0.1, 0.1),
            BriefFacts="Incident occurred at the specified coordinates."
        )
        db.add(inv_time)
        
        # Victim
        vic = VictimTable(
            CaseMasterID=case.CaseMasterID,
            VictimName=f"Victim_{i}",
            AgeYear=random.randint(18, 50),
            GenderID=random.choice([1, 2])
        )
        db.add(vic)
        
        # Accused
        acc = AccusedTable(
            CaseMasterID=case.CaseMasterID,
            AccusedName=f"Suspect_{random.randint(100, 999)}",
            AgeYear=random.randint(18, 60),
            GenderID=random.choice([1, 1, 1, 2]) # 75% male
        )
        db.add(acc)
        
        # ArrestSurrender
        arr = ArrestSurrender(
            CaseMasterID=case.CaseMasterID,
            ArrestSurrenderDate=datetime.utcnow().date(),
            AccusedMasterID=acc.AccusedMasterID,
            PoliceStationID=unit.UnitID,
            IOID=emp.EmployeeID
        )
        db.add(arr)
        
        db.commit()

    print("Successfully seeded Karnataka Police Database!")
    db.close()

if __name__ == "__main__":
    seed_data()
