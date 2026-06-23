from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.sqlite import get_db, FIR, Accused, Victim, CrimeLocation, NetworkEdge
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

@router.get("/firs")
def get_firs(db: Session = Depends(get_db), limit: int = 100):
    return db.query(FIR).limit(limit).all()

@router.get("/firs/{fir_id}")
def get_fir(fir_id: int, db: Session = Depends(get_db)):
    fir = db.query(FIR).filter(FIR.id == fir_id).first()
    if not fir:
        raise HTTPException(status_code=404, detail="FIR not found")
    
    victims = db.query(Victim).filter(Victim.fir_id == fir_id).all()
    accused = db.query(Accused).filter(Accused.fir_id == fir_id).all()
    location = db.query(CrimeLocation).filter(CrimeLocation.fir_id == fir_id).first()
    
    return {
        "fir": fir,
        "victims": victims,
        "accused": accused,
        "location": location
    }

@router.get("/network/{accused_id}")
def get_criminal_network(accused_id: str, db: Session = Depends(get_db)):
    if accused_id.lower() == "all" or accused_id.lower() == "accused_all":
        # Return a large subset of the entire network for a rich visualization
        edges = db.query(NetworkEdge).limit(500).all()
    else:
        if not accused_id.startswith("accused_") and not accused_id.startswith("fir_"):
            accused_id = f"accused_{accused_id}"
        
        # Replaces Neo4j with SQL-based Network Edge traversal
        edges = db.query(NetworkEdge).filter(
            (NetworkEdge.source_id == accused_id) | (NetworkEdge.target_id == accused_id)
        ).all()
    
    nodes_dict = {}
    links = []
    
    for edge in edges:
        if edge.source_id not in nodes_dict:
            nodes_dict[edge.source_id] = {"id": edge.source_id, "group": edge.source_type, "label": edge.source_label}
        if edge.target_id not in nodes_dict:
            nodes_dict[edge.target_id] = {"id": edge.target_id, "group": edge.target_type, "label": edge.target_label}
            
        links.append({
            "source": edge.source_id,
            "target": edge.target_id,
            "label": edge.relationship_type
        })
        
    return {
        "nodes": list(nodes_dict.values()),
        "links": links
    }

@router.get("/hotspots")
def get_hotspots(db: Session = Depends(get_db), limit: int = 500):
    locs = db.query(CrimeLocation).limit(limit).all()
    return locs
