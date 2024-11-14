<template>
  <div class="calendar-page">
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <h1 class="title">Calendario de Asignaciones</h1>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <div class="field">
            <div class="control">
              <button 
                class="button is-primary"
                :class="{ 'is-loading': assignmentStore.loading }"
                @click="refreshAssignments"
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

    <Calendar />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Calendar from '../components/Calendar/CalendarView.vue'
import { useAssignmentStore } from '../stores/assignmentStore'

const assignmentStore = useAssignmentStore()

const refreshAssignments = async () => {
  await assignmentStore.fetchAssignments(new Date())
}

onMounted(async () => {
  await refreshAssignments()
})
</script> 