@echo off
title Portfolio Server
cd /d "%~dp0\backend"
echo ======================================================
echo           Starting Nikhil's Portfolio Backend
echo ======================================================
echo.
echo Opening portfolio in browser at http://localhost:5000 ...
start http://localhost:5000
echo.
echo Starting backend server with Node.js and MySQL...
node server.js
pause
