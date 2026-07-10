import { defineStore } from 'pinia';
import { ref } from 'vue';

const SEED = [
  { id: 1, nombres: 'Carlos', apellidos: 'Paredes Vega', documento: '08123456', especialidadId: 1, telefono: '987654321', email: 'cparedes@clinica.pe', estado: 'activo' },
  { id: 2, nombres: 'María', apellidos: 'Quispe Lara', documento: '09234567', especialidadId: 2, telefono: '976543210', email: 'mquispe@clinica.pe', estado: 'activo' },
  { id: 3, nombres: 'Jorge', apellidos: 'Mendoza Ríos', documento: '07345678', especialidadId: 3, telefono: '965432109', email: 'jmendoza@clinica.pe', estado: 'activo' },
  { id: 4, nombres: 'Ana', apellidos: 'Torres Cáceres', documento: '06456789', especialidadId: 4, telefono: '954321098', email: 'atorres@clinica.pe', estado: 'activo' },
];

export const useMedicosStore = defineStore('medicos', () => {
  const items = ref(JSON.parse(localStorage.getItem('medicos') ?? 'null') ?? SEED);

  function save() {
    localStorage.setItem('medicos', JSON.stringify(items.value));
  }

  function nextId() {
    return items.value.length ? Math.max(...items.value.map((m) => m.id)) + 1 : 1;
  }

  function crear(data) {
    items.value.push({ ...data, id: nextId(), estado: 'activo' });
    save();
  }

  function actualizar(id, data) {
    const i = items.value.findIndex((m) => m.id === id);
    if (i !== -1) {
      items.value[i] = { ...items.value[i], ...data };
      save();
    }
  }

  function toggleEstado(id) {
    const item = items.value.find((m) => m.id === id);
    if (item) {
      item.estado = item.estado === 'activo' ? 'inactivo' : 'activo';
      save();
    }
  }

  return { items, crear, actualizar, toggleEstado };
});
