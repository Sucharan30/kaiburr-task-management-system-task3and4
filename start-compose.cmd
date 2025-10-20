@echo off
REM Build and start docker-compose in detached mode (cmd.exe)
cd /d "%~dp0"
if exist .env (echo Using .env) else (echo WARNING: .env not found. Create from .env.example)
docker compose build
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%
docker compose up -d
