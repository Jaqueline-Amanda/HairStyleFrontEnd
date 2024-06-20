<template>
  <div>
    <RouterLink to="/hairdressers/create">Adicionar Novo Cabeleireiro</RouterLink>
    <h1>Listar Cabeleireiros</h1>
    <div>
      <table>
        <tr>
          <th>Nome</th>
          <th>Endereço</th>
          <th>Telefone</th>
          <th>Editar</th>
        </tr>
        <!-- laço de repetição para exibir os dados -->
        <tr v-for="hairdresser in hairdressers" :key="hairdresser.id">
          <td>{{ hairdresser.name }}</td>
          <td>{{ hairdresser.adress }}</td>
          <td>{{ hairdresser.telephone }}</td>
          <td>
            <RouterLink
              :to="{ name: 'HairdresserUpdate', params: { id: hairdresser.id } }"
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
const hairdressers = ref([])

//funcao para carregar os dados cadastrados
const getAllhairdressers = async () => {
  axios
    .get(apiUrl + '/api/hairdressers')
    .then(response => {
      console.log('Resposta:', response)
      hairdressers.value = response.data._embedded.hairdresserDtoList
    })
    .catch(error => {
      console.error('Error:', error)
    })
}
// lifecycle hook - evento: ao carregar o componente
onMounted(() => {
  getAllhairdressers()
})
</script>

<style lang="scss" scoped></style>
