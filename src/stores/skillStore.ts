import { defineStore } from 'pinia'
import { ApiContext, SkillStrategy } from '../services/api/strategies'

interface Skill {
  id: number
  name: string
}

export const useSkillStore = defineStore('skill', {
  state: () => ({
    skills: [] as Skill[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchSkills() {
      this.loading = true
      this.error = null
      try {
        const apiContext = new ApiContext(new SkillStrategy())
        const response = await apiContext.executeStrategy()
        console.log('API Response:', response)
        this.skills = response
      } catch (error) {
        console.error('Error fetching skills:', error)
        this.error = 'Error al cargar las habilidades'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 