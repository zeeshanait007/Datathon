#!/bin/sh
echo "Booting Catalyst AppSail Backend..."

# Install dependencies dynamically to the writable /tmp folder
if [ ! -d "/tmp/catalyst_packages" ]; then
  echo "Installing requirements to /tmp/catalyst_packages..."
  python3 -m pip install -r requirements.txt -t /tmp/catalyst_packages --no-cache-dir --disable-pip-version-check --prefer-binary
fi

# Inject the packages into the Python module path
export PYTHONPATH="/tmp/catalyst_packages:$PYTHONPATH"

echo "Dependencies loaded. Starting Uvicorn server..."
python3 main.py
