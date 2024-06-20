<template>
  <div>
    <nav>
      <ul style="color:#EFE089">
      
        <li ><RouterLink to="/Crud">Cabeleireiros</RouterLink></li>
        <li><RouterLink to="/CrudClient">Clientes</RouterLink></li>
        <li><RouterLink to="/Contato">Contato</RouterLink></li>
      </ul>
    </nav>

    <RouterView />
  </div>
</template>

<script setup></script>

<style scoped></style>
