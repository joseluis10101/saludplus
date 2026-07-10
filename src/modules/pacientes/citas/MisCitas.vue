<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useReservasStore } from '../../../stores/reservas';
import { useMedicosStore } from '../../../stores/medicos';
import { useEspecialidadesStore } from '../../../stores/especialidades';
import { usePacientesStore } from '../../../stores/pacientes';
import { useSesionPacienteStore } from '../../../stores/sesionPaciente';
import ModalDetalleAtencion from './ModalDetalleAtencion.vue';

const router = useRouter();
const reservas = useReservasStore();
const medicos = useMedicosStore();
const especialidades = useEspecialidadesStore();
const pacientes = usePacientesStore();
const sesion = useSesionPacienteStore();

const paciente = computed(() => pacientes.items.find((p) => p.id === sesion.pacienteId));

const misCitas = computed(() => (paciente.value ? reservas.items.filter((r) => r.documento === paciente.value.documento) : []));

const proximas = computed(() => misCitas.value.filter((r) => r.estado === 'reservada' || r.estado === 'en_espera'));
const pasadas = computed(() => misCitas.value.filter((r) => r.estado === 'atendida' || r.estado === 'cancelada'));

function nombreMedico(id) {
  const m = medicos.items.find((m) => m.id === id);
  return m ? `Dr(a). ${m.nombres} ${m.apellidos}` : '—';
}
function nombreEspecialidad(id) {
  return especialidades.items.find((e) => e.id === id)?.nombre ?? '—';
}

function confirmarCancelar(id) {
  if (confirm('¿Deseas cancelar esta cita?')) reservas.cancelar(id);
}

const showDetalle = ref(false);
const citaActiva = ref(null);

function verDetalle(r) {
  citaActiva.value = r;
  showDetalle.value = true;
}

const ESTADO_BADGE = {
  reservada: 'bg-sky-50 text-sky-700 border border-sky-200',
  en_espera: 'bg-amber-50 text-amber-700 border border-amber-200',
  atendida: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  cancelada: 'bg-stone-100 text-stone-600 border border-stone-200',
};
const ESTADO_LABEL = {
  reservada: 'Reservada',
  en_espera: 'En espera',
  atendida: 'Atendida',
  cancelada: 'Cancelada',
};
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-12">
    <div class="flex flex-wrap items-center justify-between gap-4 mb-10">
      <div>
        <h1 class="text-4xl font-bold tracking-tight text-stone-900">Mis Citas</h1>
      </div>
      <button @click="router.push('/paciente/nueva-cita')" class="flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white font-semibold text-base rounded-xl hover:bg-blue-800 transition-colors shadow-sm">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Programar nueva cita
      </button>
    </div>

    <!-- Próximas -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-stone-800 mb-4">Próximas citas</h2>
      <div v-if="proximas.length" class="space-y-4">
        <div v-for="r in proximas" :key="r.id" class="bg-white rounded-2xl shadow-sm border border-stone-200 px-8 py-6 flex flex-wrap items-center justify-between gap-6">
          <div class="flex items-center gap-5">
            <div class="w-16 h-16 rounded-xl bg-blue-700 flex flex-col items-center justify-center text-white shrink-0">
              <span class="text-xs font-semibold uppercase leading-none">{{ r.fecha.slice(5, 7) }}/{{ r.fecha.slice(8, 10) }}</span>
              <span class="text-lg font-black leading-tight">{{ r.hora }}</span>
            </div>
            <div>
              <p class="text-xl font-bold text-stone-900">{{ nombreEspecialidad(r.especialidadId) }}</p>
              <p class="text-base text-stone-500">{{ nombreMedico(r.medicoId) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold" :class="ESTADO_BADGE[r.estado]">
              {{ ESTADO_LABEL[r.estado] }}
            </span>
            <button
              v-if="r.estado === 'reservada'"
              @click="confirmarCancelar(r.id)"
              class="px-4 py-2 text-base font-semibold text-rose-600 border-2 border-stone-300 bg-white rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
      <div v-else class="bg-white rounded-2xl border border-stone-200 py-16 text-center text-stone-400 text-lg">No tienes citas próximas.</div>
    </section>

    <!-- Pasadas -->
    <section v-if="pasadas.length">
      <h2 class="text-2xl font-bold text-stone-800 mb-4">Historial</h2>
      <div class="space-y-4">
        <div v-for="r in pasadas" :key="r.id" class="bg-white/70 rounded-2xl border border-stone-200 px-8 py-6 flex flex-wrap items-center justify-between gap-6">
          <div class="flex items-center gap-5">
            <div class="w-16 h-16 rounded-xl bg-stone-200 flex flex-col items-center justify-center text-stone-500 shrink-0">
              <span class="text-xs font-semibold uppercase leading-none">{{ r.fecha.slice(5, 7) }}/{{ r.fecha.slice(8, 10) }}</span>
              <span class="text-lg font-black leading-tight">{{ r.hora }}</span>
            </div>
            <div>
              <p class="text-xl font-bold text-stone-700">{{ nombreEspecialidad(r.especialidadId) }}</p>
              <p class="text-base text-stone-400">{{ nombreMedico(r.medicoId) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold" :class="ESTADO_BADGE[r.estado]">
              {{ ESTADO_LABEL[r.estado] }}
            </span>
            <button
              v-if="r.estado === 'atendida'"
              @click="verDetalle(r)"
              class="px-4 py-2 text-base font-semibold text-blue-700 border-2 border-stone-300 bg-white rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors"
            >
              Ver detalle
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>

  <ModalDetalleAtencion :show="showDetalle" :reserva="citaActiva" @close="showDetalle = false" />
</template>
