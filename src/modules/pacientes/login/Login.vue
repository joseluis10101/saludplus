<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePacientesStore } from '../../../stores/pacientes';
import { useSesionPacienteStore } from '../../../stores/sesionPaciente';

const router = useRouter();
const pacientes = usePacientesStore();
const sesion = useSesionPacienteStore();

const email = ref('carmen.vilca@gmail.com');
const error = ref('');

function submit() {
  error.value = '';
  const value = email.value.trim().toLowerCase();
  const paciente = pacientes.items.find((p) => p.email.toLowerCase() === value);
  if (!paciente) {
    error.value = 'No encontramos una cuenta con ese correo.';
    return;
  }
  sesion.login(paciente.id);
  router.push('/paciente/citas');
}

const inputClass =
  'w-full border-2 border-stone-300 rounded-xl px-5 py-3.5 text-lg text-stone-900 bg-white placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition-colors';
</script>

<template>
  <div class="min-h-screen bg-[#F7F2E8] text-lg text-stone-900 flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <router-link to="/paciente/login" class="text-5xl font-black tracking-tight text-blue-700"> Salud+ </router-link>
      </div>

      <form @submit.prevent="submit" class="bg-white rounded-2xl shadow-sm border border-stone-200 px-8 py-10 space-y-6">
        <div>
          <label class="block text-base font-semibold text-stone-600 mb-2">Correo electrónico</label>
          <input v-model="email" type="email" placeholder="tucorreo@ejemplo.com" :class="inputClass" required autofocus />
        </div>

        <p v-if="error" class="text-base font-semibold text-rose-600 bg-rose-50 rounded-xl px-4 py-3">
          {{ error }}
        </p>

        <button type="submit" class="w-full py-4 text-lg font-semibold bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-colors shadow-sm">Ingresar</button>

        <p class="text-center text-base text-stone-500">
          ¿No tienes cuenta?
          <router-link to="/paciente/registro" class="font-semibold text-blue-700 hover:text-blue-800">Regístrate</router-link>
        </p>
      </form>
    </div>
  </div>
</template>
