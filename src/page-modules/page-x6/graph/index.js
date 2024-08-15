import { Edge, Node } from "@antv/x6";

export class TreeEdge extends Edge {
  constructor(properties) {
    super({ ...properties });
  }
}
TreeEdge.config({
  //   attrs: {
  //     line: {
  //       stroke: '#bcbcbc'
  //     }
  // attrs: {
  //   line: {
  //     stroke: "#A3B1BF",
  //     // targetMarker: null,
  //   }
  // }
});
Edge.registry.register('tree-edge', TreeEdge, true);