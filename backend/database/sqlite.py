from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Date, ForeignKey, Boolean, Text, Numeric, CHAR
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
import os
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# The database file is located in the backend/ root directory, one level above backend/database/
SOURCE_DB = os.path.join(os.path.dirname(BASE_DIR), "crime_db.sqlite")
TMP_DB = "/tmp/crime_db.sqlite"

# Copy to /tmp to avoid Read-Only filesystem errors in AppSail containers
if os.path.exists(SOURCE_DB) and not os.path.exists(TMP_DB):
    try:
        shutil.copy2(SOURCE_DB, TMP_DB)
    except Exception:
        pass # fallback if /tmp is restricted or already exists

# If /tmp copy exists, use it, else fallback to local (for local dev)
ACTIVE_DB = TMP_DB if os.path.exists(TMP_DB) else SOURCE_DB
DATABASE_URL = f"sqlite:///{ACTIVE_DB}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- MASTER LOOKUP TABLES ---

class CasteMaster(Base):
    __tablename__ = "CasteMaster"
    caste_master_id = Column(Integer, primary_key=True)
    caste_master_name = Column(String)

class ReligionMaster(Base):
    __tablename__ = "ReligionMaster"
    ReligionID = Column(Integer, primary_key=True)
    ReligionName = Column(String)

class OccupationMaster(Base):
    __tablename__ = "OccupationMaster"
    OccupationID = Column(Integer, primary_key=True)
    OccupationName = Column(String)

class CaseStatusMaster(Base):
    __tablename__ = "CaseStatusMaster"
    CaseStatusID = Column(Integer, primary_key=True)
    CaseStatusName = Column(String)

class CaseCategory(Base):
    __tablename__ = "CaseCategory"
    CaseCategoryID = Column(Integer, primary_key=True)
    LookupValue = Column(String)

class GravityOffence(Base):
    __tablename__ = "GravityOffence"
    GravityOffenceID = Column(Integer, primary_key=True)
    LookupValue = Column(String)

# --- LEGAL ENTITY TABLES ---

class Act(Base):
    __tablename__ = "Act"
    ActCode = Column(String, primary_key=True)
    ActDescription = Column(String)
    ShortName = Column(String)
    IsActive = Column(Boolean)

class LegalSection(Base):
    __tablename__ = "LegalSection"
    LegalSectionCode = Column(String, primary_key=True)
    ActCode = Column(String, ForeignKey("Act.ActCode"))
    LegalSectionDescription = Column(String)
    IsActive = Column(Boolean)

class CrimeHead(Base):
    __tablename__ = "CrimeHead"
    CrimeHeadID = Column(Integer, primary_key=True)
    CrimeGroupName = Column(String)
    IsActive = Column(Boolean)

class CrimeSubHead(Base):
    __tablename__ = "CrimeSubHead"
    CrimeSubHeadID = Column(Integer, primary_key=True)
    CrimeHeadID = Column(Integer, ForeignKey("CrimeHead.CrimeHeadID"))
    CrimeHeadName = Column(String)
    SeqID = Column(Integer)

class CrimeHeadLegalSection(Base):
    __tablename__ = "CrimeHeadLegalSection"
    id = Column(Integer, primary_key=True, autoincrement=True)
    CrimeHeadID = Column(Integer, ForeignKey("CrimeHead.CrimeHeadID"))
    ActCode = Column(String, ForeignKey("Act.ActCode"))
    LegalSectionCode = Column(String)

# --- ORGANIZATIONAL TABLES ---

class GeoState(Base):
    __tablename__ = "GeoState"
    StateID = Column(Integer, primary_key=True)
    StateName = Column(String)
    NationalityID = Column(Integer)
    IsActive = Column(Boolean)

class GeoDistrict(Base):
    __tablename__ = "GeoDistrict"
    DistrictID = Column(Integer, primary_key=True)
    DistrictName = Column(String)
    StateID = Column(Integer, ForeignKey("GeoState.StateID"))
    IsActive = Column(Boolean)

