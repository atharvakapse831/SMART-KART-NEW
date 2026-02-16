# PostgreSQL Migration Guide

You have requested to switch from SQLite3 to PostgreSQL. The Django configuration has been updated to use PostgreSQL.

## Prerequisites

1.  **PostgreSQL Installed**: Ensure PostgreSQL server is installed and running on your system.
2.  **Database & User**: You need a database named `shopping_db` and a user `postgres` with password `password`.

## Automated Setup (Recommended)

Run the provided setup script. It will ask for your sudo password to configure PostgreSQL:

```bash
chmod +x setup_postgres_db.sh
./setup_postgres_db.sh
```

## Manual Setup

If the script fails or you prefer manual configuration:

1.  Log in as the postgres user:
    ```bash
    sudo -u postgres psql
    ```

2.  Run the following SQL commands:
    ```sql
    CREATE DATABASE shopping_db;
    ALTER USER postgres WITH PASSWORD 'password';
    \q
    ```

## Applying Migrations

Once the database is created, run the migrations to set up the schema and seed data:

```bash
cd backend
source venv/bin/activate
python manage.py migrate
python seed.py
```

## Running the Server

Start the server as usual:

```bash
python manage.py runserver 3000
```
