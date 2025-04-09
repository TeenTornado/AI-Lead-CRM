import os
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set the API key directly
API_KEY = "b62d22ea274ae16d8478d29ccedb049f32bb64712463c4af531ee224eadf86fb"

# Fallback to environment variable if needed
if not API_KEY:
    API_KEY = os.getenv('TOGETHER_API_KEY', '')

def get_ai_response(prompt, lead_data=None, system_prompt=None):
    """
    Get AI response for lead management tasks
    
    Args:
        prompt (str): The user prompt
        lead_data (dict, optional): Lead data to provide context
        system_prompt (str, optional): Custom system prompt to override default
        
    Returns:
        str: AI response text
    """
    # Use provided system prompt or fall back to default
    if not system_prompt:
        system_prompt = """You are a helpful Business Lead Management Assistant specialized in helping businesses with lead management strategies. 
        You have expertise in:
        - Lead generation techniques and best practices
        - Lead qualification frameworks (like BANT, MEDDIC, CHAMP)
        - CRM systems and lead tracking
        - Lead scoring methodologies
        - Lead nurturing strategies
        - Sales funnel optimization
        - Lead conversion tactics
        - B2B and B2C lead management differences
        - Sales and marketing alignment for lead management
        
        Provide concise, practical advice specific to business lead management. Be helpful and friendly, but stay focused on lead management topics."""
    
    # If lead data is provided but not directly in the prompt, add it
    if lead_data and "Lead" not in prompt and "LEAD PROFILE" not in prompt:
        prompt = f"Lead Information:\nName: {lead_data.get('name')}\nCompany: {lead_data.get('company')}\nEmail: {lead_data.get('email')}\nStatus: {lead_data.get('status')}\nScore: {lead_data.get('score')}\nValue: ${lead_data.get('value', 0)}\n\n{prompt}"
    
    # Prepare API request data
    data = {
        "model": "meta-llama/Meta-Llama-3.1-70B-Instruct",
        "max_tokens": 1200,
        "temperature": 0.7,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
    }
    
    # API endpoint for Together.ai
    url = "https://api.together.xyz/v1/chat/completions"
    
    try:
        # Make the API request
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {API_KEY}'
        }
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()  # Raise exception for HTTP errors
        
        # Process the response
        result = response.json()
        
        if 'choices' not in result or not result['choices'] or 'message' not in result['choices'][0] or 'content' not in result['choices'][0]['message']:
            return "Unexpected response format from API"
        
        # Return the AI's response content
        return result['choices'][0]['message']['content']
    
    except requests.exceptions.RequestException as e:
        return f"Error connecting to AI service: {str(e)}"
    except json.JSONDecodeError:
        return "Error parsing API response"
    except Exception as e:
        return f"Unexpected error: {str(e)}"

@app.route('/api/ai/followup', methods=['POST'])
def generate_followup():
    """API endpoint to generate follow-up content"""
    data = request.json
    
    if not data or 'prompt' not in data:
        return jsonify({'error': 'Missing prompt parameter'}), 400
    
    lead_data = data.get('lead')
    prompt = data['prompt']
    
    # Create a more detailed system prompt with additional context
    enhanced_system_prompt = """You are an expert Lead Management AI Assistant with years of experience in sales, marketing, and customer relationship management.

Your expertise includes:
- Lead qualification and scoring techniques (BANT, MEDDIC, CHAMP)
- Sales psychology and objection handling
- Timing strategies for follow-ups
- Communication tactics for different lead stages
- Industry-specific sales approaches
- Conversion optimization techniques

When providing recommendations:
- Be specific and actionable, not generic
- Include 2-3 concrete steps the salesperson can take immediately
- Base your advice on the lead's status, score, and value
- Consider timing, communication channel preferences, and objection handling
- Include a suggested timeline when appropriate
- Mention specific resources, content, or value propositions that might be helpful
- Use a confident, professional tone

Your goal is to help the salesperson convert this lead by providing highly targeted, tactical advice tailored to this specific situation.
"""
    
    # Add enhanced lead context
    if lead_data:
        lead_context = f"""
LEAD PROFILE:
- Name: {lead_data.get('name')}
- Company: {lead_data.get('company')}
- Email: {lead_data.get('email')}
- Current Status: {lead_data.get('status', 'unknown')}
- Lead Score: {lead_data.get('score', 0)}/100
- Potential Deal Value: ${lead_data.get('value', 0)}
- Tags: {', '.join(lead_data.get('tags', []))}
- Last Contact: {lead_data.get('lastContact', 'None')}
- Next Scheduled Follow-up: {lead_data.get('nextFollowUp', 'None')}

Additional Notes: {lead_data.get('notes', 'No additional notes')}

FOLLOW-UP QUESTION: {prompt}

Based on this lead's profile and the stage in the sales process, provide specific, actionable follow-up advice that will help move this lead forward. Include specific tactics, timing recommendations, content suggestions, and objection handling strategies as appropriate.
"""
        # Replace the original prompt with our enhanced version
        prompt = lead_context
    
    response = get_ai_response(prompt, lead_data, enhanced_system_prompt)
    
    return jsonify({'response': response})

