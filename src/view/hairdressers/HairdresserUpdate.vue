<template>
  <div>
    <RouterLink to="../hairdressers">Voltar</RouterLink>
    <h1>Inserir nova marca</h1>
    <form onclick="event.preventDefault()">
      <label for="name">Nome:</label>
      <input
        v-model="hairdresser.name"
        type="text"
        required
        maxlength="30"
        id="name"
      />
      <label for="address">Endereço</label>
      <input
        v-model="hairdresser.address"
        type="text"
        required
        maxlength="50"
        id="address"
      />
      <button @click="update">Cadastrar</button>
    </form>
  </div>
</template>

<script setup>
// importa a url base da api
import apiUrl from '@/config/api'
import { onMounted, reactive } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

//cria a instância do roteador
const router = useRouter()

//..parâmetro da rota
const route = useRoute()

// objeto reativo para capturar os dados do usuário
const hairdresser = reactive({
  id: '',
  name: '',
  address: '',
  telephone: '',
})

// função para cadastrar um novo cabeleireiro
const update = async () => {
  axios
    .put(apiUrl + '/api/hairdressers', hairdresser)
    .then(response => {
      alert('Dados atualizados com sucesso!')
      router.push('/hairdressers')
    })
    .catch(error => {
      alert('Erro ao cadastrar')
      console.log('Erro: ', error)
    })
}
//função para recuperar o objeto mediante o id
const gethairdresserById = async id => {
  await axios
    .get(apiUrl + '/api/hairdressers/' + id)
    .then(response => {
      console.log('Resposta:', response)
      Object.assign(hairdresser, response.data)
    })
    .catch(error => {
      console.error('Erro:' + error)
    })
}

//executad a recuperação qdo o componente for carregado
onMounted(() => {
  gethairdresserById(route.params.id)
})
</script>

<style lang="scss" scoped></style>
