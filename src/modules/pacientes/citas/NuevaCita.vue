<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useReservasStore } from '../../../stores/reservas';
import { useMedicosStore } from '../../../stores/medicos';
import { useEspecialidadesStore } from '../../../stores/especialidades';
import { usePacientesStore } from '../../../stores/pacientes';
import { useSesionPacienteStore } from '../../../stores/sesionPaciente';

const router = useRouter();
const reservas = useReservasStore();
const medicos = useMedicosStore();
const especialidades = useEspecialidadesStore();
const pacientes = usePacientesStore();
const sesion = useSesionPacienteStore();

const paciente = computed(() => pacientes.items.find((p) => p.id === sesion.pacienteId));

const form = ref({ especialidadId: '', medicoId: '', fecha: '', hora: '' });

const especialidadesActivas = computed(() => especialidades.items.filter((e) => e.estado === 'activo'));

const medicosFiltrados = computed(() => (form.value.especialidadId ? medicos.items.filter((m) => m.especialidadId === Number(form.value.especialidadId) && m.estado === 'activo') : []));

const HORAS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

const horasDisponibles = computed(() => {
  if (!form.value.medicoId || !form.value.fecha) return [];
  const ocupadas = reservas.items.filter((r) => r.medicoId === Number(form.value.medicoId) && r.fecha === form.value.fecha && r.estado !== 'cancelada').map((r) => r.hora);
  return HORAS.filter((h) => !ocupadas.includes(h));
});

function seleccionarEspecialidad(id) {
  form.value.especialidadId = id;
  form.value.medicoId = '';
  form.value.hora = '';
}
function seleccionarMedico(id) {
  form.value.medicoId = id;
  form.value.hora = '';
}

const puedeConfirmar = computed(() => form.value.especialidadId && form.value.medicoId && form.value.fecha && form.value.hora);

function confirmar() {
  if (!puedeConfirmar.value || !paciente.value) return;
  reservas.crear({
    paciente: `${paciente.value.nombres} ${paciente.value.apellidos}`,
    documento: paciente.value.documento,
    medicoId: Number(form.value.medicoId),
    especialidadId: Number(form.value.especialidadId),
    fecha: form.value.fecha,
    hora: form.value.hora,
  });
  router.push('/paciente/citas');
}

const medicoSeleccionado = computed(() => medicos.items.find((m) => m.id === Number(form.value.medicoId)));
const especialidadSeleccionada = computed(() => especialidades.items.find((e) => e.id === Number(form.value.especialidadId)));

const hoy = new Date().toISOString().slice(0, 10);
</script>

<template>
  <div class="max-w-3xl mx-auto px-6 py-12">
    <button @click="router.push('/paciente/citas')" class="flex items-center gap-2 text-base font-semibold text-blue-700 hover:text-blue-800 mb-6">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Volver a mis citas
    </button>

    <h1 class="text-4xl font-bold tracking-tight text-stone-900 mb-1">Programar nueva cita</h1>
    <p class="text-lg text-stone-500 mb-10">Elige la especialidad, el médico y el horario que prefieras</p>

    <div class="bg-white rounded-2xl shadow-sm border border-stone-200 px-8 py-10 space-y-10">
      <!-- Especialidad -->
      <div>
        <p class="text-xl font-bold text-stone-800 mb-4">1. Especialidad</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button
            v-for="e in especialidadesActivas"
            :key="e.id"
            type="button"
            @click="seleccionarEspecialidad(e.id)"
            class="px-4 py-4 rounded-xl text-base font-semibold border-2 transition-all text-left"
            :class="Number(form.especialidadId) === e.id ? 'border-blue-700 bg-blue-50 text-blue-700' : 'border-stone-200 bg-white text-stone-600 hover:border-blue-200'"
          >
            {{ e.nombre }}
          </button>
        </div>
      </div>

      <!-- Médico -->
      <div v-if="form.especialidadId">
        <p class="text-xl font-bold text-stone-800 mb-4">2. Médico</p>
        <div v-if="medicosFiltrados.length" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            v-for="m in medicosFiltrados"
            :key="m.id"
            type="button"
            @click="seleccionarMedico(m.id)"
            class="flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all text-left"
            :class="Number(form.medicoId) === m.id ? 'border-blue-700 bg-blue-50' : 'border-stone-200 bg-white hover:border-blue-200'"
          >
            <div class="w-11 h-11 rounded-full bg-blue-700 flex items-center justify-center shrink-0">
              <span class="text-base font-bold text-white">{{ m.nombres[0] }}</span>
            </div>
            <span class="text-base font-semibold text-stone-700">Dr(a). {{ m.nombres }} {{ m.apellidos }}</span>
          </button>
        </div>
        <p v-else class="text-base text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">No hay médicos disponibles para esta especialidad.</p>
      </div>

      <!-- Fecha -->
      <div v-if="form.medicoId">
        <p class="text-xl font-bold text-stone-800 mb-4">3. Fecha</p>
        <input
          v-model="form.fecha"
          type="date"
          :min="hoy"
          class="w-full sm:w-64 border-2 border-stone-300 rounded-xl px-5 py-3.5 text-lg text-stone-900 bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition-colors"
          @change="form.hora = ''"
        />
      </div>

      <!-- Hora -->
      <div v-if="form.fecha">
        <p class="text-xl font-bold text-stone-800 mb-4">4. Horario</p>
        <div v-if="horasDisponibles.length" class="grid grid-cols-3 sm:grid-cols-4 gap-3">
          <button
            v-for="h in horasDisponibles"
            :key="h"
            type="button"
            @click="form.hora = h"
            class="px-4 py-3 rounded-xl text-base font-bold border-2 transition-all"
            :class="form.hora === h ? 'border-blue-700 bg-blue-700 text-white' : 'border-stone-200 bg-white text-stone-600 hover:border-blue-200'"
          >
            {{ h }}
          </button>
        </div>
        <p v-else class="text-base text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">No hay horarios disponibles en esta fecha.</p>
      </div>

      <!-- Resumen y confirmar -->
      <div v-if="puedeConfirmar" class="pt-2 border-t border-stone-200">
        <div class="bg-blue-50 border border-blue-100 rounded-xl px-6 py-5 mb-6">
          <p class="text-lg font-bold text-blue-900">{{ especialidadSeleccionada?.nombre }}</p>
          <p class="text-base text-blue-700">Dr(a). {{ medicoSeleccionado?.nombres }} {{ medicoSeleccionado?.apellidos }} · {{ form.fecha }} · {{ form.hora }}</p>
        </div>
        <button @click="confirmar" class="w-full py-4 text-lg font-semibold bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-colors shadow-sm">Confirmar cita</button>
      </div>
    </div>
  </div>
</template>
