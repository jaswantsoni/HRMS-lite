import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { fetchEmployees, fetchAttendance, markAttendance } from '../services/api';
import type { Employee, AttendanceRecord, MarkAttendancePayload } from '../types';

const statusOptions = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
];

export function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterEmployeeId, setFilterEmployeeId] = useState('');

  const [formData, setFormData] = useState<Omit<MarkAttendancePayload, 'employee_id'>>({
    date: new Date().toISOString().split('T')[0],
    status: 'present',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [employeesData, attendanceData] = await Promise.all([
        fetchEmployees(),
        fetchAttendance(),
      ]);
      setEmployees(employeesData);
      setAttendance(attendanceData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAttendance = useMemo(() => {
    return attendance
      .filter((record) => {
        const matchesDate = !filterDate || record.date === filterDate;
        const matchesEmployee = !filterEmployeeId || record.employee_id === filterEmployeeId;
        return matchesDate && matchesEmployee;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [attendance, filterDate, filterEmployeeId]);

  const presentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    attendance.forEach((record) => {
      if (record.status === 'present') {
        counts[record.employee_id] = (counts[record.employee_id] || 0) + 1;
      }
    });
    return counts;
  }, [attendance]);

  const openMarkAttendance = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      status: 'present',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    setSubmitting(true);
    setError(null);
    try {
      await markAttendance({
        employee_id: selectedEmployee.employee_id,
        date: formData.date,
        status: formData.status as 'present' | 'absent',
      });
      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const employeeOptions = [
    { value: '', label: 'All Employees' },
    ...employees.map((e) => ({ value: e.employee_id, label: `${e.full_name} (${e.employee_id})` })),
  ];

  const employeeColumns = [
    { key: 'employee_id', header: 'Employee ID' },
    { key: 'full_name', header: 'Full Name' },
    {
      key: 'presentDays',
      header: 'Present Days',
      render: (emp: Employee) => presentCounts[emp.employee_id] || 0,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (emp: Employee) => (
        <Button onClick={() => openMarkAttendance(emp)}>Mark Attendance</Button>
      ),
    },
  ];

  const attendanceColumns = [
    {
      key: 'employee_id',
      header: 'Employee',
      render: (record: AttendanceRecord) => {
        const emp = employees.find((e) => e.employee_id === record.employee_id);
        return emp ? `${emp.full_name} (${record.employee_id})` : record.employee_id;
      },
    },
    { key: 'date', header: 'Date' },
    {
      key: 'status',
      header: 'Status',
      render: (record: AttendanceRecord) => (
        <span className={record.status === 'present' ? 'status-present' : 'status-absent'}>
          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Attendance Management</h2>

        {error && <p className="mb-4 text-destructive">{error}</p>}

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-lg font-medium text-foreground mb-4">Employees</h3>
              <Table
                columns={employeeColumns}
                data={employees}
                keyExtractor={(e) => e.employee_id}
                emptyMessage="No employees found."
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Attendance Records</h3>
              
              <div className="flex gap-4 mb-4">
                <div className="w-48">
                  <Input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    placeholder="Filter by date"
                  />
                </div>
                <div className="w-64">
                  <Select
                    options={employeeOptions}
                    value={filterEmployeeId}
                    onChange={(e) => setFilterEmployeeId(e.target.value)}
                  />
                </div>
                {(filterDate || filterEmployeeId) && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setFilterDate('');
                      setFilterEmployeeId('');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>

              <Table
                columns={attendanceColumns}
                data={filteredAttendance}
                keyExtractor={(r) => r.id}
                emptyMessage="No attendance records found."
              />
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Mark Attendance - ${selectedEmployee?.full_name || ''}`}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <Select
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'present' | 'absent' })}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
