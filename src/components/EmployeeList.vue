<template>
  <div class="employee-list">
    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">{{ error }}</div>
    <template v-else>
      <div class="skills-filter">
        <button 
          v-for="skill in store.skills" 
          :key="skill.id"
          @click="filterBySkill(skill.attributes.name)"
        >
          {{ skill.attributes.name }}
          ({{ skill.attributes.employee_count }})
        </button>
      </div>

      <div class="employees-grid">
        <div 
          v-for="employee in filteredEmployees" 
          :key="employee.id"
          class="employee-card"
        >
          <h3>{{ employee.attributes.name }}</h3>
          <p>Horas diarias: {{ employee.attributes.daily_hours }}</p>
          <div class="skills">
            <span 
              v-for="skill in employee.attributes.skill_names" 
              :key="skill"
              class="skill-tag"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEmployeeStore } from '../stores/employeeStore';

const store = useEmployeeStore();
const selectedSkill = ref('');
const filteredEmployees = computed(() => {
  return selectedSkill.value ? 
    store.getEmployeesBySkill(selectedSkill.value) : 
    store.employees;
});

const filterBySkill = (skill: string) => {
  selectedSkill.value = selectedSkill.value === skill ? '' : skill;
};

onMounted(async () => {
  await store.fetchEmployees();
});
</script> 