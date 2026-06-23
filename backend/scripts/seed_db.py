import sys
import os
import random
from datetime import datetime, timedelta

# Add parent dir to path so we can import from database
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.sqlite import engine, Base, SessionLocal, FIR, Accused, CrimeLocation, Victim, NetworkEdge

def seed_data():
    print("Initializing Database...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    crime_types = ["Theft", "Assault", "Cybercrime", "Fraud", "Burglary", "Extortion"]
    districts = ["Indiranagar", "Koramangala", "Whitefield", "Jayanagar", "Malleswaram"]
    statuses = ["Open", "Under Investigation", "Closed", "Pending Court"]
    
    # Bangalore approximate bounding box
    lat_min, lat_max = 12.85, 13.05
    lon_min, lon_max = 77.45, 77.75
    
    print("Generating FIRs, Locations, and Victims...")
    firs = []
    accused_list = []
    
    for i in range(1, 201):
        # Create FIR
        fir = FIR(
            fir_number=f"FIR-2025-{str(i).zfill(4)}",
            crime_type=random.choice(crime_types),
            date=datetime.utcnow() - timedelta(days=random.randint(0, 365)),
            status=random.choice(statuses),
            district=random.choice(districts),
            police_station=f"Station {random.randint(1, 5)}",
            summary=f"Incident of {random.choice(crime_types).lower()} reported in {random.choice(districts)} involving property/personal damage."
        )
        db.add(fir)
        db.commit()
        db.refresh(fir)
        firs.append(fir)
        
        # Create Location
        loc = CrimeLocation(
            fir_id=fir.id,
            latitude=random.uniform(lat_min, lat_max),
            longitude=random.uniform(lon_min, lon_max),
            address=f"{random.randint(1, 999)} {fir.district} Main Road"
        )
        db.add(loc)
        
        # Create Victim
        vic = Victim(
            name=f"Victim {i}",
            age=random.randint(18, 75),
            gender=random.choice(["M", "F"]),
            fir_id=fir.id
        )
        db.add(vic)
        
        # Create Accused (60% chance to have identified accused)
        if random.random() > 0.4:
            acc = Accused(
                name=f"Suspect {random.randint(100, 900)}",
                age=random.randint(18, 60),
                gender=random.choice(["M", "F"]),
                risk_score=random.uniform(0.1, 0.99),
                fir_id=fir.id
            )
            db.add(acc)
            db.commit()
            db.refresh(acc)
            accused_list.append((acc, fir))
            
    db.commit()
    
    print("Generating Network Graph Edges...")
    # Link Accused to FIRs
    for acc, fir in accused_list:
        edge = NetworkEdge(
            source_id=f"accused_{acc.id}",
            target_id=f"fir_{fir.id}",
            source_label=acc.name,
            target_label=f"{fir.crime_type} ({fir.fir_number})",
            source_type="suspect",
            target_type="crime",
            relationship_type="COMMITTED"
        )
        db.add(edge)
        
    # Link some Accused to each other to form syndicates
    for i in range(30):
        if len(accused_list) > 2:
            pair = random.sample(accused_list, 2)
            acc1 = pair[0][0]
            acc2 = pair[1][0]
            edge = NetworkEdge(
                source_id=f"accused_{acc1.id}",
                target_id=f"accused_{acc2.id}",
                source_label=acc1.name,
                target_label=acc2.name,
                source_type="suspect",
                target_type="suspect",
                relationship_type="ASSOCIATED_WITH"
            )
            db.add(edge)
            
    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()
