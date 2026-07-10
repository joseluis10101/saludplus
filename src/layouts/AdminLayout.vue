<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const sections = [
  {
    label: 'General',
    items: [
      {
        label: 'Reservas',
        to: '/admin/reservas',
        icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      },
      {
        label: 'Mis Pacientes',
        to: '/admin/mis-pacientes',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      },
    ],
  },
  {
    label: 'Administración',
    items: [
      {
        label: 'Pacientes',
        to: '/admin/pacientes',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      },
      {
        label: 'Médicos',
        to: '/admin/medicos',
        icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      },
      {
        label: 'Especialidades',
        to: '/admin/especialidades',
        icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
      },
    ],
  },
];
</script>

<template>
  <div class="flex h-screen bg-white text-base">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-100 flex flex-col shrink-0">
      <!-- Brand -->
      <div class="flex items-center px-6 pt-8 pb-10">
        <span class="font-black text-4xl tracking-tight text-blue-600">Salud+</span>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto px-3 pb-4 space-y-6">
        <div v-for="section in sections" :key="section.label">
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em] px-3 mb-2">
            {{ section.label }}
          </p>
          <div class="space-y-1">
            <router-link
              v-for="item in section.items"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 px-4 py-3.5 rounded-lg text-base font-medium transition-all duration-150"
              :class="route.path === item.to ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'"
            >
              <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
              </svg>
              {{ item.label }}
            </router-link>
          </div>
        </div>
      </nav>

      <!-- User -->
      <div class="border-t border-gray-200 px-3 py-4">
        <div class="flex items-center gap-3 px-3 py-2.5">
          <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
            <span class="text-xs font-bold text-white">A</span>
          </div>
          <div class="leading-tight min-w-0">
            <p class="text-sm font-semibold text-gray-800 truncate">Administrador</p>
            <p class="text-xs text-gray-400">Sistema</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Content -->
    <main class="flex-1 overflow-auto bg-white">
      <router-view />
    </main>
  </div>
</template>
