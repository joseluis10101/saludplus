<script setup>
import { ref, computed } from 'vue';
import { useReservasStore } from '../../../stores/reservas';
import { useMedicosStore } from '../../../stores/medicos';
import { useEspecialidadesStore } from '../../../stores/especialidades';
import ModalIngreso from './ModalIngreso.vue';
import ModalReserva from './ModalReserva.vue';

const reservas = useReservasStore();
const medicos = useMedicosStore();
const especialidades = useEspecialidadesStore();

const showIngreso = ref(false);
const showReserva = ref(false);
const reservaActiva = ref(null);
const filtroEstado = ref('todos');

function confirmarCancelar(id) {
  if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) reservas.cancelar(id);
}

const lista = computed(() => {
  if (filtroEstado.value === 'todos') return reservas.items;
  return reservas.items.filter((r) => r.estado === filtroEstado.value);
});

function nombreMedico(id) {
  const m = medicos.items.find((m) => m.id === id);
  return m ? `${m.nombres} ${m.apellidos}` : '—';
}
function nombreEspecialidad(id) {
  return especialidades.items.find((e) => e.id === id)?.nombre ?? '—';
}

function abrirIngreso(r) {
  reservaActiva.value = { ...r };
  showIngreso.value = true;
}

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

const ESTADO_BADGE = {
  reservada: 'bg-blue-100 text-blue-700',
  en_espera: 'bg-amber-100 text-amber-700',
  atendida: 'bg-green-100 text-green-700',
  cancelada: 'bg-gray-200 text-gray-600',
};
const ESTADO_LABEL = {
  reservada: 'Reservada',
  en_espera: 'En espera',
  atendida: 'Atendida',
  cancelada: 'Cancelada',
};
</script>

<template>
  <div class="px-10 py-8">
    <!-- Header -->
    <div class="flex items-start justify-between mb-8">
      <div>
        <h1 class="text-4xl font-bold tracking-tight text-slate-900">Reservas</h1>
        <p class="text-base text-slate-500 mt-1">Gestiona el flujo de citas del día</p>
      </div>
      <div class="flex items-center gap-2.5">
        <select
          v-model="filtroEstado"
          class="border border-slate-200 rounded-xl px-4 py-2.5 text-base bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-colors"
        >
          <option value="todos">Todos los estados</option>
          <option value="reservada">Reservada</option>
          <option value="en_espera">En espera</option>
          <option value="atendida">Atendida</option>
          <option value="cancelada">Cancelada</option>
        </select>
        <button @click="showReserva = true" class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold text-base rounded-xl hover:bg-blue-500 transition-all shadow-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nueva reserva
        </button>
      </div>
    </div>

    <!-- Table card -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-200 border-b border-gray-200">
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Paciente</th>
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Fecha / Hora</th>
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Médico</th>
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Pago</th>
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Estado</th>
            <th class="px-6 py-3.5" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in lista" :key="r.id" class="hover:bg-slate-50/70 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0" :style="avatarStyle(r.paciente)">
                  <span class="text-sm font-bold">{{ r.paciente[0] }}</span>
                </div>
                <div>
                  <div class="font-semibold text-slate-900">{{ r.paciente }}</div>
                  <div class="text-sm text-slate-400">{{ r.documento }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="font-medium text-slate-700">{{ r.fecha }}</div>
              <div class="text-sm text-slate-400">{{ r.hora }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="font-medium text-slate-700">{{ nombreMedico(r.medicoId) }}</div>
              <div class="text-sm text-slate-400">{{ nombreEspecialidad(r.especialidadId) }}</div>
            </td>
            <td class="px-6 py-4">
              <template v-if="r.pago">
                <span v-if="r.pago.tieneSeguro" class="font-medium text-emerald-600">Seguro</span>
                <span v-else class="text-slate-600">S/. {{ r.pago.monto }} · {{ r.pago.metodo }}</span>
              </template>
              <span v-else class="text-slate-300">—</span>
            </td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold" :class="ESTADO_BADGE[r.estado]">
                {{ ESTADO_LABEL[r.estado] }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <template v-if="r.estado === 'reservada' || r.estado === 'en_espera'">
                  <button
                    v-if="r.estado === 'reservada'"
                    @click="abrirIngreso(r)"
                    class="px-3 py-1.5 text-sm font-semibold text-blue-600 border border-blue-200 bg-white rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
                  >
                    Registrar ingreso
                  </button>
                  <button @click="confirmarCancelar(r.id)" class="px-3 py-1.5 text-sm font-semibold text-red-500 border border-red-200 bg-white rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap">
                    Cancelar
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!lista.length" class="py-16 text-center text-slate-400">No hay reservas con el filtro seleccionado.</div>
    </div>
  </div>

  <ModalIngreso :show="showIngreso" :reserva="reservaActiva" @close="showIngreso = false" />
  <ModalReserva :show="showReserva" @close="showReserva = false" />
</template>
