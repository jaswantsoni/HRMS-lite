export interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  status: 'present' | 'absent';
}

export interface CreateEmployeePayload {
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}

export interface MarkAttendancePayload {
  employee_id: string;
  date: string;
  status: 'present' | 'absent';
}

export interface ApiError {
  message: string;
}
