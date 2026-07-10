<script setup>
import { ref, computed, watch } from 'vue';
import { useReservasStore } from '../../../stores/reservas';
import { usePacientesStore } from '../../../stores/pacientes';
import { useMedicosStore } from '../../../stores/medicos';
import { useEspecialidadesStore } from '../../../stores/especialidades';

const props = defineProps({ show: Boolean });
const emit = defineEmits(['close']);

const reservas = useReservasStore();
const pacientes = usePacientesStore();
const medicos = useMedicosStore();
const especialidades = useEspecialidadesStore();

const EMPTY = () => ({
  pacienteId: '',
  especialidadId: '',
  medicoId: '',
  fecha: '',
  hora: '',
});
const form = ref(EMPTY());

watch(
  () => props.show,
  (v) => {
    if (v) form.value = EMPTY();
  },
);

const especialidadesActivas = computed(() => especialidades.items.filter((e) => e.estado === 'activo'));

const medicosFiltrados = computed(() => (form.value.especialidadId ? medicos.items.filter((m) => m.especialidadId === Number(form.value.especialidadId) && m.estado === 'activo') : []));

watch(
  () => form.value.especialidadId,
  () => {
    form.value.medicoId = '';
  },
);

const pacienteSeleccionado = computed(() => pacientes.items.find((p) => p.id === Number(form.value.pacienteId)));

function submit() {
  const p = pacienteSeleccionado.value;
  if (!p || !form.value.medicoId || !form.value.fecha || !form.value.hora) return;
  reservas.crear({
    paciente: `${p.nombres} ${p.apellidos}`,
    documento: p.documento,
    medicoId: Number(form.value.medicoId),
    especialidadId: Number(form.value.especialidadId),
    fecha: form.value.fecha,
    hora: form.value.hora,
  });
  emit('close');
}

const inputClass =
  'w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors';

const HORAS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
        <div class="bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 w-full max-w-2xl mx-4">
          <!-- Header -->
          <div class="flex items-center justify-between px-8 py-5 border-b border-slate-100">
            <h2 class="text-2xl font-bold text-slate-900">Nueva reserva</h2>
            <button @click="emit('close')" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submit" class="px-8 py-6 space-y-5">
            <!-- Paciente -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Paciente *</label>
              <select v-model="form.pacienteId" :class="inputClass" required>
                <option value="" disabled>Seleccionar paciente</option>
                <option v-for="p in pacientes.items" :key="p.id" :value="p.id">{{ p.nombres }} {{ p.apellidos }} — {{ p.documento }}</option>
              </select>
            </div>

            <!-- Especialidad / Médico -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Especialidad *</label>
                <select v-model="form.especialidadId" :class="inputClass" required>
                  <option value="" disabled>Seleccionar especialidad</option>
                  <option v-for="e in especialidadesActivas" :key="e.id" :value="e.id">{{ e.nombre }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Médico *</label>
                <select v-model="form.medicoId" :class="inputClass" required :disabled="!form.especialidadId">
                  <option value="" disabled>
                    {{ form.especialidadId ? 'Seleccionar médico' : 'Elige especialidad primero' }}
                  </option>
                  <option v-for="m in medicosFiltrados" :key="m.id" :value="m.id">{{ m.nombres }} {{ m.apellidos }}</option>
                </select>
                <p v-if="form.especialidadId && medicosFiltrados.length === 0" class="text-xs text-amber-600 mt-1.5">No hay médicos activos para esta especialidad.</p>
              </div>
            </div>

            <!-- Fecha / Hora -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Fecha *</label>
                <input v-model="form.fecha" type="date" :class="inputClass" required />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Hora *</label>
                <select v-model="form.hora" :class="inputClass" required>
                  <option value="" disabled>Seleccionar hora</option>
                  <option v-for="h in HORAS" :key="h" :value="h">{{ h }}</option>
                </select>
              </div>
            </div>

            <!-- Resumen paciente -->
            <div v-if="pacienteSeleccionado" class="bg-slate-50 ring-1 ring-slate-200/60 rounded-xl px-5 py-4 space-y-0.5">
              <p class="text-sm font-semibold text-slate-700">{{ pacienteSeleccionado.nombres }} {{ pacienteSeleccionado.apellidos }}</p>
              <p class="text-sm text-slate-500">{{ pacienteSeleccionado.tipoDoc }} {{ pacienteSeleccionado.documento }} · {{ pacienteSeleccionado.email || 'Sin correo' }}</p>
            </div>

            <!-- Acciones -->
            <div class="flex justify-end gap-2.5 pt-1">
              <button type="button" @click="emit('close')" class="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors">Cancelar</button>
              <button type="submit" class="px-4 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-sm">Crear reserva</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
