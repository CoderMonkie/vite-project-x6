import dagre from '@dagrejs/dagre';
import { dgLayout } from './dgLayout';
import { contextMenu } from '../states';
// import { TreeEdge } from '../../../page-modules/page-x6/graph';
import useAddButton from './useAddButton';
import useRemoveButton from './useRemoveButton';

const toolBoundary = (isHover) => {
  return {
    name: 'boundary',
    args: {
      padding: 16,
      attrs: {
        stroke: isHover ? 'var(--rc-boundary-color-selected)' : 'var(--rc-boundary-color)',
        strokeWidth: 2,
      }
    }
  };
};

export const useEvents = (graph, options) => {

  // 鼠标 Hover 时添加按钮
  graph.on('node:mouseenter', ({ node }) => {
    console.log('node:mouseenter', node);
    node.removeTools();

    node.addTools(toolBoundary(true));

    // 条件节点不显示删除按钮和添加按钮，只显示边界
    if (node.shape === 'rc-node-condition') {
      return;
    }
    // 非条件节点

    // button-add
    useAddButton(graph, node);

    // 如果是根节点，只显示添加按钮，不显示删除按钮
    if (node.data.isRoot) {
      return;
    }

    // button-remove
    // node.addTools(toolRemove(graph, node));
    useRemoveButton(graph, node);
  });

  // 鼠标移开时删除按钮
  graph.on('node:mouseleave', ({ node }) => {
    node.removeTools();
    if (node.data.isCurrentNode) {
      node.addTools(toolBoundary());
    }
  });

  graph.on('node:click', ({ node }) => {
    console.log('node:click', node);
    contextMenu.visible = false;

    const nodes = graph.getNodes();
    nodes.forEach(n => {
      const isCurrentNode = n.id === node.id;
      !isCurrentNode && n.removeTools();

      n.setData({
        ...n.data,
        isCurrentNode,
      });
    });

    node.addTools(toolBoundary());
    graph.resetSelection(node)
  });

  graph.on('node:contextmenu', ({ e, x, y, node }) => {
    console.log('node:contextmenu', e, x, y, node);
    contextMenu.visible = false;
    if (node.shape !== 'rc-node') {
      return;
    }

    console.log('isRoot', graph.isRootNode(node))
    
    const localPosition = graph.localToClient({ x, y });
    const { x: clientX, y: clientY } = localPosition;
    
    contextMenu.x = clientX;
    contextMenu.y = clientY;
    contextMenu.visible = true;
    contextMenu.currentNode = node;
  });

  graph.on('blank:click', ({ node }) => {
    const nodes = graph.getNodes();
    nodes.forEach(n => {
      n.removeTools();
    });
  });

  /**
   * Edge
   */

  graph.on('edge:mouseenter', ({ edge }) => {
    edge.attr('line/stroke', 'var(--rc-edge-color-hover');
    // 解决hover时路径遮盖显示不完整的问题
    edge.setData({ zIndex: edge.zIndex });
    edge.zIndex = 999;
  });
  graph.on('edge:mouseleave', ({ edge }) => {
    edge.attr('line/stroke', 'var(--rc-edge-color');
    edge.zIndex = edge.data.zIndex;
  });
};

export const useEventRuntime = () => {}