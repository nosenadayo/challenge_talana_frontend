<template>
  <div class="calendar-page">
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <h1 class="title has-text-purple-dark">Calendario de Asignaciones</h1>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <div class="field">
            <div class="control">
              <button 
                class="button is-light"
                :class="{ 'is-loading': assignmentStore.loading }"
                @click="refreshCurrentMonth"
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
    </div>

    <Calendar 
      @day-selected="handleDaySelect"
      @month-changed="handleMonthChange"
    />

    <DayDetailModal
      :is-open="!!selectedDate"
      :selected-date="selectedDate"
      :report="selectedDateReport"
      @close="selectedDate = null"
      @refresh="refreshCurrentMonth"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import Calendar from '../components/Calendar/CalendarView.vue'
import { useAssignmentStore } from '../stores/assignmentStore'
import DayDetailModal from '../components/Calendar/DayDetailModal.vue'

const assignmentStore = useAssignmentStore()

// Función para cargar asignaciones de un día específico
const loadDayAssignments = async (date: Date) => {
  try {
    await assignmentStore.fetchAssignments(date)
  } catch (error) {
    console.error('Error loading assignments for date:', date, error)
  }
}

// Manejador cuando se selecciona un día
const handleDaySelect = async (date: Date) => {
  await loadDayAssignments(date)
}

// Manejador cuando cambia el mes
const handleMonthChange = async (date: Date) => {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  
  // Obtener todos los días del mes
  const daysInMonth = eachDayOfInterval({ start, end })
  
  // Cargar datos para cada día del mes visible
  for (const day of daysInMonth) {
    await loadDayAssignments(day)
  }
}

// Función para actualizar el mes actual
const refreshCurrentMonth = async () => {
  await handleMonthChange(new Date())
}

onMounted(async () => {
  await refreshCurrentMonth()
})
</script> 

<style lang="scss" scoped>
// Variables de color (las mismas que usamos en el modal)
$purple-base: #6b46c1;
$purple-light: #9f7aea;
$purple-lighter: #e9d8fd;
$purple-lightest: #faf5ff;
$purple-dark: #553c9a;

.button.is-purple {
  &.is-light {
    background-color: $purple-lightest;
    color: $purple-dark;
    border-color: $purple-lighter;

    &:hover {
      background-color: $purple-lighter;
      color: $purple-dark;
    }

    &.is-loading {
      &::after {
        border-color: transparent transparent $purple-dark $purple-dark !important;
      }
    }

    .icon {
      color: $purple-base;
    }
  }
}

// También podemos ajustar el título
.title.has-text-purple-dark {
  color: $purple-dark;
}
</style> 