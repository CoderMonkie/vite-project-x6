<template>

  <div v-show="contextMenu.visible" class="graph-context-menu bg-white shadow py-2 select-none"
    style="width: 200px; height: auto; text-align: text-center; position: fixed; border: 1px solid #fff; border-radius: 4px;"
    :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }" @contextmenu="handleOriginContextMenu">

    <div class="context-menu-item cursor-pointer" :class="[
      contextMenu.visible ? 'visible' : '',
      isRootNode ? 'disabled' : ''
    ]" style="height: 32px; line-height: 32px" @click="onCopy">
      复制
    </div>

    <div class="context-menu-item cursor-pointer" :class="[
      contextMenu.visible ? 'visible' : '',
      canPaste ? '' : 'disabled'
    ]" style="height: 32px; line-height: 32px" @click="onPaste">
      粘贴
    </div>

    <div class="context-menu-item cursor-pointer" :class="[
      contextMenu.visible ? 'visible' : '',
      isRootNode ? 'disabled' : ''
    ]" style="height: 32px; line-height: 32px" @click="onCut">
      剪切
    </div>

    <div class="context-menu-item cursor-pointer" :class="[
      contextMenu.visible ? 'visible' : '',
      isRootNode ? 'disabled' : ''
    ]" style="height: 32px; line-height: 32px" @click="onRemove">
      删除
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch, ref } from 'vue';
import { contextMenu, graphRef } from '../../view/page-x6/states';
import useContextMenu from '../../view/page-x6/utils/useContextMenu';
import { Graph } from '@antv/x6';
import { dgLayout } from '../../view/page-x6/utils/dgLayout';
import { onClickRemove } from '../../view/page-x6/utils/useRemoveButton';
import { reconnect } from '../../view/page-x6/utils/graphUtils';

const canPaste = ref(false);

const handleOriginContextMenu = (e) => {
  e.preventDefault();
};

const isRootNode = computed(() => {
  return graphRef.value instanceof Graph
    && contextMenu.currentNode
    && graphRef.value.isRootNode(contextMenu.currentNode);
});

const onCopy = () => {
  if (isRootNode.value) return;

  const incomingEdge = graphRef.value.getIncomingEdges(contextMenu.currentNode)[0];
  const conditionNode = graphRef.value.getCellById(incomingEdge.source.cell);
  // graphRef.value.resetSelection([conditionNode, incomingEdge, contextMenu.currentNode]);
  // const cells = graphRef.value.getSelectedCells();
  const cells = [conditionNode, incomingEdge, contextMenu.currentNode];

  graphRef.value.copy(cells);

  canPaste.value = true;
  contextMenu.visible = false;

};

const onPaste = () => {
  if (!canPaste.value || graphRef.value.isClipboardEmpty()) {
    return;
  }

  const cells = graphRef.value.paste();

  graphRef.value.addEdge({
    source: contextMenu.currentNode,
    target: cells[0],
    attrs: {
      line: {
        stroke: 'var(--rc-edge-color)'
      }
    },
  });

  dgLayout(graphRef.value);

  contextMenu.visible = false;
};

const onCut = () => {
  if (isRootNode.value) return;

  const incomingEdge = graphRef.value.getIncomingEdges(contextMenu.currentNode)[0];
  const conditionNode = graphRef.value.getCellById(incomingEdge.source.cell);

  graphRef.value.copy([conditionNode, incomingEdge, contextMenu.currentNode]);
  onClickRemove(
    {
      view: {
        cell: contextMenu.currentNode,
      }
    },
    graphRef.value,
    contextMenu.currentNode
  );

  canPaste.value = true;
};

const onRemove = () => {
  onClickRemove(
    {
      view: {
        cell: contextMenu.currentNode,
      }
    },
    graphRef.value,
    contextMenu.currentNode
  );
};

watch(graphRef, () => {
  const graph = graphRef.value;
  if (!graph || !(graph instanceof Graph)) return;

  useContextMenu(graph);
}, { immediate: true });


onMounted(() => {
});
</script>

<style>
.context-menu-item {
  color: var(----t-text-color-1);
  padding: 0px 20px;

  &.disabled {
    color: var(--t-text-color-2);
  }
}

.context-menu-item:hover {
  /* color: var(--t-text-color-3); */
  background-color: #eaeaea;
}

.context-menu-item.disabled {
  color: var(--t-text-color-2);
  cursor: not-allowed;
}

.context-menu-item:not(.disabled):hover {
  color: var(--color-primary, #0078d4);
}
</style>