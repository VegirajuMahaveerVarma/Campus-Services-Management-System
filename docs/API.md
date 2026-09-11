# REST API

Base URL: `http://localhost:8080/api`

## Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a student |
| POST | `/auth/login` | Public | Login and receive JWT |

Send the returned token as `Authorization: Bearer <token>`.

## Student

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/students/profile` | Student | View own profile |
| PUT | `/students/profile` | Student | Update own profile |
| POST | `/complaints` | Student | Create complaint |
| GET | `/complaints/my` | Student | View own complaints |
| GET | `/events` | Authenticated | View events |
| POST | `/events/{eventId}/registrations` | Authenticated | Register for an event |
| GET | `/notices` | Authenticated | View active notices |
| GET | `/notifications` | Authenticated | View personal notifications |
| GET | `/notifications/unread-count` | Authenticated | Get unread notification count |
| PUT | `/notifications/{id}/read` | Authenticated | Mark one notification as read |
| PUT | `/notifications/read-all` | Authenticated | Mark all notifications as read |

### Event registration fields

Students provide:

- Full name
- Gmail address
- Phone number
- Roll number

The backend prevents duplicate registration for the same event by Gmail address or roll number.

## Admin

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/students` | Admin | List students |
| GET | `/complaints` | Admin | List all complaints |
| PUT | `/complaints/{id}/status` | Admin | Update complaint status |
| GET | `/admin/analytics` | Admin | Get operational dashboard metrics |
| POST | `/admin/events` | Admin | Create event |
| PUT | `/admin/events/{id}` | Admin | Update event |
| DELETE | `/admin/events/{id}` | Admin | Delete event |
| GET | `/events/{eventId}/registrations` | Admin | View event registrations |
| POST | `/admin/notices` | Admin | Publish notice |
| PUT | `/admin/notices/{id}` | Admin | Update notice |
| DELETE | `/admin/notices/{id}` | Admin | Delete notice |

## Notifications

Notifications are generated for relevant campus activity, including new complaints, complaint status changes, and newly published campus content. Each notification belongs to a user and can be independently marked as read.

## Error handling

The backend uses centralized exception handling so API failures return consistent HTTP responses instead of leaking implementation details.

## API documentation

Swagger UI is available at `/swagger-ui.html` when the backend is running.
OpenAPI JSON is available at `/api-docs`.
