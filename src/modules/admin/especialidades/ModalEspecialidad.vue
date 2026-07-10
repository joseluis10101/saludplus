<script setup>
import { ref, watch } from 'vue';
import { useEspecialidadesStore } from '../../../stores/especialidades';

const props = defineProps({
  show: Boolean,
  editando: { type: Object, default: null },
});
const emit = defineEmits(['close']);

const store = useEspecialidadesStore();
const form = ref({ nombre: '', descripcion: '' });

watch(
  () => props.show,
  (v) => {
    if (v) form.value = props.editando ? { nombre: props.editando.nombre, descripcion: props.editando.descripcion } : { nombre: '', descripcion: '' };
  },
);

function submit() {
  if (!form.value.nombre.trim()) return;
  if (props.editando) {
    store.actualizar(props.editando.id, form.value);
  } else {
    store.crear(form.value);
  }
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
            <h2 class="text-2xl font-bold text-slate-900">
              {{ editando ? 'Editar especialidad' : 'Nueva especialidad' }}
            </h2>
            <button @click="emit('close')" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submit" class="px-8 py-6 space-y-5">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Nombre *</label>
              <input v-model="form.nombre" type="text" placeholder="Ej. Cardiología" :class="inputClass" required />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Descripción</label>
              <textarea v-model="form.descripcion" rows="3" placeholder="Descripción breve de la especialidad" :class="inputClass + ' resize-none'" />
            </div>

            <div class="flex justify-end gap-2.5 pt-1">
              <button type="button" @click="emit('close')" class="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors">Cancelar</button>
              <button type="submit" class="px-4 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-sm">
                {{ editando ? 'Guardar cambios' : 'Crear especialidad' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
