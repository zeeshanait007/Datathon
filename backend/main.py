import sys
import os

import uvicorn
from app import app

if __name__ == "__main__":
    port_str = os.environ.get("X_ZOHO_CATALYST_LISTEN_PORT")
    try:
        port = int(port_str)
    except (TypeError, ValueError):
        port = 9000
        
    print(f"Binding Uvicorn to port {port}...", flush=True)
    uvicorn.run(app, host="0.0.0.0", port=port)
