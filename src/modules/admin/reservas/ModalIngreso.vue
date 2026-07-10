<script setup>
import { ref, watch } from 'vue';
import { useReservasStore } from '../../../stores/reservas';

const props = defineProps({
  show: Boolean,
  reserva: { type: Object, default: null },
});
const emit = defineEmits(['close']);

const reservas = useReservasStore();
const form = ref({ tieneSeguro: true, monto: 0, metodo: 'efectivo' });

watch(
  () => props.show,
  (v) => {
    if (v) form.value = { tieneSeguro: true, monto: 0, metodo: 'efectivo' };
  },
);

function submit() {
  reservas.registrarIngreso(props.reserva.id, {
    ...form.value,
    monto: form.value.tieneSeguro ? 0 : Number(form.value.monto),
  });
  emit('close');
}

const inputClass =
  'w-full border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors';
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
        <div class="bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 w-full max-w-md mx-4">
          <div class="flex items-center justify-between px-8 py-5 border-b border-slate-100">
            <h2 class="text-2xl font-bold text-slate-900">Registrar ingreso y pago</h2>
            <button @click="emit('close')" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="reserva" class="px-8 pt-5">
            <div class="bg-slate-50 ring-1 ring-slate-200/60 rounded-xl px-5 py-4 space-y-1">
              <div class="text-sm">
                <span class="font-semibold text-slate-700">Paciente:</span> <span class="text-slate-600">{{ reserva.paciente }}</span>
              </div>
              <div class="text-sm">
                <span class="font-semibold text-slate-700">Fecha / Hora:</span> <span class="text-slate-600">{{ reserva.fecha }} — {{ reserva.hora }}</span>
              </div>
            </div>
          </div>

          <form @submit.prevent="submit" class="px-8 py-6 space-y-5">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-3">Cobertura de seguro</label>
              <div class="flex gap-5">
                <label class="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" v-model="form.tieneSeguro" :value="true" class="accent-blue-600 w-4 h-4" />
                  <span class="text-base text-slate-700">Seguro vigente</span>
                </label>
                <label class="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" v-model="form.tieneSeguro" :value="false" class="accent-blue-600 w-4 h-4" />
                  <span class="text-base text-slate-700">Pago directo</span>
                </label>
              </div>
            </div>

            <template v-if="!form.tieneSeguro">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Monto a cobrar (S/.) *</label>
                <input v-model="form.monto" type="number" min="0" step="0.50" placeholder="0.00" :class="inputClass" required />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Método de pago</label>
                <select v-model="form.metodo" :class="inputClass">
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>
            </template>

            <div v-if="form.tieneSeguro" class="flex items-center gap-3 text-sm text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100 rounded-xl px-5 py-4">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Seguro vigente — no se requiere pago adicional.
            </div>

            <div class="flex justify-end gap-2.5 pt-1">
              <button type="button" @click="emit('close')" class="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors">Cancelar</button>
              <button type="submit" class="px-4 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-sm">Confirmar ingreso</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
