@echo off
echo AI Lead CRM Backend Setup

REM Check if virtual environment exists
if not exist venv (
  echo Creating virtual environment...
  python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Prompt for API key if not set
if "%TOGETHER_API_KEY%"=="" (
  echo Please enter your Together.ai API key:
  set /p api_key=
  set TOGETHER_API_KEY=%api_key%
  echo API key set for this session.
  echo To make this permanent, run 'setx TOGETHER_API_KEY %api_key%' in an admin command prompt.
)

REM Start the service
echo Starting AI Lead CRM backend service...
python ai_service.py 