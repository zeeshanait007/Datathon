from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database.sqlite import Base, engine, get_db, FIR, Accused
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import urllib.request
import urllib.error
import json
import os

app = FastAPI(title="Crime Intelligence Copilot API")

# Setup CORS securely for Catalyst AppSail
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["Content-Type", "Authorization", "Accept", "*"],
)

@app.on_event("startup")
def on_startup():
    pass

from routers import api

app.include_router(api.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Crime Intelligence Copilot API"}

# AI Copilot Mock Endpoint
class ChatRequest(BaseModel):
    query: str
    history: list = []

@app.post("/api/copilot/chat")
async def chat_copilot(req: Request, db: Session = Depends(get_db)):
    body = await req.json()
    query = body.get("query", "").lower()
    history = body.get("history", [])
    
    # Gather live context from SQLite to inject into ChatGPT's brain
    total_firs = db.query(FIR).count()
    high_risk_accused = db.query(Accused).order_by(Accused.risk_score.desc()).limit(3).all()
    
    risk_context = ", ".join([f"{a.name} (Risk: {a.risk_score:.2f})" for a in high_risk_accused])
    
    system_prompt = (
        "You are an advanced Crime Intelligence Copilot for the Bangalore Police Datathon.\n"
        "You have direct access to the live crime database.\n"
        f"CURRENT DATABASE CONTEXT:\n- Total FIRs: {total_firs}\n- Top 3 High-Risk Suspects: {risk_context}\n"
        "Be concise, analytical, and professional. Always use the provided context to answer questions."
    )
    
    messages = [{"role": "system", "content": system_prompt}]
    
    # Append conversation history
    for msg in history:
        messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
        
    messages.append({"role": "user", "content": body.get("query", "")})
    
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key == "<INSERT_YOUR_GEMINI_KEY>":
        return {
            "answer": "⚠️ **Gemini API Key is missing!**\n\nTo enable the AI Copilot, please add your `GEMINI_API_KEY` to `app-config.json` and deploy.",
            "sources": ["System Configuration"],
            "confidence_score": 1.0,
            "context_retained": False
        }
    
    # Map OpenAI-style history to Gemini format
    gemini_contents = []
    for msg in history:
        role = "model" if msg.get("role") == "assistant" else "user"
        gemini_contents.append({
            "role": role,
            "parts": [{"text": msg.get("content", "")}]
        })
        
    gemini_contents.append({
        "role": "user",
        "parts": [{"text": body.get("query", "")}]
    })

    payload = {
        "systemInstruction": {
            "parts": [{"text": system_prompt}]
        },
        "contents": gemini_contents,
        "generationConfig": {
            "temperature": 0.3
        }
    }
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    try:
        req_api = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req_api, timeout=15) as response:
            result = json.loads(response.read().decode("utf-8"))
            chat_reply = result["candidates"][0]["content"]["parts"][0]["text"]
            return {
                "answer": chat_reply,
                "sources": ["Gemini 1.5 Flash", "Live SQLite DB"],
                "confidence_score": 0.95,
                "context_retained": True
            }
            
    except urllib.error.URLError as e:
        error_str = str(e)
        if "429" in error_str:
            # Fallback for Datathon demo if API key runs out of credits
            return {
                "answer": f"*(Simulated Response due to Gemini Rate Limit)*\n\nBased on the live database, we currently have **{total_firs} active FIRs**. The highest risk suspects are **{risk_context}**. I recommend dispatching officers to investigate these individuals immediately.",
                "sources": ["Live SQLite DB (Mocked)"],
                "confidence_score": 0.85,
                "context_retained": True
            }
        return {
            "answer": f"Failed to connect to Gemini API: {error_str}",
            "sources": [],
            "confidence_score": 0.0,
            "context_retained": False
        }
    except Exception as e:
        return {
            "answer": f"An error occurred: {str(e)}",
            "sources": [],
            "confidence_score": 0.0,
            "context_retained": False
        }

@app.get("/api/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    return {
        "total_firs": db.query(FIR).count(),
        "active_investigations": db.query(FIR).filter(FIR.status == "Open").count(),
        "repeat_offenders": db.query(Accused).filter(Accused.risk_score > 0.6).count(),
        "crime_hotspots": db.query(FIR.district).distinct().count(),
        "cases_closed": db.query(FIR).filter(FIR.status == "Closed").count()
    }

if __name__ == "__main__":
    import uvicorn
    import os
    
    port_str = os.environ.get("X_ZOHO_CATALYST_LISTEN_PORT")
    try:
        port = int(port_str)
    except (TypeError, ValueError):
        port = 9000
        
    uvicorn.run(app, host="0.0.0.0", port=port)
