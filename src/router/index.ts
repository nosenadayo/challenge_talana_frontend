import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CalendarView from '../views/CalendarView.vue'
import EmployeesView from '../views/EmployeesView.vue'
import TasksView from '../views/TasksView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView
    },
    {
      path: '/employees',
      name: 'employees',
      component: EmployeesView
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TasksView
    }
  ]
})

export default router 