<script setup>
import { ref } from 'vue';
import { useEspecialidadesStore } from '../../../stores/especialidades';
import ModalEspecialidad from './ModalEspecialidad.vue';
import DropdownMenu from '../../../components/DropdownMenu.vue';

const store = useEspecialidadesStore();
const showModal = ref(false);
const editando = ref(null);

function abrirNueva() {
  editando.value = null;
  showModal.value = true;
}

function abrirEditar(item) {
  editando.value = { ...item };
  showModal.value = true;
}

function acciones(item) {
  return [
    { label: 'Editar', action: () => abrirEditar(item) },
    {
      label: item.estado === 'activo' ? 'Desactivar' : 'Activar',
      action: () => store.toggleEstado(item.id),
      danger: item.estado === 'activo',
    },
  ];
}

const BADGE = {
  activo: 'bg-green-100 text-green-700',
  inactivo: 'bg-gray-200 text-gray-600',
};
</script>

<template>
  <div class="px-10 py-8">
    <!-- Header -->
    <div class="flex items-start justify-between mb-8">
      <div>
        <h1 class="text-4xl font-bold tracking-tight text-slate-900">Especialidades</h1>
        <p class="text-base text-slate-500 mt-1">Gestiona las especialidades médicas de la clínica</p>
      </div>
      <button @click="abrirNueva" class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold text-base rounded-xl hover:bg-blue-500 transition-all shadow-sm">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Nueva especialidad
      </button>
    </div>

    <!-- Table card -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-200 border-b border-gray-200">
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Nombre</th>
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Descripción</th>
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Estado</th>
            <th class="px-6 py-3.5" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in store.items" :key="item.id" class="hover:bg-slate-50/70 transition-colors">
            <td class="px-6 py-4 font-semibold text-slate-900">{{ item.nombre }}</td>
            <td class="px-6 py-4 text-slate-500">{{ item.descripcion || '—' }}</td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold capitalize" :class="BADGE[item.estado]">
                {{ item.estado }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <DropdownMenu :items="acciones(item)" />
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!store.items.length" class="py-16 text-center text-slate-400">No hay especialidades registradas.</div>
    </div>
  </div>

  <ModalEspecialidad :show="showModal" :editando="editando" @close="showModal = false" />
</template>
