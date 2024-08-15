
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { Selection } from "@antv/x6-plugin-selection";

import { isVertical, graphRef, contextMenu } from "../states";


export const getConditionNode = (graph, node) => {
  const incomingEdges = graph.getIncomingEdges(node);
  if (incomingEdges && incomingEdges[0]) {
    return graph.getCellById(incomingEdges[0].source.cell);
  }
};


const useContextMenu = (graph) => {
  if (contextMenu.initialized) {
    return;
  }
  contextMenu.initialized = true;

  graph.use(
    new Clipboard({
      enabled: true,
    }),
  );
  // 框选插件
  graph.use(
    new Selection({
      enabled: true,
    }),
  );

  // graph.on('change:*', ({ sx, sy, ox, oy }) => {
  //   contextMenu.visible = false;
  // });
  graph.on('scale', ({ sx, sy, ox, oy }) => {
    contextMenu.visible = false;
  });
  graph.on('resize', ({ width, height }) => {
    contextMenu.visible = false;
  });
  graph.on('translate', ({ tx, ty }) => {
    contextMenu.visible = false;
  });
  graph.on('cell:added', ({ cell, index, options }) => {
    contextMenu.visible = false;
  })
  graph.on('cell:removed', ({ cell, index, options }) => {
    contextMenu.visible = false;
  })
  // graph.on('cell:changed', ({ cell, options }) => {
  //   contextMenu.visible = false;
  // })

  graph.on('blank:click', ({ node }) => {
    contextMenu.visible = false;
  });
  graph.on('blank:contextmenu', ({ node }) => {
    contextMenu.visible = false;
  });
};

export default useContextMenu;