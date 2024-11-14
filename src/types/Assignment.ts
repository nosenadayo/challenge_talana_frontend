interface TaskAssignment {
  id: number;
  title: string;
  estimated_hours: string;
  priority_score: string;
  required_skills: string[];
  due_date?: string;
}

interface EmployeeSummary {
  id: number;
  name: string;
  assignments: TaskAssignment[];
  total_hours: string;
  available_hours: string;
  skills: string[];
}

interface SummaryStats {
  total_assignments: number;
  total_hours_assigned: string;
  total_employees_assigned: number;
  average_hours_per_employee: string;
}

interface AssignmentReport {
  id: string;
  type: string;
  attributes: {
    assigned_date: string;
    employees_summary: EmployeeSummary[];
    unassigned_tasks: TaskAssignment[];
    summary_stats: SummaryStats;
  };
} 