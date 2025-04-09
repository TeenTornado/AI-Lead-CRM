#!/bin/bash

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
  echo "Creating virtual environment..."
  python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Prompt for API key if not set
if [ -z "$TOGETHER_API_KEY" ]; then
  echo "Please enter your Together.ai API key:"
  read api_key
  export TOGETHER_API_KEY=$api_key
  echo "API key set for this session."
  echo "To make this permanent, add 'export TOGETHER_API_KEY=$api_key' to your shell profile."
fi

# Start the service
echo "Starting AI Lead CRM backend service..."
python ai_service.py 