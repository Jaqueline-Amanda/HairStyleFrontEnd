<template>
  <div>
    <RouterLink to="../clients">Voltar</RouterLink>
    <h1>Inserir novo cliente</h1>
    <form onclick="event.preventDefault()">
      <label for="name">Nome:</label>
      <input
        v-model="client.name"
        type="text"
        required
        maxlength="30"
        id="name"
      />
      <label for="telephone">Telefone</label>
      <input
        v-model="client.telephone"
        type="text"
        required
        maxlength="50"
        id="telephone"
      />
      <button @click="create">Cadastrar</button>
    </form>
  </div>
</template>

<script setup>
// importa a url base da api
import apiUrl from '@/config/api'
import { reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

//cria a instância do roteador
const router = useRouter()

// objeto reativo para capturar os dados do usuário
const client = reactive({
  name: '',
  telephone: '',
})

// função para cadastrar uma nova marca
const create = async () => {
  axios
    .post(apiUrl + '/api/clients', client)
    .then(response => {
      alert('Dados cadastrados com sucesso!')
      router.push('/clients')
    })
    .catch(error => {
      alert('Erro ao cadastrar')
      console.log('Erro: ', error)
    })
}
</script>

<style lang="scss" scoped></style>
