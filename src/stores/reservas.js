import { defineStore } from 'pinia';
import { ref } from 'vue';

// estados: reservada | en_espera | atendida | cancelada
const SEED = [
  {
    id: 1,
    paciente: 'Luis Huamán Ruiz',
    documento: '45123456',
    medicoId: 1,
    especialidadId: 1,
    fecha: '2026-07-10',
    hora: '09:00',
    estado: 'reservada',
    pago: null,
    atencion: null,
  },
  {
    id: 2,
    paciente: 'Rosa Condori Mamani',
    documento: '47234567',
    medicoId: 2,
    especialidadId: 2,
    fecha: '2026-07-10',
    hora: '10:30',
    estado: 'reservada',
    pago: null,
    atencion: null,
  },
  {
    id: 3,
    paciente: 'Pedro Ccahuana Torres',
    documento: '48345678',
    medicoId: 3,
    especialidadId: 3,
    fecha: '2026-07-10',
    hora: '11:00',
    estado: 'en_espera',
    pago: { tieneSeguro: false, monto: 80, metodo: 'efectivo' },
    atencion: null,
  },
  {
    id: 4,
    paciente: 'Carmen Vilca Apaza',
    documento: '49456789',
    medicoId: 4,
    especialidadId: 4,
    fecha: '2026-07-09',
    hora: '15:00',
    estado: 'atendida',
    pago: { tieneSeguro: true, monto: 0, metodo: null },
    atencion: {
      diagnostico: 'Migraña tensional',
      tratamiento: 'Reposo, analgésicos',
      medicamentos: 'Ibuprofeno 400mg c/8h x 5 días',
      indicaciones: 'Control en 2 semanas',
      examenes: '',
    },
  },
];

export const useReservasStore = defineStore('reservas', () => {
  const items = ref(JSON.parse(localStorage.getItem('reservas') ?? 'null') ?? SEED);

  function save() {
    localStorage.setItem('reservas', JSON.stringify(items.value));
  }

  function nextId() {
    return items.value.length ? Math.max(...items.value.map((r) => r.id)) + 1 : 1;
  }

  function registrarIngreso(id, pago) {
    const r = items.value.find((r) => r.id === id);
    if (r) {
      r.pago = pago;
      r.estado = 'en_espera';
      save();
    }
  }

  function registrarAtencion(id, atencion) {
    const r = items.value.find((r) => r.id === id);
    if (r) {
      r.atencion = atencion;
      r.estado = 'atendida';
      save();
    }
  }

  function cancelar(id) {
    const r = items.value.find((r) => r.id === id);
    if (r) {
      r.estado = 'cancelada';
      save();
    }
  }

  function crear(data) {
    items.value.unshift({ id: nextId(), estado: 'reservada', pago: null, atencion: null, ...data });
    save();
  }

  return { items, nextId, registrarIngreso, registrarAtencion, cancelar, crear };
});
