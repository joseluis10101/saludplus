import { defineStore } from 'pinia';
import { ref } from 'vue';

const SEED = [
  { id: 1, nombre: 'Cardiología', descripcion: 'Enfermedades del corazón y sistema cardiovascular', estado: 'activo' },
  { id: 2, nombre: 'Dermatología', descripcion: 'Enfermedades de la piel, cabello y uñas', estado: 'activo' },
  { id: 3, nombre: 'Pediatría', descripcion: 'Atención médica de niños y adolescentes', estado: 'activo' },
  { id: 4, nombre: 'Neurología', descripcion: 'Enfermedades del sistema nervioso', estado: 'activo' },
  { id: 5, nombre: 'Traumatología', descripcion: 'Lesiones del aparato locomotor', estado: 'inactivo' },
];

export const useEspecialidadesStore = defineStore('especialidades', () => {
  const items = ref(JSON.parse(localStorage.getItem('especialidades') ?? 'null') ?? SEED);

  function save() {
    localStorage.setItem('especialidades', JSON.stringify(items.value));
  }

  function nextId() {
    return items.value.length ? Math.max(...items.value.map((e) => e.id)) + 1 : 1;
  }

  function crear(data) {
    items.value.push({ ...data, id: nextId(), estado: 'activo' });
    save();
  }

  function actualizar(id, data) {
    const i = items.value.findIndex((e) => e.id === id);
    if (i !== -1) {
      items.value[i] = { ...items.value[i], ...data };
      save();
    }
  }

  function toggleEstado(id) {
    const item = items.value.find((e) => e.id === id);
    if (item) {
      item.estado = item.estado === 'activo' ? 'inactivo' : 'activo';
      save();
    }
  }

  return { items, crear, actualizar, toggleEstado };
});
