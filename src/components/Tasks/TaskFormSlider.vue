<template>
  <Teleport to="body">
    <transition name="slide">
      <div v-if="isOpen" class="modal-wrapper">
        <!-- Fondo oscuro -->
        <div class="modal-backdrop" @click="close"></div>
        
        <!-- Panel deslizante -->
        <div class="slider-panel">
          <header class="slider-header">
            <p class="title is-4">Nueva Tarea</p>
            <button class="delete" aria-label="close" @click="close"></button>
          </header>

          <div class="slider-body">
            <form @submit.prevent="handleSubmit">
              <div class="field">
                <label class="label">Título</label>
                <div class="control">
                  <input 
                    v-model="formData.title"
                    class="input"
                    type="text"
                    placeholder="Título de la tarea"
                    required
                  >
                </div>
              </div>

              <div class="field">
                <label class="label">Fecha límite</label>
                <div class="control">
                  <input 
                    v-model="formData.due_date"
                    class="input"
                    type="date"
                    required
                  >
                </div>
              </div>

              <div class="field">
                <label class="label">Horas estimadas</label>
                <div class="control">
                  <input 
                    v-model.number="formData.estimated_hours"
                    class="input"
                    type="number"
                    min="0"
                    step="0.5"
                    required
                  >
                </div>
              </div>

              <div class="field">
                <label class="label">Habilidades requeridas</label>
                <div class="control">
                  <div v-if="skillStore.loading" class="has-text-centered">
                    <span class="icon is-large">
                      <i class="fas fa-spinner fa-pulse"></i>
                    </span>
                  </div>
                  <div v-else-if="skillStore.error" class="notification is-danger is-light">
                    {{ skillStore.error }}
                  </div>
                  <div v-else class="buttons are-small">
                    <button 
                      v-for="skill in skillStore.skills"
                      :key="skill.id"
                      type="button"
                      class="button is-purple"
                      :class="{ 'is-light': !isSkillSelected(skill.id) }"
                      @click="toggleSkill(skill.id)"
                    >
                      {{ skill.name }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="field is-grouped mt-6">
                <div class="control">
                  <button 
                    type="submit" 
                    class="button is-primary"
                    :class="{ 'is-loading': loading }"
                    :disabled="!isFormValid"
                  >
                    Crear Tarea
                  </button>
                </div>
                <div class="control">
                  <button 
                    type="button" 
                    class="button is-light"
                    @click="close"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { format } from 'date-fns'
import { useTaskStore } from '../../stores/taskStore'
import { useSkillStore } from '../../stores/skillStore'

const props = defineProps<{
  isOpen: boolean,
  defaultDate?: Date | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'taskCreated'): void
}>()

const taskStore = useTaskStore()
const skillStore = useSkillStore()
const loading = ref(false)

const formData = ref({
  title: '',
  due_date: '',
  estimated_hours: 0,
  skill_ids: [] as number[]
})

const isFormValid = computed(() => {
  return formData.value.title &&
         formData.value.due_date &&
         formData.value.estimated_hours > 0 &&
         formData.value.skill_ids.length > 0
})

const isSkillSelected = (skillId: number) => {
  return formData.value.skill_ids.includes(skillId)
}

const toggleSkill = (skillId: number) => {
  const index = formData.value.skill_ids.indexOf(skillId)
  if (index === -1) {
    formData.value.skill_ids.push(skillId)
  } else {
    formData.value.skill_ids.splice(index, 1)
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  loading.value = true
  try {
    await taskStore.createTask({
      task: {
        title: formData.value.title,
        due_date: formData.value.due_date,
        estimated_hours: formData.value.estimated_hours,
        skill_ids: formData.value.skill_ids
      }
    })
    emit('taskCreated')
    close()
  } catch (error) {
    console.error('Error creating task:', error)
  } finally {
    loading.value = false
  }
}

const close = () => {
  emit('close')
}

// Manejar el scroll del body
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.classList.add('modal-open')
  } else {
    document.body.classList.remove('modal-open')
  }
})

// Establecer la fecha por defecto cuando se monta el componente
onMounted(() => {
  if (props.defaultDate) {
    formData.value.due_date = format(props.defaultDate, 'yyyy-MM-dd')
  }
})

// También observar cambios en defaultDate por si el componente ya está montado
watch(() => props.defaultDate, (newDate) => {
  if (newDate) {
    formData.value.due_date = format(newDate, 'yyyy-MM-dd')
  }
})

// Cargar habilidades cuando se monta el componente
onMounted(async () => {
  try {
    await skillStore.fetchSkills()
    console.log('Skills loaded:', skillStore.skills) // Para debug
  } catch (error) {
    console.error('Error loading skills:', error)
  }
})
</script>

<style lang="scss" scoped>
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  z-index: 1002;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 1003;
}

.slider-panel {
  position: relative;
  width: 33.333%;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1004;
}

.slider-header {
  position: sticky;
  top: 0;
  background-color: white;
  padding: 1.5rem;
  border-bottom: 1px solid #dbdbdb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1002;
}

.slider-body {
  padding: 1.5rem;
}

// Animaciones
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

// Responsive
@media screen and (max-width: 768px) {
  .slider-panel {
    width: 100%;
  }
}

// Estilos del formulario
.field {
  margin-bottom: 1.5rem;
}

.buttons.are-small {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;

  .button {
    margin: 0 !important;
    transition: all 0.2s ease;
    min-width: auto;
    
    &:hover {
      transform: translateY(-1px);
    }
  }
}

// Variables de color locales
$purple-base: #6b46c1;
$purple-light: #9f7aea;
$purple-lighter: #e9d8fd;
$purple-lightest: #faf5ff;
$purple-dark: #553c9a;

.button.is-purple {
  background-color: $purple-base;
  color: white;
  border-color: transparent;

  &.is-light {
    background-color: $purple-lightest;
    color: $purple-dark;
    border-color: $purple-lighter;

    &:hover {
      background-color: $purple-lighter;
      color: $purple-dark;
    }
  }

  &:hover {
    background-color: darken($purple-base, 5%);
    color: white;
  }
}

// Asegurarse que el contenido del body no se desplace
:global(body.modal-open) {
  overflow: hidden;
}

// Agregar estilos específicos para los botones de habilidades
.buttons.are-small {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;

  .button {
    margin: 0 !important;
    transition: all 0.2s ease;
    min-width: auto;
    
    &:hover {
      transform: translateY(-1px);
    }
  }
}

// Mejorar la visualización del estado de carga
.icon.is-large {
  height: 3rem;
  width: 3rem;
  
  i {
    font-size: 1.5rem;
  }
}

// Mejorar el mensaje de error
.notification.is-danger.is-light {
  margin-top: 0.5rem;
  padding: 0.75rem;
}
</style> 