@app.route('/api/ai/email', methods=['POST'])
def generate_email():
    """API endpoint to generate email content"""
    data = request.json
    
    if not data or 'lead' not in data:
        return jsonify({'error': 'Missing lead data'}), 400
    
    lead = data['lead']
    stage = lead.get('status', 'new')
    
    # Enhanced context about the lead's industry and specific needs
    lead_context = f"""
    Lead Details:
    - Name: {lead.get('name')}
    - Company: {lead.get('company')}
    - Email: {lead.get('email')}
    - Status: {stage}
    - Score: {lead.get('score', 0)} out of 100
    - Potential Deal Value: ${lead.get('value', 0)}
    - Tags: {', '.join(lead.get('tags', []))}
    - Last Contact: {lead.get('lastContact', 'None')}
    """
    
    # Create specific prompts based on lead stage with enhanced instructions for personalization
    stage_prompts = {
        "new": f"""Generate a highly personalized first contact email for a new lead with the following details:
{lead_context}

The email should:
1. Start with a warm, personalized greeting
2. Introduce our company briefly and relevantly
3. Acknowledge their potential interest or pain points
4. Include 1-2 sentences about how we've helped similar companies
5. Suggest a specific discovery call time/date
6. End with a clear call-to-action

Keep it friendly, professional, and under 200 words.
Include subject line at the top.""",
        
        "contacted": f"""Create a follow-up email for a lead we've already reached out to:
{lead_context}

The email should:
1. Reference our previous communication specifically
2. Provide additional value like an industry insight, case study, or relevant resource
3. Show understanding of their business challenges
4. Reiterate our interest in scheduling a call
5. Suggest a specific next step

Keep it concise, engaging, and relationship-focused.
Include subject line at the top.""",
        
        "qualified": f"""Draft an email for a qualified lead who has shown clear interest:
{lead_context}

The email should:
1. Recap their specific needs you've discussed
2. Explain precisely how your product addresses those exact needs
3. Include relevant social proof from their industry
4. Suggest next concrete steps (like a product demo)
5. Include a specific call-to-action with suggested times

Make it personalized to their unique situation.
Include subject line at the top.""",
        
        "proposal": f"""Create a proposal follow-up email:
{lead_context}

The email should:
1. Check in on their review process
2. Address potential questions or objections
3. Offer clarification if needed
4. Suggest a specific timeline for moving forward
5. Reiterate the key value points from the proposal

Be helpful without being pushy.
Include subject line at the top.""",
        
        "negotiation": f"""Write a negotiation-stage email:
{lead_context}

The email should:
1. Thank them for ongoing discussions
2. Diplomatically clarify our position on key terms
3. Express flexibility where appropriate
4. Emphasize the partnership value
5. Suggest next concrete steps to move forward

Be diplomatic, confident, and partnership-focused.
Include subject line at the top.""",
        
        "closed": f"""Create a thank you email for a closed deal:
{lead_context}

The email should:
1. Express genuine gratitude for their business
2. Outline specific next steps for implementation
3. Introduce key contacts they'll be working with (names/roles)
4. Mention our customer success process
5. Set expectations for the onboarding timeline

Be warm, excited, and reassuring.
Include subject line at the top."""
    }
    
    prompt = stage_prompts.get(stage, f"""Write a professional follow-up email to this lead:
{lead_context}

Make it personalized, concise, and with a clear next step.
Include subject line at the top.""")
    
    response = get_ai_response(prompt, lead)
    
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 