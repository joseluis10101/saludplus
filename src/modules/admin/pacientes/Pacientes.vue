<script setup>
import { ref, computed } from 'vue';
import { usePacientesStore } from '../../../stores/pacientes';
import { useReservasStore } from '../../../stores/reservas';
import ModalPaciente from './ModalPaciente.vue';
import DropdownMenu from '../../../components/DropdownMenu.vue';

const pacientes = usePacientesStore();
const reservas = useReservasStore();

const showModal = ref(false);
const editando = ref(null);

function abrirNuevo() {
  editando.value = null;
  showModal.value = true;
}

function abrirEditar(p) {
  editando.value = { ...p };
  showModal.value = true;
}

function acciones(p) {
  return [{ label: 'Editar', action: () => abrirEditar(p) }];
}

function citasCount(documento) {
  return reservas.items.filter((r) => r.documento === documento).length;
}

function edad(fechaNacimiento) {
  const hoy = new Date();
  const nac = new Date(fechaNacimiento);
  let años = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) años--;
  return años;
}

function formatFecha(fecha) {
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const total = computed(() => pacientes.items.length);

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
        <h1 class="text-4xl font-bold tracking-tight text-slate-900">Pacientes</h1>
        <p class="text-base text-slate-500 mt-1">{{ total }} paciente{{ total !== 1 ? 's' : '' }} registrado{{ total !== 1 ? 's' : '' }}</p>
      </div>
      <button @click="abrirNuevo" class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold text-base rounded-xl hover:bg-blue-500 transition-all shadow-sm">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo paciente
      </button>
    </div>

    <!-- Table card -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-200 border-b border-gray-200">
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Paciente</th>
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Documento</th>
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Nacimiento</th>
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Contacto</th>
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Citas</th>
            <th class="px-6 py-3.5" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in pacientes.items" :key="p.id" class="hover:bg-slate-50/70 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" :style="avatarStyle(p.nombres)">
                  <span class="text-sm font-bold">{{ p.nombres[0] }}</span>
                </div>
                <div>
                  <p class="font-semibold text-slate-900">{{ p.nombres }} {{ p.apellidos }}</p>
                  <p class="text-sm text-slate-400">{{ p.sexo === 'M' ? 'Masculino' : 'Femenino' }}</p>
                </div>
              </div>
            </td>

            <td class="px-6 py-4">
              <p class="font-medium text-slate-700">{{ p.documento }}</p>
              <p class="text-sm text-slate-400">{{ p.tipoDoc }}</p>
            </td>

            <td class="px-6 py-4">
              <p class="text-slate-700">{{ formatFecha(p.fechaNacimiento) }}</p>
              <p class="text-sm text-slate-400">{{ edad(p.fechaNacimiento) }} años</p>
            </td>

            <td class="px-6 py-4">
              <p class="text-slate-700">{{ p.email || '—' }}</p>
              <p class="text-sm text-slate-400">{{ p.telefono || '' }}</p>
            </td>

            <td class="px-6 py-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold" :class="citasCount(p.documento) > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'">
                {{ citasCount(p.documento) }} cita{{ citasCount(p.documento) !== 1 ? 's' : '' }}
              </span>
            </td>

            <td class="px-6 py-4 text-right">
              <DropdownMenu :items="acciones(p)" />
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!pacientes.items.length" class="py-16 text-center text-slate-400">No hay pacientes registrados.</div>
    </div>
  </div>

  <ModalPaciente :show="showModal" :editando="editando" @close="showModal = false" />
</template>
