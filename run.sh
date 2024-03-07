#! /bin/bash

docker compose up -d --build

# Linux OS
# firefox --new-window --full-screen http://localhost:8000

# Windows OS / WSL2
powershell.exe /c start http://localhost:8000
