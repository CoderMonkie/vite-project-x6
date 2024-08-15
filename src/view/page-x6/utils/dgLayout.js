import dagre from '@dagrejs/dagre';
import { NODE_WIDTH, NODE_HEIGHT, DEFAULT_RANK_DIRECTION } from "./constants";
import { rankDirection } from '../states';

// 自动布局
export function dgLayout(graph) {
  const nodes = graph.getNodes();
  const edges = graph.getEdges();

  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: rankDirection.value, nodesep: 60, ranksep: 60 });
  g.setDefaultEdgeLabel(() => ({}));

  const label = {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
  };

  nodes.forEach((node) => {
    // 注意：label不能是同一个引用，否则会改变所有节点的label
    g.setNode(node.id, {...label});
  });

  edges.forEach((edge) => {
    // edge.setRouter({
    //   name: 'manhattan',
    //   params: {
    //     startDirections: [isVertical ? 'bottom' : 'right'],
    //     endDirections: [isVertical ? 'top' : 'left'],
    //   },
    // })
    const source = edge.getSource();
    const target = edge.getTarget();
    g.setEdge(source.cell, target.cell);
  });

  dagre.layout(g);

  g.nodes().forEach((id) => {
    const node = graph.getCellById(id);
    if (node) {
      const pos = g.node(id);
      node.position(pos.x, pos.y);
    }
  });

  // edges.forEach((edge) => {
  //   const source = edge.getSourceNode();
  //   const target = edge.getTargetNode();
  //   const sourceBBox = source.getBBox();
  //   const targetBBox = target.getBBox();

  //   if ((dir === 'LR' || dir === 'RL') && sourceBBox.y !== targetBBox.y) {
  //     const gap =
  //       dir === 'LR'
  //         ? targetBBox.x - sourceBBox.x - sourceBBox.width
  //         : -sourceBBox.x + targetBBox.x + targetBBox.width;
  //     const fix = dir === 'LR' ? sourceBBox.width : 0;
  //     const x = sourceBBox.x + fix + gap / 2;
  //     edge.setVertices([
  //       { x, y: sourceBBox.center.y },
  //       { x, y: targetBBox.center.y },
  //     ]);
  //   } else if (
  //     (dir === 'TB' || dir === 'BT') &&
  //     sourceBBox.x !== targetBBox.x
  //   ) {
  //     const gap =
  //       dir === 'TB'
  //         ? targetBBox.y - sourceBBox.y - sourceBBox.height
  //         : -sourceBBox.y + targetBBox.y + targetBBox.height;
  //     const fix = dir === 'TB' ? sourceBBox.height : 0;
  //     const y = sourceBBox.y + fix + gap / 2;
  //     edge.setVertices([
  //       { x: sourceBBox.center.x, y },
  //       { x: targetBBox.center.x, y },
  //     ]);
  //   } else {
  //     edge.setVertices([]);
  //   }
  // });
}
