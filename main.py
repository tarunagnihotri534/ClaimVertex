"""
ClaimPilot - AI Insurance Claim Processing Application
Built using the RocketRide SDK and Pipelines.
"""

import asyncio
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Ensure UTF-8 encoding output on Windows shell
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# Load environment configuration from .env
load_dotenv()

# Ensure unbuffered printing
import functools
print = functools.partial(print, flush=True)

try:
    from rocketride import RocketRideClient
    from rocketride.schema import Question
except ImportError:
    print("❌ 'rocketride' package not installed. Run: pip install -r requirements.txt")
    sys.exit(1)


def extract_answer(response: dict) -> str:
    """
    Extract answer text safely from RocketRide chat response dictionary,
    accounting for custom lane names via result_types mapping.
    """
    if not isinstance(response, dict):
        return str(response)

    result_types = response.get("result_types", {})

    # Check for mapped 'answers' key in result_types
    for key, lane_type in result_types.items():
        if lane_type == "answers":
            answers = response.get(key, [])
            if answers and len(answers) > 0:
                return answers[0]

    # Fallback to default 'answers' key
    answers = response.get("answers", [])
    if answers and len(answers) > 0:
        return answers[0]

    return response.get("message", "No response text received.")


class ClaimPilotApp:
    """Main application class for ClaimPilot AI operations."""

    def __init__(self):
        # RocketRideClient automatically reads ROCKETRIDE_URI and ROCKETRIDE_APIKEY from .env
        self.client = RocketRideClient()
        self.ingestion_token = None
        self.analysis_token = None
        self.chat_token = None

    async def initialize_pipelines(self):
        """Connect to RocketRide server and initialize/reuse all required pipelines."""
        print("🔗 Connecting to RocketRide server...")
        await self.client.connect()
        print("✓ Connected to RocketRide server.")

        # Start or reuse Ingestion Pipeline
        print("🚀 Initializing Ingestion Pipeline (ingestion.pipe)...")
        ingest_res = await self.client.use(filepath="ingestion.pipe", use_existing=True)
        self.ingestion_token = ingest_res["token"]
        print(f"  └─ Ingestion Pipeline Token: {self.ingestion_token}")

        # Start or reuse Claim Analysis Pipeline
        print("🚀 Initializing Claim Analysis Pipeline (claim_analysis.pipe)...")
        analysis_res = await self.client.use(filepath="claim_analysis.pipe", use_existing=True)
        self.analysis_token = analysis_res["token"]
        print(f"  └─ Analysis Pipeline Token: {self.analysis_token}")

        # Start or reuse Claim Chat Pipeline
        print("🚀 Initializing Claim Q&A Chat Pipeline (claim_chat.pipe)...")
        chat_res = await self.client.use(filepath="claim_chat.pipe", use_existing=True)
        self.chat_token = chat_res["token"]
        print(f"  └─ Chat Pipeline Token: {self.chat_token}")

    async def ingest_claim_documents(self, file_paths: list):
        """Upload and process claim documents (receipts, medical reports, claim forms)."""
        print(f"\n📄 Uploading {len(file_paths)} document(s) to Ingestion Pipeline...")
        existing_files = [f for f in file_paths if Path(f).exists()]

        if not existing_files:
            print("⚠️ No valid files found on disk to ingest.")
            return

        results = await self.client.send_files(existing_files, token=self.ingestion_token)
        for res in results:
            if res.get("action") == "complete":
                print(f"  ✓ {res['filepath']} uploaded & indexed successfully.")
            else:
                print(f"  ❌ {res['filepath']} upload failed: {res.get('error')}")

    async def analyze_claim_file(self, claim_text: str):
        """Directly analyze claim details using the claim_analysis pipeline."""
        print("\n🔍 Running AI Claim Assessment & Fraud Screening...")
        response = await self.client.send(token=self.analysis_token, data=claim_text)
        print("📊 Claim Assessment Result:")
        print(extract_answer(response))

    async def query_claim_assistant(self, question_text: str) -> str:
        """Query the ClaimPilot RAG chat pipeline regarding claim documents."""
        print(f"\n❓ Adjuster Query: '{question_text}'")
        q = Question()
        q.addQuestion(question_text)

        response = await self.client.chat(token=self.chat_token, question=q)
        answer = extract_answer(response)
        print(f"🤖 ClaimPilot Response:\n{answer}")
        return answer

    async def close(self):
        """Terminate pipelines on server to prevent orphan processes and disconnect."""
        print("\n🧹 Cleaning up pipeline tasks...")
        for name, token in [("Ingestion", self.ingestion_token), ("Analysis", self.analysis_token), ("Chat", self.chat_token)]:
            if token:
                try:
                    await self.client.terminate(token)
                    print(f"  ✓ Terminated {name} pipeline task ({token}).")
                except Exception as e:
                    print(f"  ! Terminate {name} skipped: {e}")

        await self.client.disconnect()
        print("🔌 Disconnected from RocketRide server.")



async def main():
    print("==================================================")
    print("        ClaimPilot - AI Insurance Engine          ")
    print("==================================================")

    app = ClaimPilotApp()
    try:
        await app.initialize_pipelines()

        # Sample demonstration data
        sample_claim_summary = """
        CLAIM RECORD #CP-2026-88412
        Claimant: Jane Doe
        Policy Number: POL-994821
        Incident Date: August 15, 2026
        Description: Water line burst causing damage to hardwood floor and cabinet bases in kitchen.
        Estimated Damage Amount: $8,450.00
        Attached Documents: Plumber_Invoice_88412.pdf, Damage_Photos_Kitchen.zip
        """

        # Perform claim analysis
        await app.analyze_claim_file(sample_claim_summary)

        # Query claim assistant via RAG chat
        await app.query_claim_assistant("What is the estimated damage amount and cause for claim CP-2026-88412?")

    except Exception as e:
        print(f"\n❌ Execution Exception: {e}")
        print("   Note: Ensure your RocketRide server URI and API keys are properly configured in .env.")
    finally:
        await app.close()


if __name__ == "__main__":
    asyncio.run(main())
