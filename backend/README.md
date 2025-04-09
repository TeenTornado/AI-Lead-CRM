# AI Lead CRM Backend

This is the backend service for the AI Lead CRM application. It provides AI-powered functionality for lead management.

## Features

- Email script generation based on lead stage
- Follow-up recommendations based on prompts
- Lead management AI assistant

## Setup

### Prerequisites

- Python 3.7+
- pip (Python package manager)

### Installation

1. Create a virtual environment (recommended):

   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:

   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. Install dependencies:

   ```bash
   pip install flask flask-cors requests
   ```

4. Set up API keys:
   - Get an API key from [Together.ai](https://together.ai)
   - Set it as an environment variable:
     - On Windows:
       ```bash
       set TOGETHER_API_KEY=your_api_key_here
       ```
     - On macOS/Linux:
       ```bash
       export TOGETHER_API_KEY=your_api_key_here
       ```

## Running the Service

Start the Flask server:

```bash
python ai_service.py
```

The server will run on http://localhost:5000 by default.

## API Endpoints

### Generate Email Script

**Endpoint**: `/api/ai/email`
**Method**: POST
**Request Body**:

```json
{
  "lead": {
    "name": "John Doe",
    "company": "Acme Inc",
    "email": "john@acme.com",
    "status": "qualified",
    "score": 85,
    "value": 50000
  }
}
```

**Response**:

```json
{
  "response": "Generated email script content..."
}
```

### Generate Follow-up Recommendations

**Endpoint**: `/api/ai/followup`
**Method**: POST
**Request Body**:

```json
{
  "lead": {
    "name": "John Doe",
    "company": "Acme Inc",
    "email": "john@acme.com",
    "status": "qualified",
    "score": 85,
    "value": 50000
  },
  "prompt": "What's the best follow-up strategy for this lead?"
}
```

**Response**:

```json
{
  "response": "Follow-up recommendation content..."
}
```

## Integration with Frontend

The backend service is designed to be used with the AI Lead CRM frontend application. The frontend makes API calls to the backend service to generate email scripts and follow-up recommendations.

## Troubleshooting

- If you encounter CORS issues, make sure the frontend is running on an allowed origin.
- If you see API error responses, verify your API key is set correctly.
- Check the console for error messages that can help diagnose issues.
