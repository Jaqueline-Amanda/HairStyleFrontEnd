<template>
  <div>
    <RouterLink to="/clients/create">Adicionar Novo Cliente</RouterLink>
    <h1>Listar Clientes</h1>
    <div>
      <table>
        <tr>
          <th>Nome</th>
          <th>Telefone</th>
          <th>Editar</th>
        </tr>
        <!-- laço de repetição para exibir os dados -->
        <tr v-for="client in clients" :key="client.id">
          <td>{{ client.name }}</td>
          <td>{{ client.telephone }}</td>
          <td>
            <RouterLink
              :to="{ name: 'ClientUpdate', params: { id: client.id } }"
            >
              Editar
            </RouterLink>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import apiUrl from '@/config/api'
import axios from 'axios'

//array para armazenar os dados vindos da api
const clients = ref([])

//funcao para carregar os dados cadastrados
const getAllclients = async () => {
  axios
    .get(apiUrl + '/api/clients')
    .then(response => {
      console.log('Resposta:', response)
      clients.value = response.data._embedded.clientDtoList
    })
    .catch(error => {
      console.error('Error:', error)
    })
}
// lifecycle hook - evento: ao carregar o componente
onMounted(() => {
  getAllclients()
})
</script>

<style lang="scss" scoped></style>
