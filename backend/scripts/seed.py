import os
import random
from datetime import datetime, timedelta
from faker import Faker
from sqlalchemy.orm import Session
from database.postgres import SessionLocal, engine, Base, User, FIR, Victim, Accused, Officer, CrimeLocation
from database.neo4j_client import driver
fake = Faker('en_IN') # Indian context for Faker

def get_password_hash(password):
    return "hashed_mock_" + password

def seed_postgres():
    print("Seeding PostgreSQL...")
    db = SessionLocal()
    
    # Check if already seeded
    if db.query(User).first():
        print("Database already seeded.")
        db.close()
        return

    # Users
    users = [
        User(username="investigator1", hashed_password=get_password_hash("password"), role="Investigator"),
        User(username="analyst1", hashed_password=get_password_hash("password"), role="Crime Analyst"),
        User(username="admin1", hashed_password=get_password_hash("password"), role="Supervisor")
    ]
    db.add_all(users)
    
    # Officers
    districts = ["Bangalore Urban", "Bangalore Rural", "Mysuru", "Hubballi", "Mangaluru", "Belagavi"]
    officers = []
    for i in range(50):
        officers.append(Officer(
            name=fake.name(),
            badge_number=f"KA-POL-{fake.unique.random_int(min=1000, max=9999)}",
            district=random.choice(districts)
        ))
    db.add_all(officers)
    db.commit()

    # Get saved officers
    saved_officers = db.query(Officer).all()
    officer_ids = [o.id for o in saved_officers]

    # FIRs, Victims, Accused, Locations
    crime_types = ["Theft", "Burglary", "Assault", "Fraud", "Cybercrime", "Vehicle Theft", "Narcotics"]
    statuses = ["Open", "Under Investigation", "Closed", "Pending Court"]

    print("Generating 1000 FIRs (scaled down from 10k for speed)...")
    for i in range(1000):
        # FIR
        date = fake.date_time_between(start_date="-2y", end_date="now")
        fir = FIR(
            fir_number=f"FIR-{date.year}-{fake.unique.random_int(min=10000, max=99999)}",
            crime_type=random.choice(crime_types),
            date=date,
            status=random.choice(statuses),
            district=random.choice(districts),
            police_station=f"{fake.city()} PS",
            assigned_officer_id=random.choice(officer_ids),
            summary=fake.text(max_nb_chars=200)
        )
        db.add(fir)
        db.commit() # Commit to get fir.id

        # Victim (1-2 per FIR)
        for _ in range(random.randint(1, 2)):
            victim = Victim(
                name=fake.name(),
                age=random.randint(18, 80),
                gender=random.choice(["Male", "Female"]),
                fir_id=fir.id
            )
            db.add(victim)
        
        # Accused (0-2 per FIR)
        for _ in range(random.randint(0, 2)):
            accused = Accused(
                name=fake.name(),
                age=random.randint(18, 65),
                gender=random.choice(["Male", "Female"]),
                risk_score=round(random.uniform(0.1, 0.99), 2),
                fir_id=fir.id
            )
            db.add(accused)
            
        # Location
        loc = CrimeLocation(
            fir_id=fir.id,
            latitude=fake.latitude(),
            longitude=fake.longitude(),
            address=fake.address().replace('\n', ', ')
        )
        db.add(loc)
        
        if i % 100 == 0:
            db.commit()
            print(f"  {i} FIRs generated...")
            
    db.commit()
    db.close()
    print("PostgreSQL seeding complete.")

def seed_neo4j():
    print("Seeding Neo4j...")
    db = SessionLocal()
    
    # We will fetch some accused and FIRs to create a small network
    accused_list = db.query(Accused).limit(500).all()
    fir_list = db.query(FIR).limit(500).all()
    locations = db.query(CrimeLocation).limit(500).all()
    
    if not accused_list:
        print("No PostgreSQL data to seed Neo4j with. Aborting.")
        return
        
    def create_graph(tx):
        # Clear existing
        tx.run("MATCH (n) DETACH DELETE n")
        
        # Create Persons
        print("  Creating Persons in Neo4j...")
        for a in accused_list:
            tx.run(
                "CREATE (p:Person {id: $id, name: $name, risk_score: $risk_score})",
                id=a.id, name=a.name, risk_score=a.risk_score
            )
            
        # Create Crimes
        print("  Creating Crimes in Neo4j...")
        for f in fir_list:
            tx.run(
                "CREATE (c:Crime {id: $id, fir_number: $fir_number, type: $type})",
                id=f.id, fir_number=f.fir_number, type=f.crime_type
            )
            
        # Create Locations
        print("  Creating Locations in Neo4j...")
        for l in locations:
            tx.run(
                "CREATE (loc:Location {id: $id, address: $address})",
                id=l.id, address=l.address
            )
            
        # Create Relationships (Randomized for mock)
        print("  Creating Relationships in Neo4j...")
        # 1. COMMITTED: Person -> Crime
        for a in accused_list:
            if a.fir_id:
                tx.run(
                    "MATCH (p:Person {id: $pid}), (c:Crime {id: $cid}) "
                    "CREATE (p)-[:COMMITTED]->(c)",
                    pid=a.id, cid=a.fir_id
                )
        
        # 2. ASSOCIATED_WITH: Person -> Person
        for _ in range(300):
            p1 = random.choice(accused_list)
            p2 = random.choice(accused_list)
            if p1.id != p2.id:
                tx.run(
                    "MATCH (p1:Person {id: $p1id}), (p2:Person {id: $p2id}) "
                    "MERGE (p1)-[:ASSOCIATED_WITH]->(p2)",
                    p1id=p1.id, p2id=p2.id
                )
                
        # 3. OCCURRED_AT: Crime -> Location
        for l in locations:
            tx.run(
                "MATCH (c:Crime {id: $cid}), (loc:Location {id: $lid}) "
                "CREATE (c)-[:OCCURRED_AT]->(loc)",
                cid=l.fir_id, lid=l.id
            )
                
    with driver.session() as session:
        session.execute_write(create_graph)
        
    db.close()
    print("Neo4j seeding complete.")

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    seed_postgres()
    seed_neo4j()
