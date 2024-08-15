<template>
  <div class="rc-node box-shadow node-border rounded bg-white cursor-pointer">
    <section class="px-4 py-2 flex text-white items-center"
      style="background-color: #5d7092;border-radius: 4px 4px 0 0">
      <svgDecision style="width:20px;height:20px;" />
      <div class="text-white ml-2">决策节点 {{ getNode()?.id?.slice(-4) }}</div>
    </section>

    <section class="rc-node--container-inner p-4 flex flex-col justify-center">
      <div v-if="false" class="mb-2">
        <div class="text-color-2">检测项:</div>
        <div class="truncate text-color-1">
          <!-- 示例检测项1、示例检测项2、示例检测项3、示例检测项4 -->
           {{bizObj.checkItems.join(',')}}
        </div>
      </div>

      <div class="">
        <div class="text-color-2">判定规则:</div>
        <div class="truncate text-color-1">
          <!-- 示例判定规则1、示例判定规则2、示例判定规则3、示例判定规则4 -->
           {{bizObj.checkRules.join(',')}}
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import svgDecision from './svg-decision.vue';
import { ref, inject, onMounted, computed } from 'vue';

const getNode = inject('getNode');

const nodeData = getNode().data || {};
const bizObj = ref(nodeData.bizObj);

const nodeBgColor = computed(() => {
  return `var(--t-node-color-exception)`;
});

const init = () => {
  const node = getNode();
  if (!node.data) return;
  console.log('node init', node.data);

  bizObj.value = node.data.bizObj;
};

init();

onMounted(() => {
  const node = getNode();
  node.on('change:data', ({ current }) => {
    console.log('change:data', current);
    bizObj.value = current.bizObj;
  });
});
</script>

<style>
.node-border {
  border: 1px solid #ccc;
}

.rounded {
  border-radius: 8px;
}

.bg-white {
  background-color: #fff;
}

.rc-node {
  width: 300px;
  height: 120px;
}

.text-color-2 {}
</style>