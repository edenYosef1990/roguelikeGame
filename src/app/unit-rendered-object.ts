import { fabric } from 'fabric';
import { EntityObjectProxy } from '@eden_yosef/protogame/src/entity-object-proxy';
import { Color } from '@eden_yosef/protogame/src/ui/types/ui-tree-node';
import {
  normalizeVector,
  vectorAdd,
  vectorSub,
} from '@eden_yosef/protogame/src/utils';

export class UnitEntityObjectProxy extends EntityObjectProxy {
  base: fabric.Circle;
  canon: fabric.Line;
  centerPosRelative: { x: number; y: number };
  canonEdgePosition: { x: number; y: number };

  constructor(
    color: string,
    position: { x: number; y: number },
    radius: number | undefined = undefined
  ) {
    let base = new fabric.Circle({
      stroke: 'black',
      radius: radius ?? 50,
      width: 100,
      height: 100,
      fill: color,
      left: position.x,
      top: position.y,
      originX: 'center',
      originY: 'center',
    });
    let center = { x: base.left!, y: base.top! };

    let canon = new fabric.Line(
      [position.x, position.y, position.x + 10, position.y],
      {
        // top: position.y,
        // left: position.x,
        strokeWidth: 5,
        fill: Color.Yellow,
        stroke: Color.LightGray,
      }
    );
    super(
      new fabric.Group([base, canon], {
        originX: 'center',
        originY: 'center',
      })
    );
    this.base = base;
    this.canon = canon;
    let groupBottomRight = super.getPosition();
    this.centerPosRelative = vectorSub(groupBottomRight, center); // relative to bottom right
    this.canonEdgePosition = vectorAdd(this.centerPosRelative, { x: 10, y: 0 });
  }

  override setPosition(postion: { x: number; y: number }) {
    return super.setPosition(vectorAdd(postion, this.centerPosRelative));
  }

  setCannonDirection(targetAbosultePos: { x: number; y: number }) {
    const unitCenterAbosultePos = vectorSub(
      super.getPosition(),
      this.centerPosRelative
    );
    const targetDistanceFromUnit = vectorSub(
      targetAbosultePos,
      unitCenterAbosultePos
    );
    const cannonEdgeDistanceFromUnit = normalizeVector(
      targetDistanceFromUnit,
      40
    );
    this.canonEdgePosition = vectorAdd(
      cannonEdgeDistanceFromUnit,
      unitCenterAbosultePos
    );
    this.canon.set({
      x1: this.centerPosRelative.x,
      y1: this.centerPosRelative.y,
      x2: cannonEdgeDistanceFromUnit.x,
      y2: cannonEdgeDistanceFromUnit.y,
    });
  }

  override getPosition() {
    return vectorSub(super.getPosition(), this.centerPosRelative);
  }

  getCanonEdgePosition() {
    return this.canonEdgePosition;
  }

  setHurtGlowValue(value: number) {
    // this.entityObjectProxy.set({
    //   width: (this.fullProgressWidth * value) / this.maxValue,
    // });
  }
}
