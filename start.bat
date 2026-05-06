@echo off
echo Starting StreamNest Backend...
start cmd /k "cd backend && .\venv\Scripts\python.exe manage.py runserver"

echo Starting StreamNest Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting in new windows!
