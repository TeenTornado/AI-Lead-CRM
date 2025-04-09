import requests
import json
import sys

BASE_URL = "http://localhost:5000"

def test_email_generation():
    """Test the email generation endpoint"""
    print("Testing email generation endpoint...")
    url = f"{BASE_URL}/api/ai/email"
    
    # Test data
    data = {
        "lead": {
            "name": "John Doe",
            "company": "Acme Inc",
            "email": "john@acme.com",
            "status": "qualified",
            "score": 85,
            "value": 50000
        }
    }
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            result = response.json()
            print("\nEmail generation successful!")
            print("\nGenerated Email:")
            print("=" * 80)
            print(result.get('response', 'No response content'))
            print("=" * 80)
            return True
        else:
            print(f"\nError: Status code {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print(f"\nError: {str(e)}")
        return False

def test_followup_generation():
    """Test the follow-up recommendation endpoint"""
    print("\nTesting follow-up recommendation endpoint...")
    url = f"{BASE_URL}/api/ai/followup"
    
    # Test data
    data = {
        "lead": {
            "name": "Jane Smith",
            "company": "Tech Solutions Ltd",
            "email": "jane@techsolutions.com",
            "status": "proposal",
            "score": 92,
            "value": 75000
        },
        "prompt": "What's the best follow-up strategy for this lead who received a proposal last week?"
    }
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            result = response.json()
            print("\nFollow-up recommendation successful!")
            print("\nRecommendation:")
            print("=" * 80)
            print(result.get('response', 'No response content'))
            print("=" * 80)
            return True
        else:
            print(f"\nError: Status code {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print(f"\nError: {str(e)}")
        return False

def main():
    """Run tests"""
    print("AI Lead CRM Backend Service Tester")
    print("=" * 50)
    
    # Check if server is running
    try:
        response = requests.get(f"{BASE_URL}")
        if response.status_code != 404:
            print("Warning: Unexpected response from server root endpoint")
    except requests.exceptions.ConnectionError:
        print("Error: Cannot connect to the server. Is it running?")
        print(f"Expected URL: {BASE_URL}")
        sys.exit(1)
    
    # Run tests
    email_test = test_email_generation()
    followup_test = test_followup_generation()
    
    # Summary
    print("\nTest Summary:")
    print(f"Email Generation: {'✅ Passed' if email_test else '❌ Failed'}")
    print(f"Follow-up Recommendation: {'✅ Passed' if followup_test else '❌ Failed'}")

if __name__ == "__main__":
    main() 