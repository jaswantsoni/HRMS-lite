import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { fetchEmployees, fetchAttendance } from '../services/api';
import type { Employee, AttendanceRecord } from '../types';

export function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    loadData();
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const stats = useMemo(() => {
    const todayRecords = attendance.filter((r) => r.date === today);
    const presentToday = todayRecords.filter((r) => r.status === 'present').length;

    return {
      totalEmployees: employees.length,
      totalAttendanceRecords: attendance.length,
      presentToday,
    };
  }, [employees, attendance, today]);

  return (
    <Layout>
      <h2 className="text-2xl font-semibold text-foreground mb-6">Dashboard</h2>

      {error && <p className="mb-4 text-destructive">{error}</p>}

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="border border-border rounded-md bg-card p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="stat-label">Total Employees</span>
              <span className="stat-value">{stats.totalEmployees}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="stat-label">Total Attendance Records</span>
              <span className="stat-value">{stats.totalAttendanceRecords}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="stat-label">Present Today ({today})</span>
              <span className="stat-value">{stats.presentToday}</span>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
