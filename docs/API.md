# REST API

Base URL: `http://localhost:8080/api`

## Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a student |
| POST | `/auth/login` | Public | Login and receive JWT |

Send the returned token as `Authorization: Bearer <token>`.

## Student

| Method | Endpoint | Access |
|---|---|---|
| GET | `/students/profile` | Student | View own profile |
| PUT | `/students/profile` | Student | Update own profile |
| POST | `/complaints` | Student | Create complaint |
| GET | `/complaints/my` | Student | View own complaints |
| GET | `/events` | Authenticated | View events |
| GET | `/notices` | Authenticated | View active notices |

## Admin

| Method | Endpoint | Access |
|---|---|---|
| GET | `/students` | Admin | List students |
| GET | `/complaints` | Admin | List all complaints |
| PUT | `/complaints/{id}/status` | Admin | Update complaint status |
| POST | `/admin/events` | Admin | Create event |
| PUT | `/admin/events/{id}` | Admin | Update event |
| DELETE | `/admin/events/{id}` | Admin | Delete event |
| POST | `/admin/notices` | Admin | Publish notice |
| PUT | `/admin/notices/{id}` | Admin | Update notice |
| DELETE | `/admin/notices/{id}` | Admin | Delete notice |

Swagger UI is available at `/swagger-ui.html` when the backend is running.
OpenAPI JSON is available at `/api-docs`.
