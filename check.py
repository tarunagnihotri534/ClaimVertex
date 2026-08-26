"""
ClaimPilot Setup Diagnostic & Verification Tool
Validates environment configuration, standalone dependencies, UI assets, and .pipe pipeline schemas.
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
    print("✓ Loaded .env configuration file.")
except ImportError:
    print("! python-dotenv module not installed.")


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

def check_dependencies() -> bool:
    print("\n--- Checking Core Standalone Dependencies ---")
    required = ["fastapi", "uvicorn", "pydantic", "dotenv"]
    all_ok = True
    for pkg in required:
        try:
            __import__(pkg)
            print(f"  ✓ Package '{pkg}' installed.")
        except ImportError:
            print(f"  ❌ Package '{pkg}' is missing! Install via: pip install -r requirements.txt")
            all_ok = False

    # Check web dashboard
    static_file = Path("static/index.html")
    if static_file.exists() and static_file.stat().st_size > 1000:
        print("  ✓ Web Command Center GUI (static/index.html) verified.")
    else:
        print("  ❌ static/index.html is missing or empty!")
        all_ok = False

    return all_ok

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

        keys = list(data.keys())
        if keys[0] != "components":
            print(f"❌ {filepath}: 'components' MUST be the first key in JSON object! Found: '{keys[0]}'")
            return False

        project_id = data.get("project_id")
        if not project_id or not GUID_REGEX.match(project_id):
            print(f"❌ {filepath}: 'project_id' must be a valid literal GUID! Found: '{project_id}'")
            return False

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

        print(f"✓ {filepath} passes all schema & rule validations ({len(components)} components, GUID: {project_id}).")
        return True

    except Exception as e:
        print(f"❌ Error parsing {filepath}: {e}")
        return False

def check_env_vars():
    print("\n--- Checking Environment Configuration (Optional) ---")
    uri = os.getenv("CLAIMPILOT_URI")
    openai_key = os.getenv("OPENAI_API_KEY")
    qdrant_host = os.getenv("QDRANT_HOST", "localhost")

    print(f"  CLAIMPILOT_URI        : {uri or 'http://127.0.0.1:8000 (local standalone)'}")
    print(f"  OPENAI_API_KEY        : {'Set (masked)' if openai_key else 'Not set (using built-in deterministic engine)'}")
    print(f"  QDRANT_HOST           : {qdrant_host}")
    print("ℹ️ Note: ClaimPilot runs 100% autonomously in standalone mode.")

def main():
    print("==================================================")
    print("       ClaimPilot Standalone Diagnostic Tool      ")
    print("==================================================")

    dep_ok = check_dependencies()
    check_env_vars()

    print("\n--- Validating 9 Declarative Pipeline Schemas ---")
    pipe_ok = True
    for pipe_file in PIPE_FILES:
        if not verify_pipeline_file(pipe_file):
            pipe_ok = False

    print("\n==================================================")
    if dep_ok and pipe_ok:
        print("🎉 ALL CHECKS PASSED SUCCESSFULLY!")
        print("ClaimPilot is properly configured and ready for Independent Autonomous Execution.")
        print("Launch the Web GUI anytime via: python run_gui.py")
    else:
        print("❌ SOME CHECKS FAILED. Please review the errors above.")
    print("==================================================")

if __name__ == "__main__":
    main()
