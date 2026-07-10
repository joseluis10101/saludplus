<script setup>
import { ref, watch } from 'vue';
import { useReservasStore } from '../../../stores/reservas';

const props = defineProps({
  show: Boolean,
  reserva: { type: Object, default: null },
});
const emit = defineEmits(['close']);

const reservas = useReservasStore();
const EMPTY = () => ({ diagnostico: '', tratamiento: '', medicamentos: '', indicaciones: '', examenes: '' });
const form = ref(EMPTY());

watch(
  () => props.show,
  (v) => {
    form.value = v && props.reserva?.atencion ? { ...props.reserva.atencion } : EMPTY();
  },
);

function submit() {
  if (!form.value.diagnostico.trim()) return;
  reservas.registrarAtencion(props.reserva.id, { ...form.value });
  emit('close');
}

const inputClass =
  'w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none';
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
        <div class="bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 w-full max-w-xl mx-4 max-h-[90vh] flex flex-col">
          <div class="flex items-center justify-between px-8 py-5 border-b border-slate-100 shrink-0">
            <h2 class="text-2xl font-bold text-slate-900">Registrar atención médica</h2>
            <button @click="emit('close')" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="reserva" class="px-8 pt-5 shrink-0">
            <div class="bg-slate-50 ring-1 ring-slate-200/60 rounded-xl px-5 py-4 space-y-1">
              <div class="text-sm">
                <span class="font-semibold text-slate-700">Paciente:</span> <span class="text-slate-600">{{ reserva.paciente }}</span>
              </div>
              <div class="text-sm">
                <span class="font-semibold text-slate-700">Fecha / Hora:</span> <span class="text-slate-600">{{ reserva.fecha }} — {{ reserva.hora }}</span>
              </div>
            </div>
          </div>

          <form @submit.prevent="submit" class="px-8 py-6 space-y-4 overflow-y-auto flex-1">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Diagnóstico *</label>
              <textarea v-model="form.diagnostico" rows="2" placeholder="Diagnóstico principal" :class="inputClass" required />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Tratamiento indicado</label>
              <textarea v-model="form.tratamiento" rows="2" placeholder="Descripción del tratamiento" :class="inputClass" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Medicamentos recetados</label>
              <textarea v-model="form.medicamentos" rows="2" placeholder="Ej. Ibuprofeno 400mg c/8h x 5 días" :class="inputClass" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Indicaciones de continuidad</label>
              <textarea v-model="form.indicaciones" rows="2" placeholder="Ej. Control en 2 semanas, reposo relativo" :class="inputClass" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Solicitud de exámenes</label>
              <textarea v-model="form.examenes" rows="2" placeholder="Ej. Hemograma completo, rayos X de tórax" :class="inputClass" />
            </div>

            <div class="flex justify-end gap-2.5 pt-1 sticky bottom-0 bg-white pb-1">
              <button type="button" @click="emit('close')" class="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors">Cancelar</button>
              <button type="submit" class="px-4 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-sm">Guardar atención</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
