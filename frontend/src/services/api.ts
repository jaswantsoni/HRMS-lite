import axios from 'axios';
import type {
  Employee,
  AttendanceRecord,
  CreateEmployeePayload,
  MarkAttendancePayload,
} from '../types';

// 🔴 CHANGE THIS TO YOUR DEPLOYED BACKEND URL LATER
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8888';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------------- EMPLOYEE APIs ----------------

export async function fetchEmployees(): Promise<Employee[]> {
  const res = await api.get('/employees/');
  return res.data;
}

export async function createEmployee(
  payload: CreateEmployeePayload
): Promise<Employee> {
  try {
    await api.post('/employees/', payload);
    const employees = await fetchEmployees();
    const newEmployee = employees.find(e => e.employee_id === payload.employee_id);
    if (!newEmployee) throw new Error('Employee created but not found');
    return newEmployee;
  } catch (err: any) {
    throw new Error(err.response?.data?.detail || 'Failed to create employee');
  }
}

export async function deleteEmployee(employeeId: string): Promise<void> {
  try {
    await api.delete(`/employees/${employeeId}`);
  } catch (err: any) {
    throw new Error(err.response?.data?.detail || 'Failed to delete employee');
  }
}

// ---------------- ATTENDANCE APIs ----------------

export async function fetchAttendance(
  employeeId?: string,
  date?: string
): Promise<AttendanceRecord[]> {
  const params: Record<string, string> = {};
  if (employeeId) params.employee_id = employeeId;
  if (date) params.date = date;

  const res = await api.get('/attendance/', { params });
  return res.data;
}

export async function markAttendance(
  payload: MarkAttendancePayload
): Promise<void> {
  try {
    await api.post('/attendance/', payload);
  } catch (err: any) {
    throw new Error(err.response?.data?.detail || 'Failed to mark attendance');
  }
}
