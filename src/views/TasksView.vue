<template>
  <div class="tasks-page">
    <!-- Header -->
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <h1 class="title">Tareas Pendientes</h1>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <div class="buttons">
            <button 
              class="button is-primary"
              @click="isFormOpen = true"
            >
              <span class="icon">
                <i class="fas fa-plus"></i>
              </span>
              <span>Nueva Tarea</span>
            </button>
            <button 
              class="button is-light"
              :class="{ 'is-loading': taskStore.loading }"
              @click="taskStore.fetchTasks()"
            >
              <span class="icon">
                <i class="fas fa-sync"></i>
              </span>
              <span>Actualizar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="box">
      <div class="field">
        <label class="label">Filtrar por habilidades</label>
        <div class="buttons are-small">
          <button 
            v-for="skill in taskStore.uniqueSkills"
            :key="skill"
            class="button"
            :class="{ 'is-primary': taskStore.selectedSkills.includes(skill) }"
            @click="taskStore.toggleSkillFilter(skill)"
          >
            {{ skill }}
          </button>
          <button 
            v-if="taskStore.selectedSkills.length > 0"
            class="button is-light"
            @click="taskStore.clearFilters()"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de tareas -->
    <div class="columns is-multiline">
      <div 
        v-for="task in taskStore.filteredTasks"
        :key="task.id"
        class="column is-one-third"
      >
        <div class="card">
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4">{{ task.attributes.title }}</p>
                <p class="subtitle is-6">
                  Fecha límite: {{ formatDate(task.attributes.due_date) }}
                </p>
              </div>
              <div class="media-right">
                <span class="tag is-primary is-medium">
                  {{ task.attributes.estimated_hours }}h
                </span>
              </div>
            </div>

            <div class="content">
              <div class="level is-mobile">
                <div class="level-left">
                  <div class="level-item">
                    <span class="tag" :class="getStatusClass(task.attributes.status)">
                      {{ task.attributes.status }}
                    </span>
                  </div>
                </div>
                <div class="level-right">
                  <div class="level-item">
                    <span class="tag is-info">
                      Score: {{ task.attributes.priority_score }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="tags are-small">
                <span 
                  v-for="skill in task.attributes.skill_names"
                  :key="skill"
                  class="tag is-light"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal deslizante -->
    <TaskFormSlider 
      :is-open="isFormOpen"
      @close="isFormOpen = false"
      @task-created="handleTaskCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import TaskFormSlider from '../components/Tasks/TaskFormSlider.vue'
import { useTaskStore } from '../stores/taskStore'

const taskStore = useTaskStore()
const isFormOpen = ref(false)

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMM yyyy', { locale: es })
}

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'is-warning'
    case 'completed':
      return 'is-success'
    case 'in_progress':
      return 'is-info'
    default:
      return 'is-light'
  }
}

const handleTaskCreated = () => {
  isFormOpen.value = false
  taskStore.fetchTasks()
}

// Limpiar al desmontar el componente
onUnmounted(() => {
  document.body.classList.remove('modal-open')
})

onMounted(async () => {
  await taskStore.fetchTasks()
})
</script>

<style lang="scss" scoped>
@import '../assets/styles/_variables.scss';

.tasks-page {
  padding: 1.5rem;
}

.card {
  transition: transform 0.2s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba($purple, 0.1);
  }
}

.tags {
  margin-top: 1rem;
}
</style> 