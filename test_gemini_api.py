import os
import asyncio
import httpx
from dotenv import load_dotenv

env_path = r"C:\Users\lenovo\.gemini\antigravity\scratch\cyberoutreach-agent-v2\.env"
load_dotenv(env_path)

async def test_gemini():
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        print("ERROR: GEMINI_API_KEY not found in .env!")
        return
    print(f"Loaded key starting with: {gemini_key[:5]}...")

    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={gemini_key}"
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                models = [m.get("name") for m in data.get("models", [])]
                print(f"[OK] Available Gemini Models: {models[:10]}...")
            else:
                print(f"[FAIL] Status Code {resp.status_code}")
                print(f"Details: {resp.text}")
    except Exception as e:
        print(f"[ERROR] Exception: {e}")

if __name__ == "__main__":
    asyncio.run(test_gemini())
