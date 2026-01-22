# HRMS Lite Frontend

This is the **frontend** of the HRMS Lite application. It is built with **React.js + TypeScript** and connects to a **FastAPI backend**.

---

## 🛠 Tech Stack

- **React.js** with TypeScript  
- **Axios** for API requests  
- **Tailwind CSS** for styling  
- **Vite** for project scaffolding  

---

## ⚡ Features

- **Employee Management**  
  - Add new employees  
  - View employee list  
  - Delete employees  

- **Attendance Management**  
  - Mark attendance (Present / Absent)  
  - View attendance records  
  - Filter by employee or date  

- **Professional UI**  
  - Clean layout with modals for forms  
  - Loading, empty, and error states  

---

## 🚀 How to Run Locally

1. Clone the repository:
   ```bash
   git clone <frontend-repo-url>
   cd hr-admin-core
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure backend URL:
   - Update `.env` file with your backend URL:
     ```
     VITE_BACKEND_URL=http://localhost:8888
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📡 API Configuration

The frontend connects to the HRMS Lite API with the following endpoints:

### Employee Endpoints
- `GET /employees/` - List all employees
- `POST /employees/` - Add new employee
- `DELETE /employees/{employee_id}` - Delete employee

### Attendance Endpoints
- `GET /attendance/` - List attendance records
- `POST /attendance/` - Mark attendance
- `GET /attendance/?employee_id={id}` - Filter by employee
- `GET /attendance/?date={date}` - Filter by date

---

## 🏗 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components (Dashboard, Employees, Attendance)
├── services/       # API service layer
├── types/          # TypeScript type definitions
└── App.tsx         # Main app component
```# HRMS-liteFR
# HRMS-liteFR
