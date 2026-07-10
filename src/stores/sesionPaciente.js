import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSesionPacienteStore = defineStore('sesionPaciente', () => {
  const pacienteId = ref(JSON.parse(localStorage.getItem('sesionPaciente') ?? 'null'));

  function login(id) {
    pacienteId.value = id;
    localStorage.setItem('sesionPaciente', JSON.stringify(id));
  }

  function logout() {
    pacienteId.value = null;
    localStorage.removeItem('sesionPaciente');
  }

  return { pacienteId, login, logout };
});
