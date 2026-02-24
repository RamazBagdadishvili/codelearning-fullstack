@echo off
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"

echo =======================================================
echo          CodeLearning Servers
echo          Backend and Frontend starting together...
echo =======================================================
echo.

:: Run both in the exact same window using concurrently
call npx concurrently -n "BACKEND,FRONTEND" -c "cyan,green" "cd backend && node src/index.js" "cd frontend && npm run dev"

pause
