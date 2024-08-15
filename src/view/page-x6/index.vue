<template>
  <div class="app-content h-full w-full">
    <div v-if="isReady" ref="graphRef" id="container" style="width: 100%; height: 100%"></div>
    <TeleportContainer />

    <NodeContextMenu />

    <div class="options" style="position: fixed; top: 40px; right: 60px">
      <!-- <button @click="onClickInit">初始化决策树</button> -->
      <button @click="onClickSave">保存</button>
      <button @click="onClickRestore">导入</button>

      <div>
        <!-- <label for="mode" class="flex items-center py-2">
          <input type="checkbox" name="mode" id="mode" v-model="isRuntimeMode">
          运行时
        </label> -->
        <!-- <label for="mode" class="flex items-center py-2">
          <input type="checkbox" name="mode" id="mode" v-model="isVertical" @change="onDirectionChange">
          true：竖版 | false：横版
        </label> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineComponent, nextTick, ref, onMounted } from 'vue';
import RcNode from '../../components/rc-node/index.vue';
import RcNodeCondtion from '../../components/rc-edge/node-condition.vue';
import NodeContextMenu from '../../components/context-menu/index.vue';

import { Graph, Edge } from '@antv/x6';
import { register, getTeleport } from '@antv/x6-vue-shape';
// import { Scroller } from '@antv/x6-plugin-scroller';

import { useEvents } from './utils/events';
import { dgLayout } from './utils/dgLayout';

import { isVertical, graphRef, envMode } from './states';
import { Shape } from '@antv/x6';

register({
  shape: 'rc-node',
  width: 300,
  height: 120,
  component: RcNode,
  attrs: {
    body: {
      cursor: 'pointer',
    },
  },
});
register({
  shape: 'rc-node-condition',
  width: 300,
  height: 120,
  component: RcNodeCondtion,
});
const TeleportContainer = getTeleport();

const isRuntimeMode = ref(false);
const strMode = computed(() => {
  return isRuntimeMode.value ? 'runtime' : 'designer';
});

const isReady = ref(false);

const addNode = () => {
  const node2 = graphRef.value.addNode({
    id: 'rc-node-2',
    shape: 'rc-node',
    x: 400,
    y: 360,
    data: {
      mode: strMode.value,
      bizObj: {
        id: 'rc-node-2',
        checkItems: ['示例检测项1', '示例检测项2', '示例检测项3', '示例检测项4'],
        checkRules: ['示例判定规则1', '示例判定规则2', '示例判定规则3', '示例判定规则4'],
        checkResult: false,
      },
    },
    ports: {
      groups: {
        group1: {
          position: 'top',
        },
        group2: {
          position: 'right',
        },
        group3: {
          position: 'bottom',
        },
        group4: {
          position: 'left',
        },
      },
      items: [
        {
          group: 'group1',
          args: {
            dx: 2,
          },
        },
        {
          group: 'group2',
          args: {
            dx: 2,
          },
        },
        {
          group: 'group3',
          args: {
            // dx: 2,
          },
        },
        {
          group: 'group4',
          args: {
            // dx: 2,
          },
        },
      ],
    },
  });
};

