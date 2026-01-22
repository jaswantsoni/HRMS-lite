
# HRMS Lite - Complete Frontend Integration Guide

Base URL: `http://localhost:8000`

---

## 🏥 HEALTH CHECK

### Check API Status
```bash
curl -X GET "http://localhost:8000/health/"
```

---

## 👥 EMPLOYEE MANAGEMENT

### 1. Add Employee
```bash
curl -X POST "http://localhost:8000/employees/" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "email": "john@example.com",
    "department": "Engineering"
  }'
```

### 2. List All Employees
```bash
curl -X GET "http://localhost:8000/employees/"
```

### 3. List Employees with Pagination
```bash
# Page 1, 10 per page
curl -X GET "http://localhost:8000/employees/?page=1&limit=10"

# Page 2, 10 per page
curl -X GET "http://localhost:8000/employees/?page=2&limit=10"

# Page 1, 20 per page
curl -X GET "http://localhost:8000/employees/?page=1&limit=20"
```

### 4. Search Employees by Name
```bash
curl -X GET "http://localhost:8000/employees/search?full_name=john"
```

### 5. Search Employees by Employee ID
```bash
curl -X GET "http://localhost:8000/employees/search?employee_id=EMP001"
```

### 6. Search Employees by Email
```bash
curl -X GET "http://localhost:8000/employees/search?email=john@example.com"
```

### 7. Get Single Employee by ID
```bash
curl -X GET "http://localhost:8000/employees/EMP001"
```

### 8. Delete Employee
```bash
curl -X DELETE "http://localhost:8000/employees/EMP001"
```

---

## 📅 ATTENDANCE MANAGEMENT

### 1. Mark Attendance (Present)
```bash
curl -X POST "http://localhost:8000/attendance/" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "date": "2024-01-15",
    "status": "present"
  }'
```

### 2. Mark Attendance (Absent)
```bash
curl -X POST "http://localhost:8000/attendance/" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP002",
    "date": "2024-01-15",
    "status": "absent"
  }'
```

### 3. List All Attendance
```bash
curl -X GET "http://localhost:8000/attendance/"
```

### 4. List Attendance by Employee
```bash
curl -X GET "http://localhost:8000/attendance/?employee_id=EMP001"
```

### 5. List Attendance by Date
```bash
curl -X GET "http://localhost:8000/attendance/?date=2024-01-15"
```

### 6. List Attendance by Employee and Date
```bash
curl -X GET "http://localhost:8000/attendance/?employee_id=EMP001&date=2024-01-15"
```

### 7. Get Attendance Summary for Date
```bash
curl -X GET "http://localhost:8000/attendance/summary/2024-01-15"
```

---

## 📊 FRONTEND INTEGRATION EXAMPLES

### JavaScript Fetch Examples

#### Add Employee
```javascript
fetch('http://localhost:8000/employees/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    employee_id: 'EMP001',
    full_name: 'John Doe',
    email: 'john@example.com',
    department: 'Engineering'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

#### List Employees with Pagination
```javascript
fetch('http://localhost:8000/employees/?page=1&limit=10')
  .then(res => res.json())
  .then(data => console.log(data));
```

#### Search Employees
```javascript
fetch('http://localhost:8000/employees/search?full_name=john')
  .then(res => res.json())
  .then(data => console.log(data));
```

#### Mark Attendance
```javascript
fetch('http://localhost:8000/attendance/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    employee_id: 'EMP001',
    date: '2024-01-15',
    status: 'present'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

#### Get Attendance Summary
```javascript
fetch('http://localhost:8000/attendance/summary/2024-01-15')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 🧪 COMPLETE TEST FLOW

```bash
# 1. Health check
curl -X GET "http://localhost:8000/health/"

# 2. Add employees
curl -X POST "http://localhost:8000/employees/" \
  -H "Content-Type: application/json" \
  -d '{"employee_id":"EMP001","full_name":"John Doe","email":"john@example.com","department":"Engineering"}'

curl -X POST "http://localhost:8000/employees/" \
  -H "Content-Type: application/json" \
  -d '{"employee_id":"EMP002","full_name":"Jane Smith","email":"jane@example.com","department":"HR"}'

curl -X POST "http://localhost:8000/employees/" \
  -H "Content-Type: application/json" \
  -d '{"employee_id":"EMP003","full_name":"Bob Johnson","email":"bob@example.com","department":"Engineering"}'

# 3. List all employees
curl -X GET "http://localhost:8000/employees/"

# 4. Search by name
curl -X GET "http://localhost:8000/employees/search?full_name=john"

# 5. Get specific employee
curl -X GET "http://localhost:8000/employees/EMP001"

# 6. Mark attendance
curl -X POST "http://localhost:8000/attendance/" \
  -H "Content-Type: application/json" \
  -d '{"employee_id":"EMP001","date":"2024-01-15","status":"present"}'

curl -X POST "http://localhost:8000/attendance/" \
  -H "Content-Type: application/json" \
  -d '{"employee_id":"EMP002","date":"2024-01-15","status":"present"}'

curl -X POST "http://localhost:8000/attendance/" \
  -H "Content-Type: application/json" \
  -d '{"employee_id":"EMP003","date":"2024-01-15","status":"absent"}'

# 7. Get attendance summary
curl -X GET "http://localhost:8000/attendance/summary/2024-01-15"

# 8. List attendance for specific employee
curl -X GET "http://localhost:8000/attendance/?employee_id=EMP001"

# 9. List with pagination
curl -X GET "http://localhost:8000/employees/?page=1&limit=2"
```

---

## 📝 RESPONSE FORMATS

### Employee Response
```json
{
  "id": "507f1f77bcf86cd799439011",
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "Engineering"
}
```

### Paginated Employee Response
```json
{
  "total": 50,
  "page": 1,
  "limit": 10,
  "employees": [...]
}
```

### Attendance Response
```json
{
  "id": "507f1f77bcf86cd799439012",
  "employee_id": "EMP001",
  "date": "2024-01-15",
  "status": "present"
}
```

### Attendance Summary Response
```json
{
  "date": "2024-01-15",
  "total_present": 45,
  "total_absent": 5
}
```

### Health Check Response
```json
{
  "status": "healthy",
  "api": "running",
  "database": "connected"
}
```

---

## ⚠️ ERROR RESPONSES

### 400 - Bad Request
```json
{
  "detail": "Employee already exists"
}
```

### 404 - Not Found
```json
{
  "detail": "Employee not found"
}
```

### 503 - Service Unavailable
```json
{
  "detail": "Database connection failed: ..."
}
```
