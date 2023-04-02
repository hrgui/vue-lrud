<script setup lang="ts">
import { onMounted, onUnmounted, provide } from "vue";
import createFocusStore from "../focus-store";
import lrudInput from "../lrud-input/focus-lrud";
import { ref } from "vue";
import { RootFocusNode } from "../types";

const store = createFocusStore();

const rootElRef = ref(null);

const context = {
  store,
  focusDefinitionHierarchy: [
    {
      elRef: rootElRef,
      focusId: "root",
    },
  ],
  focusNodesHierarchy: [store.getState().nodes.root as RootFocusNode],
};

provide("FocusStore", context);

(window as any).store = store;

let lrud: ReturnType<typeof lrudInput> | null = null;

onMounted(() => {
  lrud = lrudInput(store);
  lrud?.subscribe();
});

onUnmounted(() => {
  lrud?.unsubscribe();
});
</script>

<template>
  <slot />
</template>
