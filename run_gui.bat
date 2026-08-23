@echo off
title ClaimPilot AI Command Center GUI
echo Starting ClaimPilot Web GUI...
if exist .venv\Scripts\python.exe (
    .venv\Scripts\python.exe app.py
) else (
    python app.py
)
pause
