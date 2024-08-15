<template>
  <div ref="demo-project-x6" class="demo-project-x6 w-full h-full">
   <!-- <HelloWorld /> -->
   <PageX6 />
  </div>
</template>

<script setup>
import { Graph } from '@antv/x6'
import { onMounted, ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import PageX6 from './view/page-x6/index.vue';

const x6ContainerRef = ref();
onMounted(() => {
  // const graph = new Graph({
  //   container: x6ContainerRef.value,
  //   width: 800,
  //   height: 600,
  //   background: {
  //     color: '#F2F7FA',
  //   },
  // });
});
</script>

<style scoped>
</style>
