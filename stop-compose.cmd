@echo off
REM Stop and remove docker-compose containers (cmd.exe)
cd /d "%~dp0"
docker compose down
