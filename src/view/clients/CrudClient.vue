<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import  { FilterMatchMode }  from "primevue/api";

import ClientService from '@/service/ClientService'
import HairdresserService from '@/service/HairdresserService';

const toast = useToast();

const clients = ref(null);
const calendarValue = ref(null);
const clientDialog = ref(false);
const deleteClientsDialog = ref(false);
const deletClientsDialog = ref(false);
const client= ref({});
const selectedClients= ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
    { label: 'Pago', value: 'pago' },
    { label: 'Recebido', value: 'recebido' },
    { label: 'A Pagar', value: 'pagar' },
    { label: 'A Receber', value: 'receber' },
    { label: 'Atrasado', value: 'atrasado' }
]);
const types = ref([
    { label: 'Despesa', value: 'despesa' },
    { label: 'Receita', value: 'receita' }
]);
const accounts = ref([
    { label: 'Nubank', value: 'nubank' },
    { label: 'Bradesco', value: 'bradesco' },
    { label: 'Santander', value: 'santander' }
]);
const categories = ref([
  { label: 'Moradia', value: 'moradia' },
  { label: 'Renda', value: 'renda' },
  { label: 'Alimentação', value: 'alimentacao' },
  { label: 'Saúde', value: 'saude' },
  { label: 'Trabalho Autônomo', value: 'trabalhoAutonomo' },
  { label: 'Lazer', value: 'lazer' },
  { label: 'Investimentos', value: 'investimentos' },
  { label: 'Cartões de Crédito', value: 'cartoesDeCredito' },
  { label: 'Entretenimento', value: 'entretenimento' },
  { label: 'Serviços', value: 'servicos' },
  { label: 'Transporte', value: 'transporte' },
  { label: 'Educação', value: 'educacao' },
  { label: 'Outros', value: 'outros' }
]);

// STATUS
const getBadgeSeverity = (inventoryStatus) => {
    const statusMap = {
        "pago": 'success',
        "recebido": 'success',
        "a pagar": 'warning',
        "a receber": 'warning',
        "atrasado": 'danger',
    };

    return statusMap[inventoryStatus.toLowerCase()] || 'info';
};

onBeforeMount(() => {
  initFilters();
});

onMounted(async () => {
  await loadClients();
});

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};

const loadClients = async () => {
  try {
    clients.value = await ClientService.getAll();

  } catch (error) {
    console.error("Erro ao carregar clients:", error);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Erro ao carregar clients.",
      life: 3000,
    });
  }
}

const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const openNew = () => {
    client.value = {};
    submitted.value = false;
    clientDialog.value = true;
};

const hideDialog = () => {
    clientDialog.value = false;
    submitted.value = false;
};

const saveClient=  async () => {
    submitted.value = true;
    if (client.value.name && 
         client.value.name.trim() 
         && client.value
        ) {
            try{
                if (client.value.id) { 
                    await ClientService.updateClient(
          client.value
        );
        toast.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Cabeleireiro atualizado com sucesso.",
          life: 3000,
        });
      } else { 

        console.log(client.value)

        client.value = {
          ...client.value
        };


        await ClientService.create(client.value);
        toast.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Cabeleireiro criado com sucesso.",
          life: 3000,
        });
      }
      await loadClients();
      hideDialog();
    } catch (error) {
      console.error("Erro ao salvar cabeleireiro:", error);
      toast.add({
        severity: "error",
        summary: "Erro",
        detail:
          "Erro ao salvar cabeleireiro. Verifique os dados informados.",
        life: 3000,
      });
    }
  }
};


const editClient= (editToClient) => {
    client.value = { ...editToClient};
clientDialog.value = true;
};

// const confirmDeleteSelected = () => {
//     deleteClientsDialog.value = true;
// };

const deleteClient = async () => {
  try {
    await ClientService.deleteClient(client.value.id);
    await loadClients();
    deleteClientsDialog.value = false;
    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Cliente excluído com sucesso.",
      life: 3000,
    });
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Erro ao excluir cliente.",
      life: 3000,
    });
  }
};

const confirmDeleteSelected = () => {
    deleteClientsDialog.value = true;
 };

 const deleteSelectedClients = async () => {
  try {
    for (const clientToDelete of selectedClients.value) {
      await ClientService.deleteClient(clientToDelete.id);
    }
    await loadClients();
    deleteClientsDialog.value = false;
    selectedClients.value = null;
    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Clientes excluídos com sucesso.",
      life: 3000,
    });
  } catch (error) {
    console.error("Erro ao excluir clientes:", error);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Erro ao excluir clientes.",
      life: 3000,
    });
  }
};

