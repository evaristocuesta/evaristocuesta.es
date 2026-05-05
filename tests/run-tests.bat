@echo off
echo ========================================
echo   Instalando dependencias de npm...
echo ========================================
cd ../src/evaristocuesta.es
call npm install

echo.
echo ========================================
echo   Ejecutando tests unitarios...
echo ========================================
call npm test

echo.
echo ========================================
echo   Tests completados!
echo ========================================
pause
