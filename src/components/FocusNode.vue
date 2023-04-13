<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, provide } from "vue";
import { createUniqueId } from "../focus-store";
import { FocusStore, Id, NodeDefinition, ProviderValue } from "../types";
import nodeFromDefinition from "../utils/node-from-definition";
import type { FocusNode } from "../types";

const props = withDefaults(
  defineProps<{
    orientation?: "horizontal" | "vertical";
    focusId?: string;
    elementType?: any; // string OR the actual object (vue objects are type any)
    wrapping?: boolean;
    isGrid?: boolean;
    isTrap?: boolean;
    forgetTrapFocusHierarchy?: boolean;
    defaultFocusColumn?: number;
    defaultFocusRow?: number;
    disabled?: boolean;
    onMountAssignFocusTo?: string;
    defaultFocusChild?: number;
    isExiting?: boolean;
    focusedClass?: string;
    focusedLeafClass?: string;
    disabledClass?: string;
    activeClass?: string;
    wrapGridHorizontal?: boolean;
    wrapGridVertical?: boolean;
  }>(),
  {
    elementType: "div",
    wrapping: false,
    isGrid: false,
    isTrap: false,
    focusedClass: "isFocused",
    focusedLeafClass: "isFocusedLeaf",
    disabledClass: "focusDisabled",
    activeClass: "isActive",
    forgetTrapFocusHierarchy: false,
    isExiting: false,
  }
);

const context = inject("FocusStore") as {
  store: FocusStore;
  focusDefinitionHierarchy: any;
  focusNodesHierarchy: any;
};
const elRef = ref(null);
const nodeId = props.focusId || `node-${createUniqueId()}`;
const staticDefinition = createStaticDefinition();
const nodeRef = ref(staticDefinition.initialNode);
const nodeExistsInTree = ref(false);

function createStaticDefinition() {
  const defaultForgetFocusTrap = props.isTrap ? false : undefined;
  const defaultOrientation = !props.isGrid ? undefined : "horizontal";

  const nodeDefinition: NodeDefinition = {
    elRef,
    focusId: nodeId,
    orientation: props.orientation || defaultOrientation,
    wrapping: props.wrapping,
    trap: props.isTrap,
    wrapGridHorizontal:
      typeof props.wrapGridHorizontal === "boolean" ? props.wrapGridHorizontal : props.wrapping,
    wrapGridVertical:
      typeof props.wrapGridVertical === "boolean" ? props.wrapGridVertical : props.wrapping,
    forgetTrapFocusHierarchy:
      props.forgetTrapFocusHierarchy !== undefined
        ? props.forgetTrapFocusHierarchy
        : defaultForgetFocusTrap,
    navigationStyle: props.isGrid ? "grid" : "first-child",
    defaultFocusColumn: props.defaultFocusColumn ?? 0,
    defaultFocusRow: props.defaultFocusRow ?? 0,

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

    // onFocused,
    // onBlurred,

    initiallyDisabled: Boolean(props.disabled),

    onMountAssignFocusTo: props.onMountAssignFocusTo,
    defaultFocusChild: props.defaultFocusChild,

    isExiting: props.isExiting,
  };

  // const { store, focusDefinitionHierarchy, focusNodesHierarchy } = context;

  // console.log('nodeId', nodeId, focusDefinitionHierarchy, focusNodesHierarchy);

  console.log("nodeId", nodeId, context.focusDefinitionHierarchy, context.focusNodesHierarchy);

  const parentNode = context.focusNodesHierarchy[context.focusNodesHierarchy.length - 1];
  const initialNode = nodeFromDefinition({
    nodeDefinition,
    parentNode,
  });

  const newDefinitionHierarchy = context.focusDefinitionHierarchy.concat(nodeDefinition);

  const newNodesHierarchy = context.focusNodesHierarchy.concat(initialNode);

  const newProviderValue = {
    store: context.store,
    focusDefinitionHierarchy: newDefinitionHierarchy,
    focusNodesHierarchy: newNodesHierarchy,
  };
  // a focusnode is also another root
  provide("FocusStore", newProviderValue);

  return {
    nodeDefinition,
    initialNode,
    providerValue: newProviderValue,
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
    if (
      newNode.isFocused !== currentNode.value.isFocused ||
      newNode.isFocusedLeaf !== currentNode.value.isFocusedLeaf ||
      newNode.active !== currentNode.value.active ||
      newNode.disabled !== currentNode.value.disabled
    ) {
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

  checkForUpdate({
    focusStore: context.store,
    id: nodeId,
    currentNode: nodeRef,
  });
});

onUnmounted(() => {
  nodeExistsInTree.value = false;
  context.store.deleteNode(nodeId);
  unsubscribe();
});
</script>

<template>
  <component
    :is="elementType"
    ref="elRef"
    :class="{
      [props.focusedLeafClass]: nodeRef.isFocusedLeaf,
      [props.focusedClass]: nodeRef.isFocused,
      [props.disabledClass]: nodeRef.disabled,
      [props.activeClass]: nodeRef.active,
    }"
    ><slot
  /></component>
</template>
