<template>
  <div class="modal-wrapper">
    <div class="modal-backdrop" @click="close"></div>
    
    <div class="slider-panel">
      <header class="slider-header">
        <p class="title is-4">Nueva Tarea</p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>

      <div class="slider-body">
        <form @submit.prevent="handleSubmit">
          <!-- ... tu formulario existente ... -->
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ... tu script existente ...

// Asegúrate de emitir estos eventos
const emit = defineEmits(['close', 'task-created'])

const handleSubmit = async () => {
  try {
    // ... tu lógica de envío ...
    emit('task-created')
  } catch (error) {
    console.error('Error creating task:', error)
  }
}

const close = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
// Usar los mismos estilos que el modal principal
// ... copiar los estilos relevantes del DayDetailModal ...
</style> 