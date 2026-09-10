# Architecture

## Overview

The system follows a layered full-stack architecture.

```text
React + TypeScript
        |
      REST
        |
Spring Boot Controllers
        |
Services / Business Logic
        |
Spring Data JPA Repositories
        |
      MySQL
```

## Security

- JWT-based authentication
- Spring Security request filtering
- Role-based authorization (`STUDENT`, `ADMIN`)
- Password hashing with BCrypt
- Secrets supplied through environment variables

## Backend layers

- `controller` — HTTP endpoints
- `service` — business rules
- `repository` — persistence access
- `entity` — JPA domain models
- `dto` — API request/response models
- `security` — JWT and authorization
- `exception` — centralized error handling
- `config` — application configuration
