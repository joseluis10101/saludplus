<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { openDropdownId } from '../composables/dropdownMenu';

defineProps({
  items: {
    type: Array, // [{ label, action, danger? }]
    default: () => [],
  },
});

const MENU_WIDTH = 176; // w-44

const id = Symbol('dropdown');
const open = computed(() => openDropdownId.value === id);

const btn = ref(null);
const menu = ref(null);
const menuStyle = ref({});

function updatePosition() {
  const rect = btn.value.getBoundingClientRect();
  const left = Math.min(Math.max(rect.right - MENU_WIDTH, 8), window.innerWidth - MENU_WIDTH - 8);
  const spaceBelow = window.innerHeight - rect.bottom;
  const openUpwards = spaceBelow < 180 && rect.top > 180;

  menuStyle.value = {
    left: `${left}px`,
    width: `${MENU_WIDTH}px`,
    ...(openUpwards ? { bottom: `${window.innerHeight - rect.top + 6}px` } : { top: `${rect.bottom + 6}px` }),
  };
}

function toggle(e) {
  e.stopPropagation();
  if (open.value) {
    openDropdownId.value = null;
    return;
  }
  updatePosition();
  openDropdownId.value = id;
}

function close() {
  if (open.value) openDropdownId.value = null;
}

function handleOutside(e) {
  if (btn.value?.contains(e.target) || menu.value?.contains(e.target)) return;
  close();
}

function run(item) {
  item.action();
  openDropdownId.value = null;
}

onMounted(() => {
  document.addEventListener('click', handleOutside);
  window.addEventListener('scroll', close, true);
  window.addEventListener('resize', close);
});
onUnmounted(() => {
  document.removeEventListener('click', handleOutside);
  window.removeEventListener('scroll', close, true);
  window.removeEventListener('resize', close);
});
</script>

<template>
  <button ref="btn" @click="toggle" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
    </svg>
  </button>

  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95 translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-1"
    >
      <div v-if="open" ref="menu" class="fixed z-50 origin-top-right bg-white/95 backdrop-blur-sm rounded-xl shadow-xl ring-1 ring-slate-900/10 py-1 overflow-hidden" :style="menuStyle">
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
  </Teleport>
</template>
