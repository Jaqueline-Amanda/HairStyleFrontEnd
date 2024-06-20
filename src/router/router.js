import { createRouter, createWebHistory } from 'vue-router'

// Importe os componentes que você deseja navegar
import Home from '@/view/Home.vue'
import Contato from '@/view/Contato.vue'
import Error404 from '@/view/Error404.vue'
import HairdressersIndex from '@/view/hairdressers/HairdresserIndex.vue'
import HairdressersCreate from '@/view/hairdressers/HairdresserCreate.vue'
import HairdressersUpdate from '@/view/hairdressers/HairdresserUpdate.vue'

import ClientsIndex from '@/view/clients/ClientIndex.vue'
import ClientsUpdate from '@/view/clients/ClientUpdate.vue'
import ClientsCreate from '@/view/clients/ClientCreate.vue'

import Crud from '@/view/hairdressers/Crud.vue'
import CrudClient from '@/view/clients/CrudClient.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },

  {
    path: '/contato',
    name: 'Contato',
    component: Contato,
  },
  {
    path: '/hairdressers',
    name: 'HairdresserIndex',
    component: HairdressersIndex,
  },
  {
    path: '/crud',
    name: 'crud',
    component: Crud,
  },

  {
    path: '/crudClient',
    name: 'crudClient',
    component: CrudClient,
  },
  {
    path: '/hairdressers/:id',
    name: 'HairdresserCreate',
    component: HairdressersCreate,
  },
  {
    path: '/hairdressers/:id',
    name: 'HairdresserUpdate',
    component: HairdressersUpdate,
  },
  {
    path: '/clients',
    name: 'ClientIndex',
    component: ClientsIndex,
  },

  {
    path: '/clients/:id',
    name: 'ClientCreate',
    component: ClientsCreate,
  },
  {
    path: '/clients/:id',
    name: 'ClientUpdate',
    component: ClientsUpdate,
  },
  // Rota para página 404
  {
    path: '/:catchAll(.*)',
    name: 'Error404',
    component: Error404,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