class LegalCourt(Base):
    __tablename__ = "LegalCourt"
    CourtID = Column(Integer, primary_key=True)
    CourtName = Column(String)
    DistrictID = Column(Integer, ForeignKey("GeoDistrict.DistrictID"))
    StateID = Column(Integer, ForeignKey("GeoState.StateID"))
    IsActive = Column(Boolean)

class PoliceUnitType(Base):
    __tablename__ = "PoliceUnitType"
    UnitTypeID = Column(Integer, primary_key=True)
    UnitTypeName = Column(String)
    CityDistState = Column(String)
    HierarchyLevel = Column(Integer)
    IsActive = Column(Boolean)

class PoliceUnit(Base):
    __tablename__ = "PoliceUnit"
    UnitID = Column(Integer, primary_key=True)
    UnitName = Column(String)
    TypeID = Column(Integer, ForeignKey("PoliceUnitType.UnitTypeID"))
    ParentUnit = Column(Integer)
    NationalityID = Column(Integer)
    StateID = Column(Integer, ForeignKey("GeoState.StateID"))
    DistrictID = Column(Integer, ForeignKey("GeoDistrict.DistrictID"))
    IsActive = Column(Boolean)

class PoliceRank(Base):
    __tablename__ = "PoliceRank"
    RankID = Column(Integer, primary_key=True)
    RankName = Column(String)
    HierarchyLevel = Column(Integer)
    IsActive = Column(Boolean)

class PoliceDesignation(Base):
    __tablename__ = "PoliceDesignation"
    DesignationID = Column(Integer, primary_key=True)
    DesignationName = Column(String)
    IsActive = Column(Boolean)
    SortOrder = Column(Integer)

class PoliceEmployee(Base):
    __tablename__ = "PoliceEmployee"
    EmployeeID = Column(Integer, primary_key=True)
    DistrictID = Column(Integer, ForeignKey("GeoDistrict.DistrictID"))
    UnitID = Column(Integer, ForeignKey("PoliceUnit.UnitID"))
    RankID = Column(Integer, ForeignKey("PoliceRank.RankID"))
    DesignationID = Column(Integer, ForeignKey("PoliceDesignation.DesignationID"))
    KGID = Column(String)
    FirstName = Column(String)
    EmployeeDOB = Column(Date)
    GenderID = Column(Integer)
    BloodGroupID = Column(Integer)
    PhysicallyChallenged = Column(Boolean)
    AppointmentDate = Column(Date)

# --- CORE OPERATIONAL TABLES ---

class CaseMaster(Base):
    __tablename__ = "CaseMaster"
    CaseMasterID = Column(Integer, primary_key=True)
    CrimeNo = Column(String)
    CaseNo = Column(String)
    CrimeRegisteredDate = Column(Date)
    PolicePersonID = Column(Integer, ForeignKey("PoliceEmployee.EmployeeID"))
    PoliceStationID = Column(Integer, ForeignKey("PoliceUnit.UnitID"))
    CaseCategoryID = Column(Integer, ForeignKey("CaseCategory.CaseCategoryID"))
    GravityOffenceID = Column(Integer, ForeignKey("GravityOffence.GravityOffenceID"))
    CrimeMajorHeadID = Column(Integer, ForeignKey("CrimeHead.CrimeHeadID"))
    CrimeMinorHeadID = Column(Integer, ForeignKey("CrimeSubHead.CrimeSubHeadID"))
    CaseStatusID = Column(Integer, ForeignKey("CaseStatusMaster.CaseStatusID"))
    CourtID = Column(Integer, ForeignKey("LegalCourt.CourtID"))

class Inv_OccuranceTime(Base):
    __tablename__ = "Inv_OccuranceTime"
    id = Column(Integer, primary_key=True, autoincrement=True)
    CaseMasterID = Column(Integer, ForeignKey("CaseMaster.CaseMasterID"))
    IncidentFromDate = Column(DateTime)
    IncidentToDate = Column(DateTime)
    InfoReceivedPSDate = Column(DateTime)
    latitude = Column(Float)
    longitude = Column(Float)
    BriefFacts = Column(Text)

