@echo off
echo Starting Lead Agent...

:: Start Backend
start "Lead Agent Backend" cmd /k "cd backend && python run.py"

:: Start Frontend
start "Lead Agent Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Servers are starting in separate windows.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo You can close this window now.
