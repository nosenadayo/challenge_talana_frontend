<template>
  <div class="app-wrapper">
    <!-- Navbar -->
    <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
      <div class="container">
        <!-- Brand -->
        <div class="navbar-brand">
          <router-link class="navbar-item brand-title" to="/">
            <strong>TalaTask</strong>
          </router-link>

          <!-- Burger menu -->
          <a 
            role="button" 
            class="navbar-burger"
            :class="{ 'is-active': isMenuActive }"
            @click="toggleMenu"
            aria-label="menu" 
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <!-- Menu items -->
        <div class="navbar-menu" :class="{ 'is-active': isMenuActive }">
          <div class="navbar-start">
            <router-link class="navbar-item" to="/tasks">
              <span class="icon">
                <i class="fas fa-tasks"></i>
              </span>
              <span>Tareas</span>
            </router-link>

            <router-link class="navbar-item" to="/calendar">
              <span class="icon">
                <i class="fas fa-calendar"></i>
              </span>
              <span>Calendario</span>
            </router-link>
            
            <router-link class="navbar-item" to="/employees">
              <span class="icon">
                <i class="fas fa-users"></i>
              </span>
              <span>Empleados</span>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="main-content">
      <div class="container is-fluid px-4 py-4">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMenuActive = ref(false)

const toggleMenu = () => {
  isMenuActive.value = !isMenuActive.value
}
</script>

<style lang="scss">
@import './assets/styles/_variables.scss';

.app-wrapper {
  min-height: 100vh;
  background-color: $white;
}

// Navbar styles
.navbar.is-primary {
  background-color: $purple;
  
  .navbar-brand {
    .navbar-item {
      color: $white;
      font-size: 1.25rem;
      
      &:hover {
        background-color: $purple-dark !important;
      }
    }
  }
  
  .navbar-burger {
    color: $white;
    
    &:hover {
      background-color: $purple-dark;
    }
    
    span {
      background-color: currentColor;
    }
  }
  
  .navbar-menu {
    @media screen and (max-width: 1023px) {
      background-color: $purple;
    }
    
    .navbar-item {
      color: $white;
      transition: background-color 0.3s ease;
      
      .icon {
        margin-right: 0.5rem;
      }
      
      &:hover {
        background-color: $purple-dark !important;
        color: $white;
      }
      
      &.router-link-active {
        background-color: $purple-dark !important;
        color: $white;
      }
    }
  }

  // Buttons in navbar
  .button.is-light {
    &:hover {
      background-color: darken($white, 5%);
    }
  }
}

// Main content styles
.main-content {
  padding-top: 1rem;
}

// Utility classes
.px-4 {
  padding-left: 1.5rem !important;
  padding-right: 1.5rem !important;
}

.py-4 {
  padding-top: 1.5rem !important;
  padding-bottom: 1.5rem !important;
}

// Container adjustments
.container.is-fluid {
  @media screen and (min-width: 1024px) {
    padding: 0 32px;
  }
}
// Ensure icons are loaded
@import '@fortawesome/fontawesome-free/css/all.css';
</style>
