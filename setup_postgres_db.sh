#!/bin/bash
set -e

# Setup PostgreSQL Database
echo "Setting up PostgreSQL database..."

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "Error: PostgreSQL is not installed or psql is not in PATH."
    echo "Please install PostgreSQL manually."
    exit 1
fi

# Create database and user if they don't exist
# Note: This might require sudo or entering password depending on system config
# We try to use the transparent 'postgres' user often available in dev environments

DB_NAME="shopping_db"
DB_USER="postgres"
DB_PASS="password"

echo "Creating database '$DB_NAME'..."
# Try to create database. Ignore error if it exists.
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" || echo "Database might already exist."

echo "Setting password for user '$DB_USER'..."
# In many local setups, postgres user exists. We just set the password to ensure our config works.
# WARNING: This changes the password for the 'postgres' superuser. In a real prod env, create a dedicated user.
sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASS';" || echo "Could not set password, you might need to configure settings.py manually."

echo "PostgreSQL setup attempted."
