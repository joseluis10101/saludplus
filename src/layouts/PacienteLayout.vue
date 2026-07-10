<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSesionPacienteStore } from '../stores/sesionPaciente';
import { usePacientesStore } from '../stores/pacientes';

const router = useRouter();
const sesion = useSesionPacienteStore();
const pacientes = usePacientesStore();

const paciente = computed(() => pacientes.items.find((p) => p.id === sesion.pacienteId));

function cerrarSesion() {
  sesion.logout();
  router.push('/paciente/login');
}
</script>

<template>
  <div class="min-h-screen bg-[#F7F2E8] text-lg text-stone-900">
    <header class="sticky top-0 z-20 bg-[#F7F2E8]">
      <div class="w-full px-8 py-5 flex items-center justify-between">
        <router-link to="/paciente/citas" class="text-4xl font-black tracking-tight text-blue-700"> Salud+ </router-link>
        <div v-if="paciente" class="flex items-center gap-4">
          <p class="font-semibold text-stone-900 hidden sm:block">{{ paciente.nombres }} {{ paciente.apellidos }}</p>
          <button @click="cerrarSesion" class="px-4 py-2 text-base font-semibold text-stone-500 border border-stone-300 rounded-xl hover:text-stone-700 hover:border-stone-400 transition-colors">Salir</button>
        </div>
      </div>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>
