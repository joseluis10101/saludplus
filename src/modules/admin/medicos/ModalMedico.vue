<script setup>
import { ref, watch, computed } from 'vue';
import { useMedicosStore } from '../../../stores/medicos';
import { useEspecialidadesStore } from '../../../stores/especialidades';

const props = defineProps({
  show: Boolean,
  editando: { type: Object, default: null },
});
const emit = defineEmits(['close']);

const medicos = useMedicosStore();
const especialidades = useEspecialidadesStore();
const activas = computed(() => especialidades.items.filter((e) => e.estado === 'activo'));

const EMPTY = () => ({ nombres: '', apellidos: '', documento: '', especialidadId: '', telefono: '', email: '' });
const form = ref(EMPTY());

watch(
  () => props.show,
  (v) => {
    form.value = v && props.editando ? { ...props.editando } : EMPTY();
  },
);

function submit() {
  if (!form.value.nombres.trim() || !form.value.apellidos.trim() || !form.value.documento.trim()) return;
  const data = { ...form.value, especialidadId: Number(form.value.especialidadId) };
  if (props.editando) {
    medicos.actualizar(props.editando.id, data);
  } else {
    medicos.crear(data);
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
        <div class="bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 w-full max-w-2xl mx-4">
          <div class="flex items-center justify-between px-8 py-5 border-b border-slate-100">
            <h2 class="text-2xl font-bold text-slate-900">
              {{ editando ? 'Editar médico' : 'Nuevo médico' }}
            </h2>
            <button @click="emit('close')" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submit" class="px-8 py-6 space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Nombres *</label>
                <input v-model="form.nombres" type="text" placeholder="Ej. Carlos" :class="inputClass" required />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Apellidos *</label>
                <input v-model="form.apellidos" type="text" placeholder="Ej. Paredes Vega" :class="inputClass" required />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">N° Documento *</label>
                <input v-model="form.documento" type="text" placeholder="DNI / CMP" :class="inputClass" required />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Especialidad *</label>
                <select v-model="form.especialidadId" :class="inputClass" required>
                  <option value="" disabled>Seleccionar</option>
                  <option v-for="e in activas" :key="e.id" :value="e.id">{{ e.nombre }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Teléfono</label>
                <input v-model="form.telefono" type="tel" placeholder="9XXXXXXXX" :class="inputClass" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Correo</label>
                <input v-model="form.email" type="email" placeholder="medico@clinica.pe" :class="inputClass" />
              </div>
            </div>

            <div class="flex justify-end gap-2.5 pt-1">
              <button type="button" @click="emit('close')" class="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors">Cancelar</button>
              <button type="submit" class="px-4 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-sm">
                {{ editando ? 'Guardar cambios' : 'Crear médico' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
