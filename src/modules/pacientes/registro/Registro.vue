<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePacientesStore } from '../../../stores/pacientes';
import { useSesionPacienteStore } from '../../../stores/sesionPaciente';

const router = useRouter();
const pacientes = usePacientesStore();
const sesion = useSesionPacienteStore();

const form = ref({
  nombres: '',
  apellidos: '',
  tipoDoc: 'DNI',
  documento: '',
  fechaNacimiento: '',
  sexo: 'M',
  email: '',
  telefono: '',
  direccion: '',
  password: '',
});

const error = ref('');

function submit() {
  error.value = '';
  const documento = form.value.documento.trim();
  const email = form.value.email.trim().toLowerCase();

  const duplicado = pacientes.items.some((p) => p.documento === documento || p.email.toLowerCase() === email);
  if (duplicado) {
    error.value = 'Ya existe una cuenta registrada con ese documento o correo.';
    return;
  }

  pacientes.crear({ ...form.value, documento, email });
  const creado = pacientes.items.find((p) => p.documento === documento);
  sesion.login(creado.id);
  router.push('/paciente/citas');
}

const inputClass =
  'w-full border-2 border-stone-300 rounded-xl px-5 py-3.5 text-lg text-stone-900 bg-white placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 transition-colors';
const labelClass = 'block text-base font-semibold text-stone-600 mb-2';
</script>

<template>
  <div class="min-h-screen bg-[#F7F2E8] text-lg text-stone-900 flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-2xl">
      <div class="text-center mb-8">
        <router-link to="/paciente/login" class="text-4xl font-black tracking-tight text-blue-700"> Salud+ </router-link>
      </div>

      <form @submit.prevent="submit" class="bg-white rounded-2xl shadow-sm border border-stone-200 px-8 py-10 space-y-6">
        <div class="grid grid-cols-2 gap-5">
          <div>
            <label :class="labelClass">Nombres *</label>
            <input v-model="form.nombres" type="text" placeholder="Ej. María" :class="inputClass" required />
          </div>
          <div>
            <label :class="labelClass">Apellidos *</label>
            <input v-model="form.apellidos" type="text" placeholder="Ej. Salas Mendoza" :class="inputClass" required />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-5">
          <div>
            <label :class="labelClass">Tipo de documento *</label>
            <select v-model="form.tipoDoc" :class="inputClass">
              <option value="DNI">DNI</option>
              <option value="CE">Carnet de Extranjería</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>
          <div>
            <label :class="labelClass">N° Documento *</label>
            <input v-model="form.documento" type="text" placeholder="12345678" :class="inputClass" required />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-5">
          <div>
            <label :class="labelClass">Fecha de nacimiento *</label>
            <input v-model="form.fechaNacimiento" type="date" :class="inputClass" required />
          </div>
          <div>
            <label :class="labelClass">Sexo *</label>
            <select v-model="form.sexo" :class="inputClass">
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-5">
          <div>
            <label :class="labelClass">Correo *</label>
            <input v-model="form.email" type="email" placeholder="tucorreo@ejemplo.com" :class="inputClass" required />
          </div>
          <div>
            <label :class="labelClass">Teléfono *</label>
            <input v-model="form.telefono" type="tel" placeholder="9XXXXXXXX" :class="inputClass" required />
          </div>
        </div>

        <div>
          <label :class="labelClass">Dirección</label>
          <input v-model="form.direccion" type="text" placeholder="Av. Ejemplo 123, Lima" :class="inputClass" />
        </div>

        <div>
          <label :class="labelClass">Contraseña *</label>
          <input v-model="form.password" type="password" placeholder="••••••••" :class="inputClass" required />
        </div>

        <p v-if="error" class="text-base font-semibold text-rose-600 bg-rose-50 rounded-xl px-4 py-3">
          {{ error }}
        </p>

        <button type="submit" class="w-full py-4 text-lg font-semibold bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-colors shadow-sm">Crear cuenta</button>

        <p class="text-center text-base text-stone-500">
          ¿Ya tienes cuenta?
          <router-link to="/paciente/login" class="font-semibold text-blue-700 hover:text-blue-800">Inicia sesión</router-link>
        </p>
      </form>
    </div>
  </div>
</template>
