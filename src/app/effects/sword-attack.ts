import { fabric } from 'fabric';
import { IntervalBetweenFramesMilisecs } from '@eden_yosef/protogame/src/constants';
import { EffectSequenceProccess } from '@eden_yosef/protogame/src/effects/effect-sequence';
import { IEffect } from '@eden_yosef/protogame/src/effects/efffect';
import { Color } from '@eden_yosef/protogame/src/ui/ui-tree-node';
import { getDirectionAngle } from '@eden_yosef/protogame/src/utils';

export class RotatingSwordTraceAttackEffect implements IEffect {
  angleOffset: number;
  angleDelta: number;
  renderedObject: fabric.Circle;
  currAngle = 315;
  currTime: number = 0;
  isDone = false;
  endAngle = 100 + 360;

  constructor(
    currentPos: { x: number; y: number },
    target: { x: number; y: number }
  ) {
    this.angleOffset = getDirectionAngle(target, currentPos);
    // this.angleOffset = 45;
    this.currAngle += this.angleOffset;
    this.endAngle += this.angleOffset;
    this.angleDelta = 8;
    // this.angleDelta = 0.2;
    const innerClipPath = new fabric.Circle({
      radius: 50,
      left: currentPos.x,
      top: currentPos.y,
      width: 10,
      height: 100,
      originX: 'center',
      originY: 'center',
      inverted: true,
      absolutePositioned: true,
      //   originX: 'center',
      //   originY: 'center',

      hasBorders: false,
      hasControls: false,
      selectable: false,
      hasRotatingPoint: false,
      objectCaching: false,
    });

    var p1 = currentPos,
      p2 = { x: currentPos.x + 1000, y: currentPos.y },
      p3 = { x: currentPos.x, y: currentPos.y + 1000 };
    var clipPath = new fabric.Polygon([p1, p2, p3], {
      absolutePositioned: true,
      clipPath: innerClipPath,
      angle: this.currAngle,
    });
    this.renderedObject = new fabric.Circle({
      radius: 100,
      left: currentPos.x,
      top: currentPos.y,
      width: 10,
      height: 100,
      fill: Color.LightGray,
      clipPath,
      originX: 'center',
      originY: 'center',
      opacity: 0.5,

      hasBorders: false,
      hasControls: false,
      selectable: false,
      hasRotatingPoint: false,
      objectCaching: false,
    });
  }

  update() {
    if (this.isDone) return;
    if (this.currAngle >= this.endAngle) {
      this.isDone = true;
    } else {
      this.currAngle += this.angleDelta;
      // this.currAngle =
      //   this.currAngle > 360 ? this.currAngle - 360 : this.currAngle;
      this.currTime += IntervalBetweenFramesMilisecs;
    }
  }
}

export class RotatingSwordAttackEffect implements IEffect {
  angleOffset: number;
  angleDelta: number;
  renderedObject: fabric.Rect;
  currAngle = 210;
  currTime: number = 0;
  isDone = false;
  endAngle = 310;

  constructor(
    currentPos: { x: number; y: number },
    private targetPos: { x: number; y: number }
  ) {
    this.angleOffset = getDirectionAngle(targetPos, currentPos);
    // this.angleOffset = 180;
    this.currAngle += this.angleOffset;
    this.endAngle += this.angleOffset;
    if (this.currAngle > this.endAngle) {
      this.currAngle -= 360;
    }
    this.angleDelta = 4;
    // this.angleDelta = 0.1;
    this.renderedObject = new fabric.Rect({
      left: currentPos.x,
      top: currentPos.y,
      angle: this.currAngle,
      width: 10,
      height: 100,
      fill: Color.LightGray,

      hasBorders: false,
      hasControls: false,
      selectable: false,
      hasRotatingPoint: false,
      objectCaching: false,
    });
  }

  update() {
    if (this.isDone) return;
    if (this.currAngle >= this.endAngle) {
      this.isDone = true;
    } else {
      this.currAngle += this.angleDelta;
      this.renderedObject.set({
        angle: this.currAngle,
      });
      this.currTime += IntervalBetweenFramesMilisecs;
    }
  }
}

export class SworldAttackEffeCtcommand implements EffectSequenceProccess {
  _isDone = false;

  constructor(
    private source: { x: number; y: number },
    private target: { x: number; y: number }
  ) {}

  generateFleetingText() {
    return new RotatingSwordAttackEffect(this.source, this.target);
  }

  executeAndTryGetEffects(): IEffect[] | null {
    if (this._isDone) {
      return null;
    }
    this._isDone = true;
    return [
      new RotatingSwordTraceAttackEffect(this.source, this.target),
      this.generateFleetingText(),
    ];
  }

  isDone(): boolean {
    return this._isDone;
  }
}
