import { defineStore } from 'pinia'
import { format } from 'date-fns'
import { ApiContext, AssignmentStrategy } from '../services/api/strategies'
import type { AssignmentReport } from '../types/Assignment'

interface AssignmentState {
  assignments: Record<string, AssignmentReport>;
  loading: boolean;
  error: string | null;
}

export const useAssignmentStore = defineStore('assignments', {
  state: (): AssignmentState => ({
    assignments: {},
    loading: false,
    error: null
  }),

  getters: {
    getAssignmentsByDate: (state) => (date: Date) => {
      const dateKey = format(date, 'yyyy-MM-dd')
      return state.assignments[dateKey]
    }
  },

  actions: {
    async fetchAssignments(date: Date) {
      this.loading = true
      this.error = null
      
      try {
        const dateStr = format(date, 'yyyy-MM-dd')
        const apiContext = new ApiContext(new AssignmentStrategy())
        const response = await apiContext.executeStrategy(dateStr)
        
        if (response.data && response.data.length > 0) {
          this.assignments[dateStr] = response.data[0]
        }
      } catch (error) {
        console.error('Error fetching assignments:', error)
        this.error = 'Error al cargar las asignaciones'
      } finally {
        this.loading = false
      }
    }
  }
}) 