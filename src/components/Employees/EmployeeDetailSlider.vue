<template>
  <Teleport to="body">
    <transition name="slide">
      <div v-if="isOpen" class="modal-wrapper">
        <div class="modal-backdrop" @click="close"></div>
        
        <div class="slider-panel">
          <header class="slider-header">
            <p class="title is-4">Detalle del Empleado</p>
            <button class="delete" aria-label="close" @click="close"></button>
          </header>

          <div v-if="loading" class="slider-body has-text-centered">
            <span class="icon is-large">
              <i class="fas fa-spinner fa-pulse fa-2x"></i>
            </span>
          </div>

          <div v-else-if="employeeDetail" class="slider-body">
            <!-- Información básica -->
            <div class="box">
              <div class="media">
                <div class="media-left">
                </div>
                <div class="media-content">
                  <p class="title is-4">{{ employeeDetail.data.attributes.name }}</p>
                  <div class="tags">
                    <span class="tag is-primary">
                      {{ employeeDetail.data.attributes.daily_hours }} horas diarias
                    </span>
                    <span class="tag is-info">
                      {{ employeeDetail.data.attributes.total_assignments }} asignaciones
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Habilidades -->
            <div class="box">
              <h4 class="title is-5 mb-3">Habilidades</h4>
              <div class="tags are-medium">
                <span 
                  v-for="skill in includedSkills" 
                  :key="skill.id"
                  class="tag is-light"
                >
                  {{ skill.attributes.name }}
                  <span class="has-text-grey ml-2">
                    ({{ skill.attributes.task_count }} tareas)
                  </span>
                </span>
              </div>
            </div>

            <!-- Disponibilidad -->
            <div class="box">
              <h4 class="title is-5 mb-3">Disponibilidad</h4>
              <div class="availability-grid">
                <div 
                  v-for="availability in sortedAvailabilities" 
                  :key="availability.id"
                  class="availability-day"
                  :class="{ 'is-today': isToday(availability.attributes.date) }"
                >
                  <div class="day-header">
                    <span class="date">{{ formatDate(availability.attributes.date) }}</span>
                    <span class="day">{{ availability.attributes.day_of_week }}</span>
                  </div>
                  <div class="hours" :class="getHoursClass(availability.attributes.available_hours)">
                    {{ availability.attributes.available_hours }}h
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { format, isToday as isDayToday } from 'date-fns'
import { es } from 'date-fns/locale'
import { useEmployeeStore } from '../../stores/employeeStore'
import type { EmployeeDetail } from '../../types/Employee'

const props = defineProps<{
  isOpen: boolean;
  employeeId: string;
}>()

const emit = defineEmits<{
  (e: 'close'): void;
}>()

const employeeStore = useEmployeeStore()
const loading = ref(false)
const employeeDetail = ref<EmployeeDetail | null>(null)

const includedSkills = computed(() => {
  return employeeDetail.value?.included.filter(item => item.type === 'skill') || []
})

const sortedAvailabilities = computed(() => {
  const availabilities = employeeDetail.value?.included.filter(
    item => item.type === 'availability'
  ) || []
  
  return availabilities.sort((a, b) => 
    new Date(a.attributes.date).getTime() - new Date(b.attributes.date).getTime()
  )
})

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMM', { locale: es })
}

const isToday = (date: string) => {
  return isDayToday(new Date(date))
}

const getHoursClass = (hours: string) => {
  const numHours = parseFloat(hours)
  if (numHours >= 6) return 'is-success'
  if (numHours >= 4) return 'is-warning'
  return 'is-danger'
}

const loadEmployeeDetail = async () => {
  loading.value = true
  try {
    const response = await employeeStore.getEmployeeById(props.employeeId)
    employeeDetail.value = response
    console.log('Employee detail loaded:', employeeDetail.value) // Para debug
  } catch (error) {
    console.error('Error loading employee detail:', error)
  } finally {
    loading.value = false
  }
}

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.classList.add('modal-open')
    loadEmployeeDetail()
  } else {
    document.body.classList.remove('modal-open')
  }
})

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

  .tag {
    &.is-light {
      background-color: $purple-lightest;
      color: $purple-dark;
      border: 1px solid $purple-lighter;
    }

    &.is-primary {
      background-color: $purple-base;
      color: white;
    }

    &.is-info {
      background-color: $purple-light;
      color: white;
    }
  }
}

.availability-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.availability-day {
  background-color: $white;
  border: 1px solid $purple-lighter;
  border-radius: 6px;
  padding: 0.75rem;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: $purple-lightest;
  }

  &.is-today {
    background-color: $purple-lightest;
    border-color: $purple-base;
  }

  .day-header {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem;

    .date {
      font-weight: bold;
      color: $purple-dark;
    }

    .day {
      font-size: 0.875rem;
      color: $purple-light;
    }
  }

  .hours {
    font-weight: bold;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;

    &.is-success {
      background-color: rgba($purple-base, 0.1);
      color: $purple-dark;
    }

    &.is-warning {
      background-color: rgba($purple-light, 0.1);
      color: $purple-base;
    }

    &.is-danger {
      background-color: rgba($purple-dark, 0.1);
      color: $purple-dark;
    }
  }
}

// Animaciones mejoradas
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

// Estilos adicionales para mejorar la interactividad
.media-content {
  .title {
    color: $purple-dark;
  }
}

.box {
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
}

.tags {
  .tag {
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba($purple-base, 0.1);
    }
  }
}
</style> 