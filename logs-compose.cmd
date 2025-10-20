@echo off
REM Follow docker-compose logs (cmd.exe)
cd /d "%~dp0"
docker compose logs -f
