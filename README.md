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

## Backend

### Prerequisites

- Java 21
- Maven

### Running Backend

```bash
cd backend
./mvnw spring-boot:run
```

Or build and run:

```bash
cd backend
./mvnw clean package
java -jar target/splitwise-backend-0.0.1-SNAPSHOT.jar
```

The backend runs on `http://localhost:8080`

### API Endpoints

#### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user | Yes |

#### Register Request

```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login Request

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Auth Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

Use the token in subsequent requests:
```
Authorization: Bearer <token>
```

## Frontend

### Prerequisites

- Node.js 18+
- npm

### Running Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`

### Build for Production

```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/`

## Quick Start

1. Start the database:
```bash
cd infra && docker compose up -d
```

2. Start the backend (new terminal):
```bash
cd backend && ./mvnw spring-boot:run
```

3. Start the frontend (new terminal):
```bash
cd frontend && npm run dev
```

4. Open `http://localhost:5173` in your browser
