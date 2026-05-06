@echo off
set "ROOT=%~dp0"

echo Stopping old StreamNest servers if they are still running...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001" ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>nul

echo Starting StreamNest Backend...
start "StreamNest Backend" cmd /k "cd /d ""%ROOT%backend"" && .\venv\Scripts\python.exe manage.py runserver"

echo Starting StreamNest Frontend...
start "StreamNest Frontend" cmd /k "cd /d ""%ROOT%frontend"" && npm run dev -- -p 3001"

echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3001
echo Both servers are starting in new windows!
