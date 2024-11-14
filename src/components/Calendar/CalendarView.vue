<template>
  <div class="calendar-container">
    <!-- Controles del calendario -->
    <div class="level mb-5">
      <div class="level-left">
        <div class="level-item">
          <div class="buttons has-addons">
            <button class="button" @click="previousMonth">
              <span class="icon">
                <i class="fas fa-chevron-left"></i>
              </span>
            </button>
            <button class="button is-static">
              {{ currentMonthName }} {{ currentYear }}
            </button>
            <button class="button" @click="nextMonth">
              <span class="icon">
                <i class="fas fa-chevron-right"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cabecera del calendario -->
    <div class="calendar-header">
      <div v-for="day in weekDays" :key="day" class="calendar-header-day">
        {{ day }}
      </div>
    </div>

    <!-- Días del calendario -->
    <div class="calendar-grid">
      <div class="calendar-week" v-for="week in calendar" :key="week[0].toISOString()">
        <div 
          v-for="date in week" 
          :key="date.toISOString()"
          class="calendar-day"
          :class="{
            'is-weekend': isWeekend(date),
            'is-today': isToday(date),
            'has-assignments': hasAssignments(date),
            'is-other-month': !isSameMonth(date, currentDate)
          }"
          @click="!isWeekend(date) && selectDate(date)"
        >
          <div class="day-header">
            {{ date.getDate() }}
          </div>
          
          <div v-if="!isWeekend(date)" class="day-content">
            <div 
              v-for="(assignment, index) in getDayAssignments(date)"
              :key="assignment.id"
              class="assignment-pill"
              v-show="index < 3"
            >
              {{ assignment.title }}
            </div>
            <div 
              v-if="getDayAssignments(date).length > 3"
              class="more-assignments"
            >
              +{{ getDayAssignments(date).length - 3 }} más
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalle del día -->
    <div class="modal" :class="{ 'is-active': selectedDate }">
      <div class="modal-background" @click="selectedDate = null"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">
            Asignaciones para {{ formatDate(selectedDate) }}
          </p>
          <button 
            class="delete" 
            aria-label="close"
            @click="selectedDate = null"
          ></button>
        </header>
        <section class="modal-card-body">
          <div v-if="selectedDateReport">
            <!-- Resumen de asignaciones -->
            <div class="box">
              <h3 class="title is-5">Resumen</h3>
              <div class="columns is-multiline">
                <div class="column is-half">
                  <p>Total asignaciones: {{ selectedDateReport.attributes.summary_stats.total_assignments }}</p>
                </div>
                <div class="column is-half">
                  <p>Horas asignadas: {{ selectedDateReport.attributes.summary_stats.total_hours_assigned }}</p>
                </div>
              </div>
            </div>

            <!-- Lista de empleados y sus asignaciones -->
            <div v-for="employee in selectedDateReport.attributes.employees_summary" 
                 :key="employee.id"
                 class="box">
              <h4 class="title is-6">{{ employee.name }}</h4>
              <p class="subtitle is-7">
                {{ employee.total_hours }}/{{ employee.available_hours }} horas
              </p>
              
              <div class="assignments-list">
                <div v-for="task in employee.assignments" 
                     :key="task.id"
                     class="assignment-item">
                  <p class="task-title">{{ task.title }}</p>
                  <p class="task-hours">{{ task.estimated_hours }}h</p>
                  <div class="tags are-small">
                    <span v-for="skill in task.required_skills" 
                          :key="skill"
                          class="tag is-info is-light">
                      {{ skill }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  addDays,
  getDay
} from 'date-fns'
import { es } from 'date-fns/locale'
import { useAssignmentStore } from '../../stores/assignmentStore'

const currentDate = ref(new Date())
const selectedDate = ref<Date | null>(null)
const selectedDateReport = ref<AssignmentReport | null>(null)

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const currentMonthName = computed(() => {
  return format(currentDate.value, 'MMMM', { locale: es })
})

const currentYear = computed(() => {
  return format(currentDate.value, 'yyyy')
})

// Función para generar el calendario
const calendar = computed(() => {
  const start = startOfWeek(startOfMonth(currentDate.value), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(currentDate.value), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start, end })

  const weeks = []
  let week = []

  days.forEach((day) => {
    if (week.length > 0 && getDay(day) === 1) {
      weeks.push(week)
      week = []
    }
    week.push(day)
  })

  if (week.length > 0) {
    weeks.push(week)
  }

  return weeks
})

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1)
}

const previousMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1)
}

const isWeekend = (date: Date) => {
  const day = getDay(date)
  return day === 0 || day === 6
}

const isToday = (date: Date) => {
  return format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
}

const formatDate = (date: Date | null) => {
  if (!date) return ''
  return format(date, 'dd/MM/yyyy')
}

const assignmentStore = useAssignmentStore()

const getDayAssignments = (date: Date) => {
  const report = assignmentStore.getAssignmentsByDate(date)
  if (!report) return []
  
  return report.attributes.employees_summary.flatMap(employee => 
    employee.assignments.map(assignment => ({
      id: assignment.id,
      title: assignment.title,
      hours: assignment.estimated_hours,
      employee: employee.name
    }))
  )
}

const hasAssignments = (date: Date) => {
  return getDayAssignments(date).length > 0
}

const selectDate = async (date: Date) => {
  selectedDate.value = date
  if (!assignmentStore.getAssignmentsByDate(date)) {
    await assignmentStore.fetchAssignments(date)
  }
  selectedDateReport.value = assignmentStore.getAssignmentsByDate(date) || null
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/_variables.scss';

.calendar-container {
  padding: 1rem;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  margin-bottom: 0.5rem;
  
  .calendar-header-day {
    padding: 0.5rem;
    background-color: lighten($purple, 45%);
    border-radius: 4px;
    margin: 0 2px;
  }
}

.calendar-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.calendar-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.calendar-day {
  aspect-ratio: 1;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;

  &:hover:not(.is-weekend) {
    border-color: $purple;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba($purple, 0.1);
  }

  &.is-weekend {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  &.is-today {
    border-color: $purple;
    border-width: 2px;
  }

  &.has-assignments {
    background-color: lighten($purple, 45%);
  }

  &.is-other-month {
    opacity: 0.5;
  }

  .day-header {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .day-content {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
}

.assignment-pill {
  background-color: $purple;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-assignments {
  font-size: 0.8rem;
  color: $purple;
  text-align: center;
  padding: 0.2rem;
}
</style> 