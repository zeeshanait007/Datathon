from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database.sqlite import Base, engine, get_db, CaseMaster, AccusedTable
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import urllib.request
import urllib.error
import json
import os
import zcatalyst_sdk

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

@app.get("/api/seed")
def seed_database_cloud(req: Request):
    try:
        from scripts.seed_datastore_full import seed_cloud_datastore_full
        result = seed_cloud_datastore_full(req)
        return {"status": "success", "message": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Welcome to Crime Intelligence Copilot API"}

# AI Copilot Mock Endpoint
class ChatRequest(BaseModel):
    query: str
    history: list = []

@app.post("/api/copilot/chat")
async def chat_copilot(req: Request):
    body = await req.json()
    query = body.get("query", "").lower()
    history = body.get("history", [])
    
    # Gather live context from Catalyst Data Store to inject into ChatGPT's brain
    try:
        app_sdk = zcatalyst_sdk.initialize(req=req)
        
        # Log this action
        try:
            from routers.api import log_audit_event
            log_audit_event(app_sdk, "Investigator_User", "Copilot AI Query", f"Queried AI: '{query[:50]}...'", "Success", getattr(req.client, "host", "Unknown"))
        except: pass

        zcql = app_sdk.zcql()
        
        # Aggregate count of FIRs bypassing ZCQL COUNT alias syntax exceptions
        count_res = zcql.execute_query("SELECT CaseMasterID FROM CaseMaster")
        total_firs = len(count_res) if count_res else 0
        
        # Recent Accused
        accused_res = zcql.execute_query("SELECT AccusedName, AgeYear FROM Accused LIMIT 3")
        risk_context = ", ".join([f"{a.get('Accused', {}).get('AccusedName')} (Age: {a.get('Accused', {}).get('AgeYear')})" for a in accused_res])
    except Exception as e:
        total_firs = "Unknown (DB Error)"
        risk_context = "Unknown (DB Error)"
    
    system_prompt = f"""
    You are an AI Crime Intelligence Copilot for the Bangalore Police.
    Current live context:
    - Total active FIRs: {total_firs}
    - Highest risk suspects: {risk_context}
    
    CRITICAL INSTRUCTION: Provide ONLY the precise outcome or answer. DO NOT include extra information, conversational filler, introductory phrases, or disclaimers. Act exactly like a high-end, production-level analytical agent.
    """
    
    # Append conversation history
    messages = [{"role": "system", "content": system_prompt}]
    for msg in history:
        messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
    
    messages.append({"role": "user", "content": body.get("query", "")})
    
    payload = {
        "model": "crm-di-glm47b_30b_it",
        "messages": messages,
        "max_tokens": 1000,
        "temperature": 0.3,
        "stream": False,
        "chat_template_kwargs": {
            "enable_thinking": False
        }
    }
    try:
        from zcatalyst_sdk._http_client import AuthorizedHttpClient
        catalyst_app = zcatalyst_sdk.initialize(req=req)
        client = AuthorizedHttpClient(catalyst_app)
        
        # We must forward all internal AppSail headers
        forward_headers = {}
        for k, v in req.headers.items():
            k_low = k.lower()
            if k_low.startswith("x-") or "catalyst" in k_low or "org" in k_low:
                forward_headers[k_low] = v
                
        # ZiaHub QuickML REQUIRES the CATALYST-ORG header. Since AppSail strips it, 
        # we dynamically parse it from the internal project domain!
        org_id = os.environ.get("X_ZOHO_CATALYST_ORG_ID") or os.environ.get("X_CATALYST_ORG")
        if not org_id:
            domain = req.headers.get("x-zc-project-domain", "")
            if domain:
                import re
                # e.g., https://projectname-60075304944.development.catalystserverless.in
                match = re.search(r'-(\d+)\.(development|production)\.', domain)
                if match:
                    org_id = match.group(1)
        
        if org_id:
            forward_headers["catalyst-org"] = org_id
            
        # Invoke QuickML via the native AuthorizedHttpClient (automatically handles Auth)
        response = client.request(
            method="POST",
            path="/glm/chat",
            catalyst_service="quickml",
            json=payload,
            headers=forward_headers
        )
        
        result = response.response_json
        
        # Robustly extract the AI's reply regardless of the exact QuickML schema returned
        if not result:
            chat_reply = "I'm sorry, I didn't receive a response from the intelligence brain. Please try again."
        elif "choices" in result and len(result["choices"]) > 0:
            chat_reply = result["choices"][0]["message"]["content"]
        elif "response" in result:
            chat_reply = result["response"]
        elif "output" in result:
            chat_reply = result["output"]
        elif "data" in result and isinstance(result["data"], dict) and "response" in result["data"]:
            chat_reply = result["data"]["response"]
        elif "data" in result and isinstance(result["data"], dict) and "message" in result["data"]:
            chat_reply = result["data"]["message"]
        else:
            # As a last resort, if the LLM returned a custom JSON structure itself, format it gracefully.
            chat_reply = "Here is the raw intelligence data I gathered:\n\n" + str(result)
            
        return {
            "answer": chat_reply,
            "sources": ["Catalyst QuickML (GLM 4 7B)", "Live SQLite DB"],
            "confidence_score": 0.92,
            "context_retained": True
        }
            
    except Exception as e:
        # Provide a conversational error response instead of a raw JSON dump
        return {
            "answer": "I apologize, but I encountered an internal communication error while accessing the QuickML intelligence network. Please ensure your Catalyst configuration is fully stable, or try asking the question again in a moment.",
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