const initGraph = () => {
  // 预设统一的连线样式
  Shape.Edge.config({
    attrs: {
      line: {
        stroke: 'var(--rc-edge-color)',
      },
    }
  });
  graphRef.value = new Graph({
    container: document.getElementById('container'),
    // container: this.$refs.graphRef,
    background: {
      color: '#F2F7FA',
    },
    interacting: {
      nodeMovable: false,
      edgeMovable: false,
    },
    panning: true,
    mousewheel: {
      enabled: true,
      modifiers: 'Ctrl',
      maxScale: 4,
      minScale: 0.2,
    },
    connecting: {
      connector: 'rounded',
      router: {
        name: 'manhattan',
        args: {
          padding: 20,
          startDirections: [isVertical.value ? 'bottom' : 'right'],
          endDirections: [isVertical.value ? 'top' : 'left'],
        },
      },
      //   sourceAnchor: {
      //     name: 'bottom', // 锚点会在节点右侧中心往上偏移 10px
      //     args: {
      //       dy: -10,
      //     },
      //   },
      //   targetAnchor: {
      //     name: 'right', // 锚点会在节点右侧中心往上偏移 10px
      //     args: {
      //       dy: -10,
      //     },
      //   },
      //   connectionPoint: 'boundary',
    },
    autoResize: true,
    grid: {
      visible: true,
      type: 'doubleMesh',
      args: [
        {
          color: '#eee', // 主网格线颜色
          thickness: 1, // 主网格线宽度
        },
        {
          color: '#ddd', // 次网格线颜色
          thickness: 1, // 次网格线宽度
          factor: 4, // 主次网格线间隔
        },
      ],
    },
  });

  // graphRef.value.use(new Scroller({
  //   enabled: true,
  //   pannable: true,
  // }));

  if (envMode.value === 'designtime') {
    useEvents(graphRef.value, { isVertical });

    const node1 = graphRef.value.addNode({
      id: 'rc-node-1',
      shape: 'rc-node',
      x: 400,
      y: 60,
      data: {
        isRoot: true,
        mode: strMode.value,
        bizObj: {
          id: 'rc-node-1',
          checkItems: ['示例检测项1', '示例检测项2', '示例检测项3', '示例检测项4'],
          checkRules: ['示例判定规则1', '示例判定规则2', '示例判定规则3', '示例判定规则4'],
          checkResult: true,
        },
      },
      // ports: createPorts(),
    });
  }
  // graphRef.value.zoomToFit({ maxScale: 1 });
  // graphRef.value.centerContent();
};

const onClickInit = () => {
  graphRef.value && graphRef.value.clearCells();
  initGraph();
};

const onDirectionChange = () => {
  if (!graphRef.value) return;

  // 修改边的 router 属性
  const edges = graphRef.value.getEdges();
  // edges.forEach(edge => {
  //   edge.setRouter({
  //     name: 'manhattan',
  //     params: {
  //       startDirections: [isVertical.value ? 'bottom' : 'right'],
  //       endDirections: [isVertical.value ? 'top' : 'left'],
  //     },
  //   });
  // });

  dgLayout(graphRef.value);
};

const onClickSave = () => {
  const graphData = graphRef.value && graphRef.value.toJSON();
  console.log('graphData', graphData);
};

const onClickRestore = async () => {
  envMode.value = 'runtime';

  const graphRouterNodes = [
    { id: 'rc-node-1' },
    { id: "rc-node-condition-1724123742664", },
    { id: "rc-node-1724123742664", },
    { id: 'c82c8eb0-6018-4e8e-826a-2b8f405192dd' },
    { id: '54974a35-fd2e-488e-a63a-21179c3aef97' },
  ];
  const graphRouterEdges = [
    { id: '3ef4042b-cc7a-4864-b366-5b0e8ac95654' },
    { id: 'b62e5fc6-38f1-4f07-b161-d45bb8d390bd' },
    { id: 'f26abab5-ac59-4f3a-ace0-32f14fa26f32' },
    { id: 'dfeff89f-ed80-44a8-865e-b1f2a437e681' },
  ];

  initGraph();

  const data1 = await import('./mockData/graphData1.json');
  graphRef.value.fromJSON(data1.default);

  const allCells = graphRef.value.getCells();
  allCells.forEach(cell => {
    if ((cell.shape === 'rc-node-condition' || cell.shape === 'rc-node') && graphRouterNodes.find(item => item.id === cell.id)) {
      cell.addTools({
        name: 'boundary',
        args: {
          padding: 16,
          attrs: {
            stroke: 'var(--rc-boundary-color-selected)',
            strokeWidth: 2,
          }
        }
      });
    }

    if (cell.shape === 'edge' && graphRouterEdges.find(item => item.id === cell.id)) {
      cell.zIndex = allCells.length;
      cell.attr('line/stroke', '#1890ff');
      cell.attr('line/strokeDasharray', '5');
      cell.attr('line/style/animation', 'flowing-line 30s infinite linear');
    }
  });
};

onMounted(() => {
  isReady.value = true;

  setTimeout(() => {
    initGraph();
  });
});
</script>
