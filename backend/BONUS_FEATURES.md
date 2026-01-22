# HRMS Lite - Bonus Features API Documentation

## Overview
This document covers the newly added bonus features to the HRMS Lite backend.

---

## 1. Employee Search API

### Endpoint
```
GET /employees/search
```

### Description
Search employees by employee_id, full_name (partial, case-insensitive), or email.

### Query Parameters
- `employee_id` (optional): Exact employee ID
- `full_name` (optional): Partial name match (case-insensitive)
- `email` (optional): Exact email match

### Examples

**Search by employee_id:**
```bash
curl -X GET "http://localhost:8000/employees/search?employee_id=EMP001"
```

**Search by full_name (partial match):**
```bash
curl -X GET "http://localhost:8000/employees/search?full_name=john"
```

**Search by email:**
```bash
curl -X GET "http://localhost:8000/employees/search?email=john@example.com"
```

**Combined search:**
```bash
curl -X GET "http://localhost:8000/employees/search?full_name=john&department=Engineering"
```

### Response
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "email": "john@example.com",
    "department": "Engineering"
  }
]
```

---

## 2. Employee Lookup by employee_id

### Endpoint
```
GET /employees/{employee_id}
```

### Description
Fetch a single employee using employee_id (not MongoDB _id).

### Path Parameters
- `employee_id` (required): The employee's unique ID

### Example
```bash
curl -X GET "http://localhost:8000/employees/EMP001"
```

### Response
```json
{
  "id": "507f1f77bcf86cd799439011",
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "Engineering"
}
```

### Error Response (404)
```json
{
  "detail": "Employee not found"
}
```

---

## 3. Attendance Summary API

### Endpoint
```
GET /attendance/summary/{date}
```

### Description
Get total present and absent count for a specific date.

### Path Parameters
- `date` (required): Date in YYYY-MM-DD format

### Example
```bash
curl -X GET "http://localhost:8000/attendance/summary/2024-01-15"
```

### Response
```json
{
  "date": "2024-01-15",
  "total_present": 45,
  "total_absent": 5
}
```

---

## 4. Pagination for Employee Listing

### Endpoint
```
GET /employees/
```

### Description
List employees with optional pagination support.

### Query Parameters
- `page` (optional): Page number (starts from 1)
- `limit` (optional): Number of records per page

**Note:** If pagination params are not provided, all employees are returned (default behavior).

### Examples

**Without pagination (default):**
```bash
curl -X GET "http://localhost:8000/employees/"
```

**With pagination:**
```bash
curl -X GET "http://localhost:8000/employees/?page=1&limit=10"
```

```bash
curl -X GET "http://localhost:8000/employees/?page=2&limit=10"
```

### Response (with pagination)
```json
{
  "total": 50,
  "page": 1,
  "limit": 10,
  "employees": [
    {
      "id": "507f1f77bcf86cd799439011",
      "employee_id": "EMP001",
      "full_name": "John Doe",
      "email": "john@example.com",
      "department": "Engineering"
    }
  ]
}
```

### Response (without pagination)
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "email": "john@example.com",
    "department": "Engineering"
  }
]
```

---

## 5. Health Check Endpoint

### Endpoint
```
GET /health/
```

### Description
Verify that the API is running and MongoDB connection is alive.

### Example
```bash
curl -X GET "http://localhost:8000/health/"
```

### Response (Healthy)
```json
{
  "status": "healthy",
  "api": "running",
  "database": "connected"
}
```

### Response (Unhealthy - 503)
```json
{
  "detail": "Database connection failed: [error message]"
}
```

---

## Enhanced Attendance Listing

### Endpoint
```
GET /attendance/
```

### Description
List attendance records with optional filters for both employee_id AND date.

### Query Parameters
- `employee_id` (optional): Filter by employee ID
- `date` (optional): Filter by date (YYYY-MM-DD)

### Examples

**All attendance records:**
```bash
curl -X GET "http://localhost:8000/attendance/"
```

**Filter by employee_id:**
```bash
curl -X GET "http://localhost:8000/attendance/?employee_id=EMP001"
```

**Filter by date:**
```bash
curl -X GET "http://localhost:8000/attendance/?date=2024-01-15"
```

**Filter by both:**
```bash
curl -X GET "http://localhost:8000/attendance/?employee_id=EMP001&date=2024-01-15"
```

---

## Testing All Features

### Complete Test Flow

1. **Check health:**
```bash
curl -X GET "http://localhost:8000/health/"
```

2. **Add employees:**
```bash
curl -X POST "http://localhost:8000/employees/" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "email": "john@example.com",
    "department": "Engineering"
  }'

curl -X POST "http://localhost:8000/employees/" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP002",
    "full_name": "Jane Smith",
    "email": "jane@example.com",
    "department": "HR"
  }'
```

3. **Search employees:**
```bash
curl -X GET "http://localhost:8000/employees/search?full_name=john"
```

4. **Get specific employee:**
```bash
curl -X GET "http://localhost:8000/employees/EMP001"
```

5. **List with pagination:**
```bash
curl -X GET "http://localhost:8000/employees/?page=1&limit=5"
```

6. **Mark attendance:**
```bash
curl -X POST "http://localhost:8000/attendance/" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "date": "2024-01-15",
    "status": "present"
  }'

curl -X POST "http://localhost:8000/attendance/" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP002",
    "date": "2024-01-15",
    "status": "absent"
  }'
```

7. **Get attendance summary:**
```bash
curl -X GET "http://localhost:8000/attendance/summary/2024-01-15"
```

---

## Swagger Documentation

All endpoints are automatically documented in Swagger UI:
```
http://localhost:8000/docs
```

All schemas and request/response models are visible in the OpenAPI specification.

---

## Notes

- All bonus features are backward compatible
- Existing endpoints maintain their original behavior
- No authentication required (as per requirements)
- All endpoints return proper HTTP status codes
- Error messages are meaningful and actionable
