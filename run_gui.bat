@echo off
title ClaimVertex AI Command Center GUI
echo Starting ClaimVertex Web GUI...
if exist .venv\Scripts\python.exe (
    .venv\Scripts\python.exe app.py
) else (
    python app.py
)
pause
