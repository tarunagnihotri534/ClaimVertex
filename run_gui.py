"""
ClaimVertex GUI Launcher Script
Starts the FastAPI backend web server and launches the Web GUI in your browser.
"""

import os
import sys
import subprocess
from pathlib import Path

# Ensure UTF-8 encoding output on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def get_python_interpreter():
    """Detect virtualenv python if available, else use system python."""
    base_dir = Path(__file__).parent
    venv_python_win = base_dir / ".venv" / "Scripts" / "python.exe"
    venv_python_unix = base_dir / ".venv" / "bin" / "python"

    if venv_python_win.exists():
        return str(venv_python_win)
    elif venv_python_unix.exists():
        return str(venv_python_unix)
    return sys.executable

def main():
    print("==========================================================")
    print(" ClaimVertex -- AI Insurance Claims Command Center GUI")
    print("==========================================================")
    print("Initialising Web Dashboard server at http://127.0.0.1:8000...")
    print("Your web browser will open automatically in a moment.")
    print("Press Ctrl+C in this terminal to stop the server anytime.\n")

    python_bin = get_python_interpreter()
    app_path = os.path.join(os.path.dirname(__file__), "app.py")

    try:
        subprocess.run([python_bin, app_path], check=True)
    except KeyboardInterrupt:
        print("\nClaimVertex Web GUI closed gracefully.")

if __name__ == "__main__":
    main()
