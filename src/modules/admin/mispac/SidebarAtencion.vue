<script setup>
import { ref, computed, watch } from 'vue';
import { useReservasStore } from '../../../stores/reservas';

const props = defineProps({
  reserva: { type: Object, default: null },
});
const emit = defineEmits(['close']);

const reservas = useReservasStore();
const EMPTY = () => ({ diagnostico: '', tratamiento: '', medicamentos: '', indicaciones: '', examenes: '' });
const form = ref(EMPTY());

const soloLectura = computed(() => props.reserva?.estado === 'atendida');

watch(
  () => props.reserva,
  (r) => {
    form.value = r?.atencion ? { ...r.atencion } : EMPTY();
  },
  { immediate: true },
);

function submit() {
  if (!form.value.diagnostico.trim()) return;
  reservas.registrarAtencion(props.reserva.id, { ...form.value });
  emit('close');
}

const inputClass =
  'w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none disabled:bg-slate-50 disabled:text-slate-500';
</script>

<template>
  <aside class="w-[26rem] shrink-0 border-l border-slate-200 flex flex-col">
    <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
      <h2 class="text-xl font-bold text-slate-900">{{ soloLectura ? 'Atención registrada' : 'Registrar atención médica' }}</h2>
      <button @click="emit('close')" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div v-if="reserva" class="px-6 pt-5 shrink-0">
      <div class="bg-slate-50 ring-1 ring-slate-200/60 rounded-xl px-5 py-4 space-y-1">
        <div class="text-sm">
          <span class="font-semibold text-slate-700">Paciente:</span> <span class="text-slate-600">{{ reserva.paciente }}</span>
        </div>
        <div class="text-sm">
          <span class="font-semibold text-slate-700">Fecha / Hora:</span> <span class="text-slate-600">{{ reserva.fecha }} — {{ reserva.hora }}</span>
        </div>
      </div>
    </div>

    <form @submit.prevent="submit" class="px-6 py-6 space-y-4 overflow-y-auto flex-1">
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Diagnóstico *</label>
        <textarea v-model="form.diagnostico" rows="2" placeholder="Diagnóstico principal" :disabled="soloLectura" :class="inputClass" required />
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Tratamiento indicado</label>
        <textarea v-model="form.tratamiento" rows="2" placeholder="Descripción del tratamiento" :disabled="soloLectura" :class="inputClass" />
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Medicamentos recetados</label>
        <textarea v-model="form.medicamentos" rows="2" placeholder="Ej. Ibuprofeno 400mg c/8h x 5 días" :disabled="soloLectura" :class="inputClass" />
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Indicaciones de continuidad</label>
        <textarea v-model="form.indicaciones" rows="2" placeholder="Ej. Control en 2 semanas, reposo relativo" :disabled="soloLectura" :class="inputClass" />
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Solicitud de exámenes</label>
        <textarea v-model="form.examenes" rows="2" placeholder="Ej. Hemograma completo, rayos X de tórax" :disabled="soloLectura" :class="inputClass" />
      </div>

      <div v-if="!soloLectura" class="flex justify-end pt-1 sticky bottom-0 bg-white pb-1">
        <button type="submit" class="px-4 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-sm">Guardar atención</button>
      </div>
    </form>
  </aside>
</template>