class ComplainantDetails(Base):
    __tablename__ = "ComplainantDetails"
    ComplainantID = Column(Integer, primary_key=True)
    CaseMasterID = Column(Integer, ForeignKey("CaseMaster.CaseMasterID"))
    ComplainantName = Column(String)
    AgeYear = Column(Integer)
    OccupationID = Column(Integer, ForeignKey("OccupationMaster.OccupationID"))
    ReligionID = Column(Integer, ForeignKey("ReligionMaster.ReligionID"))
    CasteID = Column(Integer, ForeignKey("CasteMaster.caste_master_id"))
    GenderID = Column(Integer)

class ActLegalSectionAssociation(Base):
    __tablename__ = "ActLegalSectionAssociation"
    id = Column(Integer, primary_key=True, autoincrement=True)
    CaseMasterID = Column(Integer, ForeignKey("CaseMaster.CaseMasterID"))
    ActID = Column(String, ForeignKey("Act.ActCode"))
    SectionID = Column(String, ForeignKey("LegalSection.LegalSectionCode"))
    ActOrderID = Column(Integer)
    SectionOrderID = Column(Integer)

class VictimTable(Base):
    __tablename__ = "Victim"
    VictimMasterID = Column(Integer, primary_key=True)
    CaseMasterID = Column(Integer, ForeignKey("CaseMaster.CaseMasterID"))
    VictimName = Column(String)
    AgeYear = Column(Integer)
    GenderID = Column(Integer)
    VictimPolice = Column(String)

class AccusedTable(Base):
    __tablename__ = "Accused"
    AccusedMasterID = Column(Integer, primary_key=True)
    CaseMasterID = Column(Integer, ForeignKey("CaseMaster.CaseMasterID"))
    AccusedName = Column(String)
    AgeYear = Column(Integer)
    GenderID = Column(Integer)
    PersonID = Column(String)

class ArrestSurrender(Base):
    __tablename__ = "ArrestSurrender"
    ArrestSurrenderID = Column(Integer, primary_key=True)
    CaseMasterID = Column(Integer, ForeignKey("CaseMaster.CaseMasterID"))
    ArrestSurrenderTypeID = Column(Integer)
    ArrestSurrenderDate = Column(Date)
    ArrestSurrenderStateId = Column(Integer, ForeignKey("GeoState.StateID"))
    ArrestSurrenderDistrictId = Column(Integer, ForeignKey("GeoDistrict.DistrictID"))
    PoliceStationID = Column(Integer, ForeignKey("PoliceUnit.UnitID"))
    IOID = Column(Integer, ForeignKey("PoliceEmployee.EmployeeID"))
    CourtID = Column(Integer, ForeignKey("LegalCourt.CourtID"))
    AccusedMasterID = Column(Integer, ForeignKey("Accused.AccusedMasterID"))
    IsAccused = Column(Boolean)
    IsComplainantAccused = Column(Boolean)

class ChargesheetDetails(Base):
    __tablename__ = "ChargesheetDetails"
    CSID = Column(Integer, primary_key=True)
    CaseMasterID = Column(Integer, ForeignKey("CaseMaster.CaseMasterID"))
    csdate = Column(DateTime)
    cstype = Column(CHAR)
    PolicePersonID = Column(Integer, ForeignKey("PoliceEmployee.EmployeeID"))

class AuditLog(Base):
    __tablename__ = "AuditLog"
    AuditLogID = Column(Integer, primary_key=True, autoincrement=True)
    UserIdentifier = Column(String)
    ActionName = Column(String)
    ActionDetails = Column(Text)
    ActionTimestamp = Column(DateTime)
    Status = Column(String)
    IPAddress = Column(String)

# --- UTILITIES ---

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
