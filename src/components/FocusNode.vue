<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from "vue";
import { createUniqueId } from "../focus-store";
import { FocusStore, Id, NodeDefinition, ProviderValue } from "../types";
import nodeFromDefinition from "../utils/node-from-definition";
import type { FocusNode } from "../types";

const context = inject("FocusStore") as {
  store: FocusStore;
  focusDefinitionHierarchy: any;
  focusNodesHierarchy: any;
};
const elRef = ref(null);
const nodeId = `node-${createUniqueId()}`;
const staticDefinition = createStaticDefinition();
const nodeRef = ref(staticDefinition.initialNode);
const nodeExistsInTree = ref(false);

function createStaticDefinition() {
  const nodeDefinition: NodeDefinition = {
    elRef,
    focusId: nodeId,
    orientation: "horizontal",
    // orientation: orientation || defaultOrientation,
    // wrapping: Boolean(wrapping),
    wrapping: false,
    // trap: Boolean(isTrap),
    trap: false,
    // wrapGridHorizontal: wrapGridHorizontalValue,
    // wrapGridVertical: wrapGridVerticalValue,
    wrapGridHorizontal: false,
    wrapGridVertical: false,
    // forgetTrapFocusHierarchy:
    //   forgetTrapFocusHierarchy !== undefined ? forgetTrapFocusHierarchy : defaultForgetFocusTrap,
    forgetTrapFocusHierarchy: undefined,

    // navigationStyle: isGrid ? "grid" : "first-child",
    navigationStyle: "first-child",

    // defaultFocusColumn: defaultFocusColumn ?? 0,
    // defaultFocusRow: defaultFocusRow ?? 0,
    defaultFocusColumn: 0,
    defaultFocusRow: 0,

    // onKey: createCallbackWrapper("onKey"),
    // onArrow: createCallbackWrapper("onArrow"),
    // onLeft: createCallbackWrapper("onLeft"),
    // onRight: createCallbackWrapper("onRight"),
    // onUp: createCallbackWrapper("onUp"),
    // onDown: createCallbackWrapper("onDown"),
    // onSelected: createCallbackWrapper("onSelected"),
    // onBack: createCallbackWrapper("onBack"),

    // onMove: createCallbackWrapper("onMove"),
    // onGridMove: createCallbackWrapper("onGridMove"),

    // initiallyDisabled: Boolean(disabled),
    initiallyDisabled: false,

    // onMountAssignFocusTo,
    // defaultFocusChild,

    // isExiting,

    // onFocused,
    // onBlurred,
  };

  const { store, focusDefinitionHierarchy, focusNodesHierarchy } = context;

  const parentNode = focusNodesHierarchy[focusNodesHierarchy.length - 1];
  const initialNode = nodeFromDefinition({
    nodeDefinition,
    parentNode,
  });

  const newDefinitionHierarchy = focusDefinitionHierarchy.concat(nodeDefinition);

  const newNodesHierarchy = focusNodesHierarchy.concat(initialNode);

  return {
    nodeDefinition,
    initialNode,
    providerValue: {
      store,
      focusDefinitionHierarchy: newDefinitionHierarchy,
      focusNodesHierarchy: newNodesHierarchy,
    } as ProviderValue,
  };
}

function checkForUpdate({
  focusStore,
  id,
  currentNode,
}: {
  focusStore: FocusStore;
  id: Id;
  currentNode: any;
}) {
  const state = focusStore.getState();
  const newNode = state.nodes[id] as FocusNode;

  if (newNode && !newNode.isExiting) {
    // NOTE: this could check everything about the node, but if we do newNode !== currentNode.value, it re-renders too often
    if (newNode.isFocused !== currentNode.value.isFocused) {
      currentNode.value = newNode;
    }
  }
}

const unsubscribe = context.store.subscribe(() => {
  checkForUpdate({
    focusStore: context.store,
    id: nodeId,
    currentNode: nodeRef,
  });
});

onMounted(() => {
  context.store.createNodes(
    staticDefinition.providerValue.focusNodesHierarchy,
    staticDefinition.providerValue.focusDefinitionHierarchy
  );
  nodeExistsInTree.value = true;
});

onUnmounted(() => {
  nodeExistsInTree.value = false;
  context.store.deleteNode(nodeId);
  unsubscribe();
});
</script>

<template>
  <div ref="elRef" :class="nodeRef.isFocused && 'isFocusedLeaf'"><slot /></div>
</template>
