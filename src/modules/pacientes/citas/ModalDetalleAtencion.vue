<script setup>
defineProps({
  show: Boolean,
  reserva: { type: Object, default: null },
});
const emit = defineEmits(['close']);

const CAMPOS = [
  { key: 'diagnostico', label: 'Diagnóstico' },
  { key: 'tratamiento', label: 'Tratamiento indicado' },
  { key: 'medicamentos', label: 'Medicamentos recetados' },
  { key: 'indicaciones', label: 'Indicaciones de continuidad' },
  { key: 'examenes', label: 'Exámenes solicitados' },
];
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
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4 text-lg">
        <div class="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-xl max-h-[85vh] flex flex-col">
          <div class="flex items-center justify-between px-8 py-6 border-b border-stone-200 shrink-0">
            <h2 class="text-2xl font-bold text-stone-900">Detalle de la atención</h2>
            <button @click="emit('close')" class="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-blue-700 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="reserva" class="px-8 pt-6 shrink-0">
            <div class="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4">
              <p class="text-lg font-bold text-blue-900">{{ reserva.fecha }} · {{ reserva.hora }}</p>
            </div>
          </div>

          <div class="px-8 py-6 space-y-5 overflow-y-auto flex-1">
            <div v-for="campo in CAMPOS" :key="campo.key">
              <p class="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-1.5">{{ campo.label }}</p>
              <p class="text-base text-stone-800 whitespace-pre-line">
                {{ reserva?.atencion?.[campo.key] || 'No registrado' }}
              </p>
            </div>
          </div>

          <div class="px-8 py-5 border-t border-stone-200 shrink-0">
            <button @click="emit('close')" class="w-full py-3 text-base font-semibold bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-colors">Cerrar</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
