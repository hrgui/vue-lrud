<script setup lang="ts">
import FocusNode from "./components/FocusNode.vue";
</script>

<template>
  <div>
    <FocusRoot>
      <FocusNode orientation="vertical">
        <FocusNode class="flex gap-2 flex-wrap">
          <FocusNode class="node">Test</FocusNode>
          <FocusNode class="node">Test</FocusNode>
          <FocusNode class="node">Test</FocusNode>
          <FocusNode class="node">Test</FocusNode>
          <FocusNode class="node">Test</FocusNode>
        </FocusNode>

        <FocusNode class="flex gap-2 flex-wrap">
          <FocusNode class="node">Test</FocusNode>
          <FocusNode class="node">Test</FocusNode>
          <FocusNode class="node">Test</FocusNode>
          <FocusNode class="node">Test</FocusNode>
          <FocusNode class="node">Test</FocusNode>
        </FocusNode>
      </FocusNode>
    </FocusRoot>
  </div>
</template>
