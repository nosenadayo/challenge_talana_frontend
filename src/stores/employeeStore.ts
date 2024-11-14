import { defineStore } from 'pinia';
import { ApiContext, EmployeeStrategy } from '../services/api/strategies';
import type { Employee, EmployeeDetail } from '../types/Employee';

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: EmployeeDetail | null;
  loading: boolean;
  error: string | null;
}

export const useEmployeeStore = defineStore('employees', {
  state: (): EmployeeState => ({
    employees: [],
    selectedEmployee: null,
    loading: false,
    error: null
  }),

  getters: {
    sortedEmployees: (state) => {
      return [...state.employees].sort((a, b) => 
        a.attributes.name.localeCompare(b.attributes.name)
      )
    }
  },

  actions: {
    async fetchEmployees() {
      this.loading = true;
      this.error = null;
      
      try {
        const apiContext = new ApiContext(new EmployeeStrategy());
        const response = await apiContext.executeStrategy();
        this.employees = response.data;
      } catch (error) {
        console.error('Error fetching employees:', error);
        this.error = 'Error al cargar los empleados';
      } finally {
        this.loading = false;
      }
    },

    async getEmployeeById(id: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const employeeStrategy = new EmployeeStrategy();
        const response = await employeeStrategy.getById(id);
        this.selectedEmployee = response;
        return response;
      } catch (error) {
        console.error('Error fetching employee details:', error);
        this.error = 'Error al cargar los detalles del empleado';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
}); 