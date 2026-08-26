"""
ClaimPilot Setup Diagnostic & Verification Tool
Validates environment configuration, .pipe JSON structure, and RocketRide rules.
"""

import json
import os
import re
import sys
from pathlib import Path

# Ensure UTF-8 output encoding on Windows shell
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Load .env if present
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("✓ Loaded .env file successfully.")
except ImportError:
    print("! dotenv module not installed (install via requirements.txt).")


PIPE_FILES = [
    "ingestion.pipe",
    "claim_analysis.pipe",
    "claim_chat.pipe",
    "siu_dashboard.pipe",
    "benchmark_explorer.pipe",
    "inspection_scheduling.pipe",
    "claim_status.pipe",
    "adjuster_queue.pipe",
    "feedback_loop.pipe"
]

GUID_REGEX = re.compile(
    r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
)

def verify_pipeline_file(filepath: str) -> bool:
    path = Path(filepath)
    if not path.exists():
        print(f"❌ File not found: {filepath}")
        return False

    if path.suffix != ".pipe":
        print(f"❌ File {filepath} does not have .pipe extension!")
        return False

    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Rule Check 1: components must be first key in JSON
        keys = list(data.keys())
        if keys[0] != "components":
            print(f"❌ {filepath}: 'components' MUST be the first key in JSON object! Found: '{keys[0]}'")
            return False

        # Rule Check 2: project_id must be a literal GUID
        project_id = data.get("project_id")
        if not project_id or not GUID_REGEX.match(project_id):
            print(f"❌ {filepath}: 'project_id' must be a valid literal GUID! Found: '{project_id}'")
            return False

        # Rule Check 3: check component structure & IDs
        components = data.get("components", [])
        if not isinstance(components, list) or len(components) == 0:
            print(f"❌ {filepath}: 'components' array is empty or invalid!")
            return False

        comp_ids = set()
        for comp in components:
            cid = comp.get("id")
            provider = comp.get("provider")
            if not cid or not provider:
                print(f"❌ {filepath}: Component missing 'id' or 'provider'!")
                return False
            if cid in comp_ids:
                print(f"❌ {filepath}: Duplicate component ID found: '{cid}'!")
                return False
            comp_ids.add(cid)

        print(f"✓ {filepath} passes all RocketRide schema & rule validations ({len(components)} components, GUID: {project_id}).")
        return True

    except Exception as e:
        print(f"❌ Error parsing {filepath}: {e}")
        return False

def check_env_vars():
    print("\n--- Checking Environment Configuration ---")
    uri = os.getenv("ROCKETRIDE_URI")
    apikey = os.getenv("ROCKETRIDE_APIKEY")
    openai_key = os.getenv("ROCKETRIDE_OPENAI_KEY")

    print(f"  ROCKETRIDE_URI        : {uri or 'Not set'}")
    print(f"  ROCKETRIDE_APIKEY     : {'Set (masked)' if apikey else 'Not set'}")
    print(f"  ROCKETRIDE_OPENAI_KEY : {'Set (masked)' if openai_key else 'Not set'}")

    if not uri or not apikey:
        print("⚠️ Warning: ROCKETRIDE_URI or ROCKETRIDE_APIKEY is missing in .env.")
        print("   Configure extension settings or update .env before connecting to server.")
    else:
        print("✓ Core RocketRide env variables detected.")

def main():
    print("==================================================")
    print("       ClaimPilot RocketRide Diagnostic Tool      ")
    print("==================================================")

    check_env_vars()

    print("\n--- Validating Pipeline Files ---")
    all_passed = True
    for pipe_file in PIPE_FILES:
        if not verify_pipeline_file(pipe_file):
            all_passed = False

    print("\n==================================================")
    if all_passed:
        print("🎉 ALL CHECKS PASSED SUCCESSFULLY!")
        print("ClaimPilot is properly configured and ready for RocketRide execution.")
    else:
        print("❌ SOME CHECKS FAILED. Please review the errors above.")
    print("==================================================")

if __name__ == "__main__":
    main()
