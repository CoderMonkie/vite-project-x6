<template>
  <div class="rc-node-condition box-shadow node-border-gray-300 rounded bg-white w-full h-full cursor-pointer">
    <section>
      <div class="px-4 py-2">
        条件 {{ getNode()?.id?.slice(-4) }}
      </div>
    </section>
    <section>
      <div class="px-4 py-2">
        请设置条件
      </div>
    </section>
  </div>
</template>

<script setup>
// import svgDecision from './svg-decision.vue';
import { ref, inject, onMounted, computed } from 'vue';

const getNode = inject('getNode');

const bizObj = ref();


const init = () => {
  // const node = getNode();
  // if (!node.data) return;
  // console.log('node init', node.data);

  // bizObj.value = node.data.bizObj;
};

init();

onMounted(() => {

});
</script>

<style>
.node-border-gray-300 {
  border: 1px solid #ccc;
}
</style>