const confirmDeleteClient = (deleteClient) => {
    client.value = deleteClient;
    deleteClientsDialog.value = true;
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < clients.value.length; i++) {
        if (clients.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

const exportCSV = () => {
    dt.value.exportCSV();
};


const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Novo" icon="pi pi-plus" class="mr-2" severity="success" @click="openNew" />
                            <Button label="Excluir" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedClients || !selectedClients.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" /> -->
                        <Button label="Exportar" icon="pi pi-upload" severity="contrast" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="clients"
                    v-model:selection="selectedClients"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando de {first} à {last} de {totalRecords} lançamentos"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">clients</h5>
                            <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                <InputIcon class="pi pi-search" />
                                <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Procurar..." />
                            </IconField>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="name" header="Name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Name</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="telephone" header="Telephone" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Telephone</span>
                            {{ slotProps.data.telephone }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editClient(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="danger" rounded @click="confirmDeleteClient(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <!-- MODEL DE CADASTRO -->
                <Dialog v-model:visible="clientDialog" :style="{ width: '1000px' }" header="Detalhes do lançamento" :modal="true" class="p-fluid">
                    <!-- <img :src="'/assets/logo.svg' + client.image" :alt="product.image" v-if="product.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" /> -->
                    <div class="formgrid grid">
                        <div class="field col-9">
                            <label for="name">Nome</label>
                            <InputText id="name" v-model.trim="client.name" required="true" autofocus :invalid="submitted && !client.name" />
                            <small class="p-invalid" v-if="submitted && !client.name">Name is required.</small>
                        </div>
                    </div>
                
                <div class="formgrid grid">
                        <div class="field col-6">
                            <label for="telephone">Telefone</label>
                        <InputText id="telephone" v-model.trim="client.telephone" required="true" autofocus :invalid="submitted && !client.telephone" />
                    <small class="p-invalid" v-if="submitted && !client.telephone">Name is required.</small>
                </div>
            </div>
                        <!-- <div class="field col-3">
                            <label for="type" class="">Tipo</label>
                            <Dropdown id="type" v-model="product.type" :options="types" optionLabel="label" placeholder="Selecione um tipo">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value && slotProps.value.value">
                                        <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                                    </div>
                                    <div v-else-if="slotProps.value && !slotProps.value.value">
                                        <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
                                    </div>
                                    <span v-else>
                                        {{ slotProps.placeholder }}
                                    </span>
                                </template>
                            </Dropdown>
                        </div>
                        <div class="field col-3">
                            <label for="inventoryStatus" class="">Data</label>
                            <Calendar :showIcon="true" :showButtonBar="true" locale="pt_BR" dateFormat="dd/mm/yy" v-model="calendarValue"></Calendar>
                        </div>

                    <div class="formgrid grid">
                        <div class="field col-6">
                            <label for="account" class="">Conta</label>
                            <Dropdown id="account" v-model="product.account" :options="accounts" optionLabel="label" placeholder="Selecione uma conta bancária">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value && slotProps.value.value">
                                        <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                                    </div>
                                    <div v-else-if="slotProps.value && !slotProps.value.value">
                                        <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
                                    </div>
                                    <span v-else>
                                        {{ slotProps.placeholder }}
                                    </span>
                                </template>
                            </Dropdown>
                        </div>
                        <div class="field col-6">
                            <label for="category" class="">Categoria</label>
                            <Dropdown id="category" v-model="product.category" :options="categories" optionLabel="label" placeholder="Selecione uma Categoria">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value && slotProps.value.value">
                                        <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                                    </div>
                                    <div v-else-if="slotProps.value && !slotProps.value.value">
                                        <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
                                    </div>
                                    <span v-else>
                                        {{ slotProps.placeholder }}
                                    </span>
                                </template>
                            </Dropdown>
                        </div>
                    </div>

                    <div class="formgrid grid">
                        <div class="field col-6">
                            <label for="status" class="">Status</label>
                            <Dropdown id="status" v-model="product.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Selecione um Status">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value && slotProps.value.value">
                                        <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                                    </div>
                                    <div v-else-if="slotProps.value && !slotProps.value.value">
                                        <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
                                    </div>
                                    <span v-else>
                                        {{ slotProps.placeholder }}
                                    </span>
                                </template>
                            </Dropdown>
                        </div>
                    </div> -->

                    <!-- <div class="field">
                        <label class="mb-3">Status</label>
                        <div class="formgrid grid">
                            <div class="field-radiobutton col-3">
                                <RadioButton id="category1" name="category" value="Accessories" v-model="product.category" />
                                <label for="category1">Accessories</label>
                            </div>
                            <div class="field-radiobutton col-3">
                                <RadioButton id="category2" name="category" value="Clothing" v-model="product.category" />
                                <label for="category2">Clothing</label>
                            </div>
                            <div class="field-radiobutton col-3">
                                <RadioButton id="category3" name="category" value="Electronics" v-model="product.category" />
                                <label for="category3">Electronics</label>
                            </div>
                            <div class="field-radiobutton col-3">
                                <RadioButton id="category4" name="category" value="Fitness" v-model="product.category" />
                                <label for="category4">Fitness</label>
                            </div>
                        </div>
                    </div> -->
                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" text="" @click="hideDialog" />
                        <Button label="Salvar" icon="pi pi-check" text="" @click="saveClient" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteClientsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="client"
                            >Are you sure you want to delete <b>{{ client.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteClientsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedClients" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deletClientsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="client">Are you sure you want to delete the selected clients?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deletClientsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedClients" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
