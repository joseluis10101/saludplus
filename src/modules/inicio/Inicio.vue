<template>
  <div class="min-h-screen bg-[#F7F2E8] text-lg text-stone-900 flex items-center justify-center px-6 py-16">
    <div class="w-full max-w-3xl text-center">
      <p class="text-5xl sm:text-6xl font-black tracking-tight text-blue-700">Salud+</p>

      <div class="mt-12 grid sm:grid-cols-2 gap-6">
        <router-link
          to="/admin"
          target="_blank"
          class="group bg-white rounded-2xl shadow-sm border border-stone-200 px-8 py-10 flex flex-col items-center gap-4 hover:-translate-y-1 hover:shadow-md hover:border-blue-200 transition-all"
        >
          <div>
            <p class="text-2xl font-bold text-stone-900">Administración</p>
            <p class="text-base text-stone-500 mt-1">Recepción, médicos y reportes</p>
          </div>
        </router-link>

        <router-link
          to="/paciente"
          target="_blank"
          class="group bg-white rounded-2xl shadow-sm border border-stone-200 px-8 py-10 flex flex-col items-center gap-4 hover:-translate-y-1 hover:shadow-md hover:border-blue-200 transition-all"
        >
          <div>
            <p class="text-2xl font-bold text-stone-900">Paciente</p>
            <p class="text-base text-stone-500 mt-1">Reserva y gestiona tus citas</p>
          </div>
        </router-link>
      </div>

      <p class="mt-12 text-base text-stone-500">Este es un demo de clínica que cubre los casos de agendamiento, confirmación, cancelación y reprogramación de citas médicas.</p>

      <div class="mt-4 flex items-center justify-center gap-3">
        <a
          href="https://github.com/joseluis10101"
          target="_blank"
          rel="noopener noreferrer"
          title="Mi perfil de GitHub"
          aria-label="Mi perfil de GitHub"
          class="w-10 h-10 flex items-center justify-center text-stone-500 border border-stone-300 rounded-xl hover:text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-colors"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor">
            <path
              d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .3.21.66.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
            />
          </svg>
        </a>
        <a
          href="https://github.com/joseluis10101/saludplus"
          target="_blank"
          rel="noopener noreferrer"
          title="Ver el código en GitHub"
          aria-label="Ver el código en GitHub"
          class="w-10 h-10 flex items-center justify-center text-stone-500 border border-stone-300 rounded-xl hover:text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-colors"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path
              d="M9 18c-4.5 1.5-4.5-2.5-6-3m12 6v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.6 2.8 5.5 3.1 5.5 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.1 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>
