#!/bin/bash
set -e
cd backend
# Activate venv if exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Ensure migrations are cleared if switching databases drastically, or just migrate
# If we were doing a full reset:
# rm -rf api/migrations/*
# touch api/migrations/__init__.py
# But simpler to just run makemigrations again for now if needed, or rely on existing.

python3 manage.py makemigrations api
python3 manage.py migrate
python3 seed.py
