@echo off
echo Building KPI Card Advanced Extension...

REM Create build directory
if not exist build mkdir build

REM Define the zip file name
set ZIP_NAME=kpi-card-advanced.zip

REM Remove old zip if exists
if exist %ZIP_NAME% del %ZIP_NAME%

REM Create zip using PowerShell
powershell -Command "Compress-Archive -Path 'kpi-card-advanced.qext', 'kpi-card-advanced.js', 'kpi-card-advanced.css', 'src', 'docs', 'README.md' -DestinationPath '%ZIP_NAME%' -Force"

echo Build complete! Extension packaged as %ZIP_NAME%
pause