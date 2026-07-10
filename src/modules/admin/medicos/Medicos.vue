<script setup>
import { ref } from 'vue';
import { useMedicosStore } from '../../../stores/medicos';
import { useEspecialidadesStore } from '../../../stores/especialidades';
import ModalMedico from './ModalMedico.vue';
import DropdownMenu from '../../../components/DropdownMenu.vue';

const medicos = useMedicosStore();
const especialidades = useEspecialidadesStore();

const showModal = ref(false);
const editando = ref(null);

function nombreEspecialidad(id) {
  return especialidades.items.find((e) => e.id === id)?.nombre ?? '—';
}

function abrirNuevo() {
  editando.value = null;
  showModal.value = true;
}

function abrirEditar(item) {
  editando.value = { ...item };
  showModal.value = true;
}

function acciones(m) {
  return [
    { label: 'Editar', action: () => abrirEditar(m) },
    {
      label: m.estado === 'activo' ? 'Desactivar' : 'Activar',
      action: () => medicos.toggleEstado(m.id),
      danger: m.estado === 'activo',
    },
  ];
}

const BADGE = {
  activo: 'bg-green-100 text-green-700',
  inactivo: 'bg-gray-200 text-gray-600',
};

const AVATAR_PALETTE = [
  { bg: '#BFDBFE', color: '#1D4ED8' },
  { bg: '#DDD6FE', color: '#6D28D9' },
  { bg: '#FBCFE8', color: '#BE185D' },
  { bg: '#99F6E4', color: '#0F766E' },
  { bg: '#FED7AA', color: '#C2410C' },
  { bg: '#FECACA', color: '#B91C1C' },
  { bg: '#C7D2FE', color: '#4338CA' },
  { bg: '#BBF7D0', color: '#15803D' },
];
function avatarStyle(nombre) {
  const p = AVATAR_PALETTE[nombre.charCodeAt(0) % AVATAR_PALETTE.length];
  return { backgroundColor: p.bg, color: p.color };
}
</script>

<template>
  <div class="px-10 py-8">
    <!-- Header -->
    <div class="flex items-start justify-between mb-8">
      <div>
        <h1 class="text-4xl font-bold tracking-tight text-slate-900">Médicos</h1>
        <p class="text-base text-slate-500 mt-1">Gestiona el equipo médico de la clínica</p>
      </div>
      <button @click="abrirNuevo" class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold text-base rounded-xl hover:bg-blue-500 transition-all shadow-sm">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo médico
      </button>
    </div>

    <!-- Table card -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-200 border-b border-gray-200">
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Médico</th>
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Documento</th>
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Especialidad</th>
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Contacto</th>
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Estado</th>
            <th class="px-6 py-3.5" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in medicos.items" :key="m.id" class="hover:bg-slate-50/70 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" :style="avatarStyle(m.nombres)">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="font-semibold text-slate-900">{{ m.nombres }} {{ m.apellidos }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-slate-500">{{ m.documento }}</td>
            <td class="px-6 py-4 text-slate-600">{{ nombreEspecialidad(m.especialidadId) }}</td>
            <td class="px-6 py-4">
              <div class="text-slate-700">{{ m.email || '—' }}</div>
              <div class="text-sm text-slate-400">{{ m.telefono || '' }}</div>
            </td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold capitalize" :class="BADGE[m.estado]">
                {{ m.estado }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <DropdownMenu :items="acciones(m)" />
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!medicos.items.length" class="py-16 text-center text-slate-400">No hay médicos registrados.</div>
    </div>
  </div>

  <ModalMedico :show="showModal" :editando="editando" @close="showModal = false" />
</template>
