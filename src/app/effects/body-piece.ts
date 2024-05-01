import { fabric } from 'fabric';
import { IntervalBetweenFramesMilisecs } from '@eden_yosef/protogame/src/constants';
import { EffectSequenceProccess } from '@eden_yosef/protogame/src/effects/effect-sequence';
import { IEffect } from '@eden_yosef/protogame/src/effects/efffect';
import {
  normalizeVector,
  vectorAdd,
  vectorSub,
} from '@eden_yosef/protogame/src/utils';

function randomEnd(start: { x: number; y: number }): { x: number; y: number } {
  let deltaX = Math.random() * 50 - 25;
  let deltaY = Math.random() * 50 - 25;
  return vectorAdd(start, { x: deltaX, y: deltaY });
}

export class BodyPieceEffect implements IEffect {
  delta: { x: number; y: number };
  renderedObject: fabric.Circle;
  curr = 0;
  currTime: number = 0;
  isDone = false;
  end: { x: number; y: number };

  constructor(
    radius: number,
    private currentPos: { x: number; y: number },
    private color: { r: number; g: number; b: number },
    private timeDurationInMilisec: number
  ) {
    this.end = randomEnd(this.currentPos);
    this.delta = normalizeVector(vectorSub(this.end, currentPos), 1);
    this.renderedObject = new fabric.Circle({
      radius: radius,
      left: currentPos.x,
      top: currentPos.y,
      originX: 'center',
      originY: 'center',
      fill: `rgb(${color.r},${color.g},${color.b})`,

      hasBorders: false,
      hasControls: false,
      selectable: false,
      hasRotatingPoint: false,
      objectCaching: false,
    });
  }

  update() {
    if (this.isDone) return;
    if (this.currTime >= this.timeDurationInMilisec) {
      this.isDone = true;
    } else {
      const { r, g, b } = this.color;
      const transpency = this.currTime / this.timeDurationInMilisec;
      const color = `rgba(${r},${g},${b},${1 - transpency})`;
      this.renderedObject.set('fill', color);
      this.currentPos = vectorAdd(this.currentPos, this.delta);
      this.renderedObject.set({
        left: this.currentPos.x,
        top: this.currentPos.y,
      });
      this.currTime += IntervalBetweenFramesMilisecs;
    }
  }
}

export class UnitDestroyEffectCommand implements EffectSequenceProccess {
  _isDone = false;
  private totalTime = 1000;
  private timeLeftToNextInterval: number = 0;

  constructor(
    private pos: { x: number; y: number },
    private color: { r: number; g: number; b: number },
    private radius: number
  ) {}

  generateBodyPiece() {
    return new BodyPieceEffect(
      this.radius,
      this.pos,
      this.color,
      this.totalTime
    );
  }

  executeAndTryGetEffects(): IEffect[] | null {
    if (this._isDone) {
      return null;
    }
    this._isDone = true;
    return [
      ...Array.from(Array(15).keys()).map((_) => this.generateBodyPiece()),
    ];
  }

  isDone(): boolean {
    return this._isDone;
  }
}
