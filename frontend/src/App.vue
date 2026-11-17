<script setup>
import { ref, onMounted } from 'vue';

const medicos = ref([]);
const agendamentos = ref([]);
const filtroMedico = ref('');
const filtroData = ref('');
const form = ref({ medico_id: '', paciente_nome: '', data_hora: '', observacao: '' });

async function carregarMedicos() {
    const resposta = await fetch('/api/medicos');
    medicos.value = await resposta.json();
}

async function buscar() {
    const resposta = await fetch(`/api/agendamentos?medico_id=${filtroMedico.value}&data=${filtroData.value}`);
    agendamentos.value = await resposta.json();
}

async function salvar() {
    await fetch('/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
    });
    form.value = { medico_id: '', paciente_nome: '', data_hora: '', observacao: '' };
    buscar();
}

async function remover(id) {
    await fetch(`/api/agendamentos/${id}`, { method: 'DELETE' });
    agendamentos.value = agendamentos.value.filter(a => a.id !== id);
}

function formatarData(dataHora) {
    const [data, hora] = dataHora.split(' ');
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano} ${hora.slice(0, 5)}`;
}

onMounted(() => {
    carregarMedicos();
    buscar();
});
</script>

<template>
    <h1>Agendamento Médico</h1>

    <h2>Filtros</h2>
    <select v-model="filtroMedico">
        <option value="">Todos</option>
        <option v-for="m in medicos" :key="m.id" :value="m.id">{{ m.nome }}</option>
    </select>
    <input type="date" v-model="filtroData" />
    <button @click="buscar">Buscar</button>

    <h2>Novo agendamento</h2>
    <form @submit.prevent="salvar">
        <select v-model="form.medico_id">
            <option value="">Médico</option>
            <option v-for="m in medicos" :key="m.id" :value="m.id">{{ m.nome }}</option>
        </select>
        <input v-model="form.paciente_nome" placeholder="Paciente" />
        <input type="datetime-local" v-model="form.data_hora" />
        <input v-model="form.observacao" placeholder="Observação" />
        <button>Agendar</button>
    </form>

    <h2>Agendamentos</h2>
    <table border="1">
        <tr>
            <th>ID</th><th>Paciente</th><th>Médico</th><th>Especialidade</th><th>Data/Hora</th><th>Ações</th>
        </tr>
        <tr v-for="a in agendamentos" :key="a.id">
            <td>{{ a.id }}</td>
            <td>{{ a.paciente_nome }}</td>
            <td>{{ a.medico }}</td>
            <td>{{ a.especialidade }}</td>
            <td>{{ formatarData(a.data_hora) }}</td>
            <td><button @click="remover(a.id)">Cancelar / Remover</button></td>
        </tr>
    </table>
</template>
