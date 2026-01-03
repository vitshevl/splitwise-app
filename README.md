# Splitwise

A Strava companion app that automatically imports running workouts and turns them into deep, data-driven insights.

## Features

- Smart split analysis
- Detailed performance charts
- Contextual factors tracking (heart rate, temperature, elevation, body weight)
- Personal training and weight-cut journal

## Project Structure

```
├── infra/      # Infrastructure (Docker, DB)
├── backend/    # Java backend application
└── frontend/   # React frontend application
```

## Infrastructure

### Prerequisites

- Docker & Docker Compose

### Database

PostgreSQL with 3 schemas:
- `users` - User accounts and profiles
- `strava_data` - Imported Strava activities and metrics
- `daily_activities_log` - Training journal entries

### Running Infrastructure

```bash
cd infra
docker compose up -d
```

### Stopping Infrastructure

```bash
cd infra
docker compose down
```

### Database Connection

| Property | Value |
|----------|-------|
| Host | localhost |
| Port | 5432 |
| Database | splitwise |
| User | splitwise |
| Password | splitwise |

### Reset Database

To completely reset the database (removes all data):

```bash
cd infra
docker compose down -v
docker compose up -d
```
