# Campus Services Management System

A full-stack campus services platform for students and administrators to manage student profiles, complaints, events, and notices.

## Features

- Student registration/login
- Admin login with configurable seeded account
- JWT authentication
- Role-based access control (`STUDENT` / `ADMIN`)
- Student profile management
- Complaint/ticket creation and status tracking
- Admin complaint processing
- Event management
- Notice management
- Search/filter in frontend dashboards
- REST API
- MySQL database
- Centralized API error handling
- Swagger/OpenAPI documentation
- JUnit + Mockito unit tests
- Responsive React + TypeScript UI

## Stack

- Java 21
- Spring Boot 3.5
- Spring Security
- Spring Data JPA
- MySQL 8+
- JWT (JJWT)
- React + TypeScript + Vite
- Axios
- OpenAPI / Swagger UI
- JUnit 5 + Mockito
- Git + GitHub

## Run locally

### 1. Database

Create the database and tables:

```bash
mysql -u root -p < database/schema.sql
```

Or let JPA create/update tables after creating the `campus_services` database.

### 2. Backend

Requirements: Java 21 and Maven.

```bash
cd backend
mvn clean test
mvn spring-boot:run
```

Backend: `http://localhost:8080`

Swagger: `http://localhost:8080/swagger-ui.html`

OpenAPI: `http://localhost:8080/api-docs`

### 3. Frontend

Requirements: Node.js 20+.

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

If the API is hosted elsewhere, set `VITE_API_URL`, for example:

```text
VITE_API_URL=http://localhost:8080/api
```

## Admin account for local development

The backend seeds an admin account on first startup. Defaults are:

```text
Email: admin@campus.local
Password: Admin@12345
```

**Change these values for any shared or production environment** using:

```text
APP_ADMIN_EMAIL
APP_ADMIN_PASSWORD
JWT_SECRET
DB_URL
DB_USERNAME
DB_PASSWORD
```

The JWT secret must be at least 32 characters.

## API

See [`docs/API.md`](docs/API.md) for endpoint details and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the architecture.

## Project structure

```text
Campus-Services-Management-System/
├── backend/
│   ├── src/main/java/com/campus/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── exception/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   ├── src/test/
│   └── pom.xml
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── database/schema.sql
└── docs/
```

## Testing

Backend unit tests are included for authentication and complaint business logic:

```bash
cd backend
mvn test
```

## Security notes

- Passwords are stored using BCrypt hashes.
- JWTs are used for stateless API authentication.
- Admin endpoints are protected by Spring Security roles.
- Do not commit production secrets.
- Use HTTPS and secure secret storage in production.
