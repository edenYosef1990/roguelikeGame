import { getPosition } from '@eden_yosef/protogame/src/utils';
import { CircleVertDesc, IVertDesc, LineVertDesc } from './types';
import { fabric } from 'fabric';
import { Color } from '@eden_yosef/protogame/src/ui/ui-tree-node';

export function VertToRendereditem(
  node: IVertDesc,
  originPos: { x: number; y: number }
): fabric.Object {
  switch (node.type) {
    case 'circle': {
      const circleVert = node as CircleVertDesc;
      const pos = getPosition(originPos, node.radius, node.deg);
      return new fabric.Circle({
        fill: Color.Yellow,
        radius: circleVert.circleRadius ?? 50,
        left: pos.x,
        top: pos.y,
        originX: 'center',
        originY: 'center',
      });
    }
    case 'line': {
      const lineVert = node as LineVertDesc;
      const pos = getPosition(originPos, node.radius, node.deg);
      return new fabric.Line([originPos.x, originPos.y, pos.x, pos.y], {
        stroke: Color.Blue,
        strokeWidth: 5,
      });
    }
    case 'polygon': {
      const circleVert = node as CircleVertDesc;
      const pos = getPosition(originPos, node.radius, node.deg);
      return new fabric.Circle({
        stroke: 'black',
        radius: circleVert.circleRadius ?? 50,
        width: 100,
        height: 100,
        left: pos.x,
        top: pos.y,
        originX: 'center',
        originY: 'center',
      });
    }
  }
}
