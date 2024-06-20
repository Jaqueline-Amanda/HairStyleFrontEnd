<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import  { FilterMatchMode }  from "primevue/api";

import HairdresserService from '@/service/HairdresserService'

const toast = useToast();

const hairdressers = ref(null);
const calendarValue = ref(null);
const hairdresserDialog = ref(false);
const deleteHairdressersDialog = ref(false);
const deletHairdressersDialog = ref(false);
const hairdresser= ref({});
const selectedHairdressers= ref(null);
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
  await loadHairdressers();
});

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};

const loadHairdressers = async () => {
  try {
    hairdressers.value = await HairdresserService.getAll();

  } catch (error) {
    console.error("Erro ao carregar hairdressers:", error);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Erro ao carregar hairdressers.",
      life: 3000,
    });
  }
}

const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const openNew = () => {
    hairdresser.value = {};
    submitted.value = false;
    hairdresserDialog.value = true;
};

const hideDialog = () => {
    hairdresserDialog.value = false;
    submitted.value = false;
};

const saveHairdresser =  async () => {
    submitted.value = true;
    if (hairdresser.value.name && 
         hairdresser.value.name.trim() 
         && hairdresser.value
        ) {
            try{
                if (hairdresser.value.id) { 
                    await HairdresserService.updateHairdresser(
          hairdresser.value
        );
        toast.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Cabeleireiro atualizado com sucesso.",
          life: 3000,
        });
      } else { 

        console.log(hairdresser.value)

        hairdresser.value = {
          ...hairdresser.value
        };


        await HairdresserService.create(hairdresser.value);
        toast.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Cabeleireiro criado com sucesso.",
          life: 3000,
        });
      }
      await loadHairdressers();
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


const editHairdresser= (editToHairdresser) => {
    hairdresser.value = { ...editToHairdresser };
hairdresserDialog.value = true;
};

// const confirmDeletHairdresser = (hairdresserToDelete) => {
//   hairdresser.value = hairdresserToDelete;
//   deleteLancamentoDialog.value = true;
// };

const deleteHairdresser = async () => {
  try {
    await HairdresserService.deleteHairdresser(hairdresser.value.id);
    await loadHairdressers();
    deletHairdressersDialog.value = false;
    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Lançamento excluído com sucesso.",
      life: 3000,
    });
  } catch (error) {
    console.error("Erro ao excluir lançamento:", error);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Erro ao excluir lançamento.",
      life: 3000,
    });
  }
};

const confirmDeleteSelected = () => {
    deleteHairdressersDialog.value = true;
 };

 const deleteSelectedHairdressers = async () => {
  try {
    for (const hairdresserToDelete of selectedHairdressers.value) {
      await HairdresserService.deleteHairdresser(hairdresserToDelete.id);
    }
    await loadHairdressers();
    deleteHairdressersDialog.value = false;
    selectedHairdressers.value = null;
    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Lançamentos excluídos com sucesso.",
      life: 3000,
    });
  } catch (error) {
    console.error("Erro ao excluir lançamentos:", error);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Erro ao excluir lançamentos.",
      life: 3000,
    });
  }
};
const confirmDeleteHairdresser = (deleteHairdresser) => {
    hairdresser.value = deleteHairdresser;
    deleteHairdressersDialog.value = true;
};


// const deleteHairdresser = () => {
//     hairdressers.value = hairdressers.value.filter((val) => val.id !== hairdresser.value.id);
//     deleteHairdressersDialog.value = false;
//     hairdresser.value = {};
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Hairdresser Deleted', life: 3000 });
// };



const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < hairdressers.value.length; i++) {
        if (hairdressers.value[i].id === id) {
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



const confirmDeletSelected = () => {
    deletHairdressersDialog.value = true;
};



// const deletSelectedHairdressers = () => {
//     hairdressers.value = hairdressers.value.filter((val) => !selectedHairdressers.value.includes(val));
//     deleteHairdressersDialog.value = false;
//     selectedHairdressers.value = null;
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Hairdressers Deleted', life: 3000 });
// };



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
                        <div class="button-novo">
                            <Button label="Novo" icon="pi pi-plus" class="mr-2" severity="success" @click="openNew" />
                            <Button label="Excluir" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedHairdressers || !selectedHairdressers.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" /> -->
                        <Button label="Exportar" icon="pi pi-upload" severity="contrast" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="hairdressers"
                    v-model:selection="selectedHairdressers"
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
                            <h5 class="m-0">Hairdressers</h5>
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
                    <Column field="address" header="Address" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Address</span>
                            {{ slotProps.data.address }}
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
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editHairdresser(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="danger" rounded @click="confirmDeleteHairdresser(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <!-- MODEL DE CADASTRO -->
                <Dialog v-model:visible="hairdresserDialog" :style="{ width: '1000px' }" header="Detalhes do lançamento" :modal="true" class="p-fluid">
                    <!-- <img :src="'/assets/logo.svg' + hairdresser.image" :alt="product.image" v-if="product.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" /> -->
                    <div class="formgrid grid">
                        <div class="field col-9">
                            <label for="name">Nome</label>
                            <InputText id="name" v-model.trim="hairdresser.name" required="true" autofocus :invalid="submitted && !hairdresser.name" />
                            <small class="p-invalid" v-if="submitted && !hairdresser.name">Name is required.</small>
                        </div>
                        <div class="field col-3">
                            <label for="address">Endereço</label>
                            <InputText id="address" v-model="hairdresser.address" mode="currency" currency="BRL" locale="pt-BR" :invalid="submitted && !hairdresser.address" :required="true" />
                            <small class="p-invalid" v-if="submitted && !hairdresser.address">Address is required.</small>
                        </div>
                    </div>
                
                <div class="formgrid grid">
                        <div class="field col-6">
                            <label for="telephone">Telefone</label>
                        <InputText id="telephone" v-model.trim="hairdresser.telephone" required="true" autofocus :invalid="submitted && !hairdresser.telephone" />
                    <small class="p-invalid" v-if="submitted && !hairdresser.telephone">Name is required.</small>
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
                        <Button label="Salvar" icon="pi pi-check" text="" @click="saveHairdresser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteHairdressersDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="hairdresser"
                            >Are you sure you want to delete <b>{{ hairdresser.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteHairdressersDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedHairdressers" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deletHairdressersDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="hairdresser">Are you sure you want to delete the selected hairdressers?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deletHairdressersDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedHairdressers" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style>
.button-novo{
    background-color: #D4A249;
}
</style>
