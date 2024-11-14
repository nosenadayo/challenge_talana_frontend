<template>
  <Teleport to="body">
    <transition name="slide">
      <div v-if="isOpen" class="modal-wrapper">
        <div class="modal-backdrop" @click="close"></div>
        
        <div class="slider-panel">
          <header class="slider-header">
            <p class="title is-4">Asignaciones para {{ formattedDate }}</p>
            <button class="delete" aria-label="close" @click="close"></button>
          </header>

          <div class="slider-body">
            <!-- Botón para agregar tarea -->
            <div class="box">
              <button 
                class="button is-purple is-light is-fullwidth"
                @click="openTaskForm"
              >
                <span class="icon">
                  <i class="fas fa-plus"></i>
                </span>
                <span>Agregar Nueva Tarea</span>
              </button>
            </div>

            <!-- Resumen de asignaciones -->
            <div v-if="report" class="box">
              <h3 class="title is-5">Resumen</h3>
              <div class="columns is-multiline">
                <div class="column is-half">
                  <p class="has-text-purple-dark">
                    Total asignaciones: {{ report.attributes.summary_stats.total_assignments }}
                  </p>
                </div>
                <div class="column is-half">
                  <p class="has-text-purple-dark">
                    Horas asignadas: {{ report.attributes.summary_stats.total_hours_assigned }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Lista de empleados -->
            <div v-if="report" 
                 v-for="employee in report.attributes.employees_summary" 
                 :key="employee.id"
                 class="box">
              <h4 class="title is-6">{{ employee.name }}</h4>
              <p class="subtitle is-7 has-text-purple-dark">
                {{ employee.total_hours }}/{{ employee.available_hours }} horas
              </p>
              
              <div class="assignments-list">
                <div v-for="task in employee.assignments" 
                     :key="task.id"
                     class="assignment-item">
                  <p class="task-title has-text-purple-dark">{{ task.title }}</p>
                  <p class="task-hours has-text-purple">{{ task.estimated_hours }}h</p>
                  <div class="tags are-small">
                    <span v-for="skill in task.required_skills" 
                          :key="skill"
                          class="tag is-purple is-light">
                      {{ skill }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Modal -->
        <TaskFormSlider
          v-if="isTaskFormOpen"
          :is-open="isTaskFormOpen"
          :default-date="selectedDate"
          @close="closeTaskForm"
          @task-created="handleTaskCreated"
        />
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import TaskFormSlider from '../Tasks/TaskFormSlider.vue'
import type { AssignmentReport } from '@/types'

const props = defineProps<{
  isOpen: boolean
  selectedDate: Date | null
  report: AssignmentReport | null
}>()

const emit = defineEmits(['close', 'refresh'])

const isTaskFormOpen = ref(false)

const formattedDate = computed(() => {
  return props.selectedDate ? format(props.selectedDate, 'dd/MM/yyyy') : ''
})

const openTaskForm = () => {
  isTaskFormOpen.value = true
}

const closeTaskForm = () => {
  isTaskFormOpen.value = false
}

const handleTaskCreated = () => {
  closeTaskForm()
  emit('refresh')
}

const close = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
// Variables de color
$purple-base: #6b46c1;
$purple-light: #9f7aea;
$purple-lighter: #e9d8fd;
$purple-lightest: #faf5ff;
$purple-dark: #553c9a;
$white: #ffffff;
$gray-lightest: #f8f9fa;

.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($purple-dark, 0.5);
  backdrop-filter: blur(2px);
}

.slider-panel {
  position: relative;
  width: 33.333%;
  height: 100%;
  background-color: $gray-lightest;
  box-shadow: -2px 0 8px rgba($purple-base, 0.2);
  overflow-y: auto;
  z-index: 1001;
}

.slider-header {
  position: sticky;
  top: 0;
  background-color: white;
  padding: 1.5rem;
  border-bottom: 1px solid $purple-lighter;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1002;

  .title {
    color: $purple-dark;
  }
}

.slider-body {
  padding: 1.5rem;
  background-color: $gray-lightest;

  .box {
    background-color: $white;
    border: 1px solid $purple-lighter;
    box-shadow: 0 2px 4px rgba($purple-base, 0.05);
    margin-bottom: 1.5rem;
    
    &:hover {
      box-shadow: 0 4px 6px rgba($purple-base, 0.1);
    }

    .title {
      color: $purple-dark;
    }
  }
}

// Animaciones
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

// Scrollbar personalizado
.slider-panel {
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: $purple-lightest;
  }

  &::-webkit-scrollbar-thumb {
    background-color: $purple-light;
    border-radius: 4px;
    
    &:hover {
      background-color: $purple-base;
    }
  }
}

// Responsive
@media screen and (max-width: 768px) {
  .slider-panel {
    width: 100%;
  }
}

// Agregar estilos para el botón de nueva tarea
.button.is-purple.is-light {
  &.is-fullwidth {
    justify-content: center;
    
    .icon {
      margin-right: 0.5rem;
    }
  }
}

// Ajustar el z-index para que el formulario aparezca sobre el modal actual
.modal-wrapper {
  z-index: 1000;
}

.slider-panel {
  z-index: 1001;
}

// El TaskFormSlider necesitará un z-index mayor
:deep(.task-form-slider) {
  z-index: 1002;
}
</style> 