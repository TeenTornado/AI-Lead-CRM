import requests
import json
import os

# Use the same API key that's in the ai_service.py file
API_KEY = "b62d22ea274ae16d8478d29ccedb049f32bb64712463c4af531ee224eadf86fb"

def test_api_key():
    """Test if the API key is valid and working"""
    print("Testing Together.ai API key...")
    
    # API endpoint for Together.ai
    url = "https://api.together.xyz/v1/chat/completions"
    
    # Simple test data
    data = {
        "model": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        "max_tokens": 100,
        "temperature": 0.7,
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Say hello and confirm the API is working."}
        ]
    }
    
    try:
        # Make the API request
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {API_KEY}'
        }
        response = requests.post(url, headers=headers, json=data)
        
        # Check response status
        if response.status_code == 200:
            result = response.json()
            if 'choices' in result and result['choices'] and 'message' in result['choices'][0]:
                print("\n✅ API Key is working correctly!")
                print("\nResponse from API:")
                print("=" * 40)
                print(result['choices'][0]['message']['content'])
                print("=" * 40)
                return True
            else:
                print("\n❌ Unexpected response format. API key may be invalid.")
                print(json.dumps(result, indent=2))
                return False
        else:
            print(f"\n❌ API request failed with status code: {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print(f"\n❌ Error testing API key: {str(e)}")
        return False

if __name__ == "__main__":
    test_api_key() 