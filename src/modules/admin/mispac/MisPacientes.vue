<script setup>
import { ref, computed } from 'vue';
import { useReservasStore } from '../../../stores/reservas';
import { useMedicosStore } from '../../../stores/medicos';
import { useEspecialidadesStore } from '../../../stores/especialidades';
import ModalAtencion from '../reservas/ModalAtencion.vue';

const reservas = useReservasStore();
const medicos = useMedicosStore();
const especialidades = useEspecialidadesStore();

const showAtencion = ref(false);
const reservaActiva = ref(null);
const filtroMedico = ref('');

const lista = computed(() => {
  return reservas.items.filter((r) => {
    if (r.estado !== 'en_espera' && r.estado !== 'atendida') return false;
    if (filtroMedico.value && r.medicoId !== Number(filtroMedico.value)) return false;
    return true;
  });
});

function nombreMedico(id) {
  const m = medicos.items.find((m) => m.id === id);
  return m ? `${m.nombres} ${m.apellidos}` : '—';
}
function nombreEspecialidad(id) {
  return especialidades.items.find((e) => e.id === id)?.nombre ?? '—';
}

function abrirAtencion(r) {
  reservaActiva.value = { ...r };
  showAtencion.value = true;
}

function labelBoton(r) {
  if (r.estado === 'en_espera') return 'Registrar atención';
  if (r.estado === 'atendida') return 'Ver atención';
  return null;
}

const ESTADO_BADGE = {
  en_espera: 'bg-amber-100 text-amber-700',
  atendida: 'bg-green-100 text-green-700',
};
const ESTADO_LABEL = {
  en_espera: 'En espera',
  atendida: 'Atendida',
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
        <h1 class="text-4xl font-bold tracking-tight text-slate-900">Mis Pacientes</h1>
        <p class="text-base text-slate-500 mt-1">Pacientes en espera o ya atendidos</p>
      </div>
      <select
        v-model="filtroMedico"
        class="border border-slate-200 rounded-xl px-4 py-2.5 text-base bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-colors"
      >
        <option value="">Todos los médicos</option>
        <option v-for="m in medicos.items" :key="m.id" :value="m.id">{{ m.nombres }} {{ m.apellidos }}</option>
      </select>
    </div>

    <!-- Table card -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-200 border-b border-gray-200">
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Paciente</th>
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Fecha / Hora</th>
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Médico</th>
            <th class="text-left px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Estado</th>
            <th class="px-6 py-3.5" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in lista" :key="r.id" class="hover:bg-slate-50/70 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" :style="avatarStyle(r.paciente)">
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
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold" :class="ESTADO_BADGE[r.estado]">
                {{ ESTADO_LABEL[r.estado] }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button
                v-if="labelBoton(r)"
                @click="abrirAtencion(r)"
                class="px-3 py-1.5 text-sm font-semibold text-blue-600 border border-blue-200 bg-white rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                {{ labelBoton(r) }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!lista.length" class="py-16 text-center text-slate-400">No hay pacientes en espera ni atendidos.</div>
    </div>
  </div>

  <ModalAtencion :show="showAtencion" :reserva="reservaActiva" @close="showAtencion = false" />
</template>
