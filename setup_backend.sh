#!/bin/bash
set -e

# setup backend directory
# mkdir -p backend # done already

cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate

pip install django djangorestframework django-cors-headers

if [ ! -f "manage.py" ]; then
    django-admin startproject mysite .
fi

python3 manage.py startapp api
