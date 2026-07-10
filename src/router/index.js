import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '../layouts/AdminLayout.vue';
import PacienteLayout from '../layouts/PacienteLayout.vue';
import { useSesionPacienteStore } from '../stores/sesionPaciente';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/admin',
      component: AdminLayout,
      redirect: '/admin/reservas',
      children: [
        { path: 'reservas', component: () => import('../modules/admin/reservas/Reservas.vue') },
        { path: 'mis-pacientes', component: () => import('../modules/admin/mispac/MisPacientes.vue') },
        { path: 'pacientes', component: () => import('../modules/admin/pacientes/Pacientes.vue') },
        { path: 'medicos', component: () => import('../modules/admin/medicos/Medicos.vue') },
        { path: 'especialidades', component: () => import('../modules/admin/especialidades/Especialidades.vue') },
      ],
    },
    { path: '/paciente/registro', component: () => import('../modules/pacientes/registro/Registro.vue') },
    { path: '/paciente/login', component: () => import('../modules/pacientes/login/Login.vue') },
    {
      path: '/paciente',
      component: PacienteLayout,
      redirect: '/paciente/citas',
      children: [
        { path: 'citas', component: () => import('../modules/pacientes/citas/MisCitas.vue'), meta: { requiereSesion: true } },
        { path: 'nueva-cita', component: () => import('../modules/pacientes/citas/NuevaCita.vue'), meta: { requiereSesion: true } },
      ],
    },
    { path: '/', component: () => import('../modules/inicio/Inicio.vue') },
  ],
});

router.beforeEach((to) => {
  if (to.meta.requiereSesion) {
    const sesion = useSesionPacienteStore();
    if (!sesion.pacienteId) return '/paciente/login';
  }
});

export default router;
