@echo off
title Sistema Monde

cd /d %~dp0

echo ===============================
echo Iniciando Sistema Monde...
echo ===============================

:: Verifica se node existe
node -v >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    pause
    exit
)

:: Instala dependencias (caso nao tenha)
if not exist node_modules (
    echo Instalando dependencias...
    npm install
)

echo.
echo Iniciando servidor...
start cmd /k node start.js

timeout /t 3 >nul

echo.
echo Iniciando ngrok...
start cmd /k ngrok http 3000

echo.
echo ===============================
echo Sistema iniciado com sucesso!
echo ===============================
echo.
echo.

pause