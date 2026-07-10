<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

defineProps({
  items: {
    type: Array, // [{ label, action, danger? }]
    default: () => [],
  },
});

const open = ref(false);
const el = ref(null);

function toggle(e) {
  e.stopPropagation();
  open.value = !open.value;
}

function handleOutside(e) {
  if (el.value && !el.value.contains(e.target)) open.value = false;
}

function run(item) {
  item.action();
  open.value = false;
}

onMounted(() => document.addEventListener('click', handleOutside));
onUnmounted(() => document.removeEventListener('click', handleOutside));
</script>

<template>
  <div ref="el" class="relative inline-block">
    <button @click="toggle" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="5" r="1.8" />
        <circle cx="12" cy="12" r="1.8" />
        <circle cx="12" cy="19" r="1.8" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95 translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-1"
    >
      <div v-if="open" class="absolute right-0 z-30 mt-1.5 w-44 origin-top-right bg-white/95 backdrop-blur-sm rounded-xl shadow-xl ring-1 ring-slate-900/10 py-1 overflow-hidden">
        <button
          v-for="item in items"
          :key="item.label"
          @click="run(item)"
          class="w-full text-left px-4 py-2 text-sm font-medium transition-colors"
          :class="item.danger ? 'text-red-500 hover:bg-red-50 hover:text-red-600' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'"
        >
          {{ item.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>
