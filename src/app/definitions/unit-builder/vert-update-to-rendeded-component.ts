import { getPosition } from '@eden_yosef/protogame/src/utils';
import { IVertDesc, CircleVertDesc, LineVertDesc } from './types';
import { Color } from '@eden_yosef/protogame/src/ui/ui-tree-node';

export function updateVertRendereditem(
  node: IVertDesc,
  group: fabric.Group,
  index: number,
  originPos: { x: number; y: number }
): void {
  const pos = getPosition(originPos, node.radius, node.deg);
  switch (node.type) {
    case 'circle': {
      const circleVert = node as CircleVertDesc;
      let circleObj = group.item(index) as unknown as fabric.Circle;
      circleObj.set({
        radius: circleVert.circleRadius ?? 50,
        left: pos.x,
        top: pos.y,
      });
      break;
    }
    case 'line': {
      const lineVert = node as LineVertDesc;
      let lineObj = group.item(index) as unknown as fabric.Line;
      lineObj.set({
        stroke: Color.Blue,
        x1: originPos.x,
        y1: originPos.y,
        x2: pos.x,
        y2: pos.y,
      });
      break;
    }
    case 'polygon': {
      // const circleVert = node as fabric.Polygon;
    }
  }
}
