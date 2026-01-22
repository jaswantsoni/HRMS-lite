import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { fetchEmployees, createEmployee, deleteEmployee } from '../services/api';
import type { Employee, CreateEmployeePayload } from '../types';

const departments = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'operations', label: 'Operations' },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateEmployeePayload>({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<CreateEmployeePayload>>({});
  const [submitting, setSubmitting] = useState(false);

  const loadEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const validateForm = (): boolean => {
    const errors: Partial<CreateEmployeePayload> = {};

    if (!formData.employee_id.trim()) {
      errors.employee_id = 'Employee ID is required';
    } else if (employees.some((e) => e.employee_id === formData.employee_id.trim())) {
      errors.employee_id = 'Employee ID must be unique';
    }

    if (!formData.full_name.trim()) {
      errors.full_name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Invalid email format';
    }

    if (!formData.department) {
      errors.department = 'Department is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);
    try {
      await createEmployee({
        employee_id: formData.employee_id.trim(),
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        department: formData.department,
      });
      await loadEmployees();
      setIsModalOpen(false);
      setFormData({ employee_id: '', full_name: '', email: '', department: '' });
      setFormErrors({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    setError(null);
    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.employee_id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete employee');
    }
  };

  const columns = [
    { key: 'employee_id', header: 'Employee ID' },
    { key: 'full_name', header: 'Full Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'department',
      header: 'Department',
      render: (emp: Employee) => {
        const dept = departments.find((d) => d.value === emp.department);
        return dept?.label || emp.department;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (emp: Employee) => (
        <Button variant="destructive" onClick={() => handleDelete(emp.employee_id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Employees</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add Employee</Button>
      </div>

      {error && <p className="mb-4 text-destructive">{error}</p>}

      {loading ? (
        <p className="text-muted-foreground">Loading employees...</p>
      ) : (
        <Table
          columns={columns}
          data={employees}
          keyExtractor={(e) => e.employee_id}
          emptyMessage="No employees found. Add one to get started."
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Employee">
        <form onSubmit={handleSubmit}>
          <Input
            label="Employee ID"
            value={formData.employee_id}
            onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
            error={formErrors.employee_id}
            placeholder="e.g., EMP001"
          />
          <Input
            label="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            error={formErrors.full_name}
            placeholder="e.g., John Doe"
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={formErrors.email}
            placeholder="e.g., john@company.com"
          />
          <Select
            label="Department"
            options={departments}
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            error={formErrors.department}
            placeholder="Select department"
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Employee'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
