import { dgLayout } from "./dgLayout";

export const onClickRemove = ({ view }, graph, node) => {
  const nodeId = node.id;
  const _allEdges = graph.getEdges();
  // 获取节点的前驱和后继节点
  const incomingEdges = _allEdges.filter(edge => edge.target.cell === nodeId);

  // 获取条件节点
  const conditionNode = graph.getCellById(incomingEdges[0].source.cell);

  function reconnect(allEdges, nodeId) {
    // 获取要删除的节点的所有出边和入边
    const edges = allEdges.filter(edge => edge.source.cell === nodeId || edge.target.cell === nodeId);
    // 获取节点的前驱和后继节点
    const incomingEdges = allEdges.filter(edge => edge.target.cell === nodeId);
    const outgoingEdges = allEdges.filter(edge => edge.source.cell === nodeId);

    // 如果存在入边和出边，则连接入边的源节点和出边的目标节点
    incomingEdges.forEach(incomingEdge => {
      const sourceCell = graph.getCellById(incomingEdge.source.cell);
      outgoingEdges.forEach(outgoingEdge => {
        const targetCell = graph.getCellById(outgoingEdge.target.cell);
        if (sourceCell && targetCell) {
          graph.addEdge({
            source: { cell: sourceCell.id },
            target: { cell: targetCell.id },
            attrs: {
              line: {
                stroke: 'var(--rc-edge-color)'
              }
            },
          });
        }
      });
    });
  }
  reconnect(_allEdges, node.id);
  view.cell.remove();
  reconnect(graph.getEdges(), conditionNode.id);
  conditionNode.remove();

  dgLayout(graph);
};

const defineButtonRemove = (graph, node) => {
  return {
    name: 'button-remove',
    args: {
      markup: [
        {
          selector: 'button',
          attrs: {
            r: 10,
          }
        },
      ],
      x: 300,
      y: 4,
      // offset: { x: 18, y: 18 },
      onClick: (args) => {
        onClickRemove(args, graph, node);
      }
    }
  };
};

export const useRemoveButton = (graph, node) => {
  node.addTools(defineButtonRemove(graph, node));
};

export default useRemoveButton;