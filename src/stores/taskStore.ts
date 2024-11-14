import { defineStore } from 'pinia'
import { ApiContext, TaskStrategy } from '../services/api/strategies'
import type { Task, TaskResponse } from '../types/Task'

interface CreateTaskPayload {
  task: {
    title: string;
    due_date: string;
    estimated_hours: number;
    skill_ids: number[];
  };
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedSkills: string[];
}

export const useTaskStore = defineStore('tasks', {
  state: (): TaskState => ({
    tasks: [],
    loading: false,
    error: null,
    selectedSkills: []
  }),

  getters: {
    filteredTasks: (state) => {
      if (state.selectedSkills.length === 0) return state.tasks;
      
      return state.tasks.filter(task => 
        state.selectedSkills.every(skill => 
          task.attributes.skill_names.includes(skill)
        )
      );
    },

    uniqueSkills: (state) => {
      const skillSet = new Set<string>();
      state.tasks.forEach(task => {
        task.attributes.skill_names.forEach(skill => skillSet.add(skill));
      });
      return Array.from(skillSet);
    }
  },

  actions: {
    async fetchTasks() {
      this.loading = true;
      this.error = null;
      
      try {
        const apiContext = new ApiContext(new TaskStrategy());
        const response = await apiContext.executeStrategy();
        this.tasks = response.data;
      } catch (error) {
        console.error('Error fetching tasks:', error);
        this.error = 'Error al cargar las tareas';
      } finally {
        this.loading = false;
      }
    },

    async createTask(payload: CreateTaskPayload) {
      this.loading = true;
      this.error = null;
      
      try {
        const taskStrategy = new TaskStrategy();
        const apiContext = new ApiContext(taskStrategy);
        await apiContext.strategy.create(payload);
        await this.fetchTasks(); // Recargar la lista después de crear
      } catch (error) {
        console.error('Error creating task:', error);
        this.error = 'Error al crear la tarea';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    toggleSkillFilter(skill: string) {
      const index = this.selectedSkills.indexOf(skill);
      if (index === -1) {
        this.selectedSkills.push(skill);
      } else {
        this.selectedSkills.splice(index, 1);
      }
    },

    clearFilters() {
      this.selectedSkills = [];
    }
  }
}); 