import { defineStore } from 'pinia';
import { ref } from 'vue';

const SEED = [
  {
    id: 1,
    nombres: 'Luis',
    apellidos: 'Huamán Ruiz',
    tipoDoc: 'DNI',
    documento: '45123456',
    fechaNacimiento: '1990-03-15',
    sexo: 'M',
    email: 'luis.huaman@gmail.com',
    telefono: '987654321',
    direccion: 'Av. Los Olivos 234, Lima',
  },
  {
    id: 2,
    nombres: 'Rosa',
    apellidos: 'Condori Mamani',
    tipoDoc: 'DNI',
    documento: '47234567',
    fechaNacimiento: '1985-07-22',
    sexo: 'F',
    email: 'rosa.condori@hotmail.com',
    telefono: '976543210',
    direccion: 'Jr. Miraflores 89, Surco',
  },
  {
    id: 3,
    nombres: 'Pedro',
    apellidos: 'Ccahuana Torres',
    tipoDoc: 'DNI',
    documento: '48345678',
    fechaNacimiento: '1978-11-08',
    sexo: 'M',
    email: 'pedro.ccahuana@gmail.com',
    telefono: '965432109',
    direccion: 'Calle Las Rosas 12, San Borja',
  },
  {
    id: 4,
    nombres: 'Carmen',
    apellidos: 'Vilca Apaza',
    tipoDoc: 'DNI',
    documento: '49456789',
    fechaNacimiento: '1995-01-30',
    sexo: 'F',
    email: 'carmen.vilca@gmail.com',
    telefono: '954321098',
    direccion: 'Av. Benavides 567, Miraflores',
  },
  {
    id: 5,
    nombres: 'Jorge',
    apellidos: 'Quispe Flores',
    tipoDoc: 'DNI',
    documento: '43567890',
    fechaNacimiento: '1982-05-19',
    sexo: 'M',
    email: 'jorge.quispe@outlook.com',
    telefono: '943210987',
    direccion: 'Av. Colonial 1100, Cercado',
  },
  {
    id: 6,
    nombres: 'María',
    apellidos: 'Salas Mendoza',
    tipoDoc: 'DNI',
    documento: '44678901',
    fechaNacimiento: '2001-09-03',
    sexo: 'F',
    email: 'maria.salas@gmail.com',
    telefono: '932109876',
    direccion: 'Jr. Cusco 45, Lince',
  },
];

export const usePacientesStore = defineStore('pacientes', () => {
  const items = ref(JSON.parse(localStorage.getItem('pacientes') ?? 'null') ?? SEED);

  function save() {
    localStorage.setItem('pacientes', JSON.stringify(items.value));
  }

  function nextId() {
    return items.value.length ? Math.max(...items.value.map((p) => p.id)) + 1 : 1;
  }

  function crear(data) {
    items.value.push({ id: nextId(), ...data });
    save();
  }

  function actualizar(id, data) {
    const i = items.value.findIndex((p) => p.id === id);
    if (i !== -1) {
      items.value[i] = { id, ...data };
      save();
    }
  }

  return { items, crear, actualizar };
});
