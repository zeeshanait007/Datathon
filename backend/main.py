import sys
import os
import subprocess

# In Zoho Catalyst AppSail, the filesystem is read-only except for /tmp.
# Since AppSail does not automatically install requirements.txt for managed Python runtimes,
# we dynamically install them into the writable /tmp directory on boot!
PKG_DIR = "/tmp/catalyst_packages"

if not os.path.exists(PKG_DIR):
    print(f"Installing dependencies to {PKG_DIR}...", flush=True)
    subprocess.check_call([
        sys.executable, "-m", "pip", "install", 
        "-r", "requirements.txt", 
        "--target", PKG_DIR,
        "--no-cache-dir",
        "--disable-pip-version-check"
    ])

# Inject the dynamic package directory into Python's path
if PKG_DIR not in sys.path:
    sys.path.insert(0, PKG_DIR)

print("Dependencies loaded successfully! Starting application...", flush=True)

# Now safely import Uvicorn and the real FastAPI app
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
