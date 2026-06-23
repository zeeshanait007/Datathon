from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
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

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # Investigator, Crime Analyst, Supervisor

class FIR(Base):
    __tablename__ = "firs"
    id = Column(Integer, primary_key=True, index=True)
    fir_number = Column(String, unique=True, index=True)
    crime_type = Column(String, index=True)
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(String)
    district = Column(String, index=True)
    police_station = Column(String)
    assigned_officer_id = Column(Integer, ForeignKey("officers.id"))
    summary = Column(Text)

class Victim(Base):
    __tablename__ = "victims"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    fir_id = Column(Integer, ForeignKey("firs.id"))

class Accused(Base):
    __tablename__ = "accused"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    risk_score = Column(Float)
    fir_id = Column(Integer, ForeignKey("firs.id"))

class Officer(Base):
    __tablename__ = "officers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    badge_number = Column(String, unique=True)
    district = Column(String)

class CrimeLocation(Base):
    __tablename__ = "crime_locations"
    id = Column(Integer, primary_key=True, index=True)
    fir_id = Column(Integer, ForeignKey("firs.id"))
    latitude = Column(Float)
    longitude = Column(Float)
    address = Column(String)

# NEW: Network Edge simulation to replace Neo4j!
class NetworkEdge(Base):
    __tablename__ = "network_edges"
    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(String, index=True) # E.g., 'accused_1'
    target_id = Column(String, index=True) # E.g., 'fir_5'
    source_label = Column(String) # e.g. Suspect Name
    target_label = Column(String) # e.g. Crime Type
    source_type = Column(String) # 'suspect'
    target_type = Column(String) # 'crime'
    relationship_type = Column(String) # COMMITTED, ASSOCIATED_WITH

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
