import { dgLayout } from "./dgLayout";

const onClickAdd = ({ view }, graph, node) => {
  // TODO 节点ID
  const nowId = Date.now();
  // 创建一个条件节点
  const conditionNode = graph.addNode({
    id: `rc-node-condition-${nowId}`,
    shape: 'rc-node-condition',
    data: {},
    draggable: false,
  });
  // 创建一个决策节点
  const newNode = graph.addNode({
    id: 'rc-node-' + nowId,
    shape: 'rc-node',
    data: {
      ...node.data,
      isRoot: false,
    },
  });
  // 连接前节点和条件节点
  graph.addEdge({
    source: node,
    target: conditionNode,
    // attrs: {
    //   line: {
    //     stroke: 'var(--rc-edge-color)'
    //   }
    // },
  });
  // 连接条件节点和决策节点
  graph.addEdge({
    source: conditionNode,
    target: newNode,
    // attrs: {
    //   line: {
    //     stroke: 'var(--rc-edge-color)'
    //   }
    // },
  });

  dgLayout(graph);
};

export const useAddButton = (graph, node) => {
  node.addTools({
    name: 'button',
    args: {
      markup: [
        {
          tagName: 'circle',
          selector: 'button',
          attrs: {
            r: 10,
            stroke: '#fe854f',
            stroke: '#409eff',
            'stroke-width': 2,
            fill: 'white',
            cursor: 'pointer',
          },
        },
        {
          tagName: 'text',
          textContent: '+',
          selector: 'icon',
          attrs: {
            fill: '#fe854f',
            fill: '#409eff',
            'font-size': 18,
            'text-anchor': 'middle',
            'pointer-events': 'none',
            y: '0.3em',
          },
        },
      ],
      x: '100%',
      y: '50%',
      // offset: { x: 0, y: 0 },
      onClick: (args) => onClickAdd(args, graph, node),
    },
  });
};

export default useAddButton;