<template>
  <div class="employees-page">
    <!-- Header -->
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <h1 class="title">Empleados</h1>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <button 
            class="button is-light"
            :class="{ 'is-loading': employeeStore.loading }"
            @click="employeeStore.fetchEmployees()"
          >
            <span class="icon">
              <i class="fas fa-sync"></i>
            </span>
            <span>Actualizar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de empleados -->
    <div class="columns is-multiline">
      <div 
        v-for="employee in employeeStore.sortedEmployees"
        :key="employee.id"
        class="column is-one-third"
      >
        <div class="card employee-card" @click="showEmployeeDetail(employee.id)">
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4">{{ employee.attributes.name }}</p>
                <p class="subtitle is-6">
                  {{ employee.attributes.daily_hours }} horas diarias
                </p>
              </div>
            </div>

            <div class="content">
              <div class="tags">
                <span 
                  v-for="skill in employee.attributes.skill_names"
                  :key="skill"
                  class="tag is-light"
                >
                  {{ skill }}
                </span>
              </div>

              <div class="level is-mobile">
                <div class="level-left">
                  <div class="level-item">
                    <span class="tag is-info">
                      {{ employee.attributes.total_assignments }} asignaciones
                    </span>
                  </div>
                </div>
                <div class="level-right">
                  <div class="level-item">
                    <button 
                      class="button is-small is-primary is-light"
                      @click.stop="showEmployeeDetail(employee.id)"
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalle -->
    <EmployeeDetailSlider
      :is-open="isDetailOpen"
      :employee-id="selectedEmployeeId"
      @close="closeDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEmployeeStore } from '../stores/employeeStore'
import EmployeeDetailSlider from '../components/Employees/EmployeeDetailSlider.vue'

const employeeStore = useEmployeeStore()
const isDetailOpen = ref(false)
const selectedEmployeeId = ref('')

const showEmployeeDetail = (employeeId: string) => {
  selectedEmployeeId.value = employeeId
  isDetailOpen.value = true
}

const closeDetail = () => {
  isDetailOpen.value = false
  selectedEmployeeId.value = ''
}

onMounted(async () => {
  await employeeStore.fetchEmployees()
})
</script>

<style lang="scss" scoped>
@import '../assets/styles/_variables.scss';

.employees-page {
  padding: 1.5rem;
}

.employee-card {
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba($purple, 0.1);
  }

  .media-left {
    margin-right: 1rem;
  }

  .tags {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .level {
    margin-top: 1rem;
  }
}

.image.is-48x48 {
  img {
    object-fit: cover;
  }
}
</style> 