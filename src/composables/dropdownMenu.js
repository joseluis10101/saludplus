import { ref } from 'vue';

// Shared across every DropdownMenu instance so opening one closes any other.
export const openDropdownId = ref(null);
