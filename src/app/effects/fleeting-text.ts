import { fabric } from 'fabric';
import { IntervalBetweenFramesMilisecs } from '@eden_yosef/protogame/src/constants';
import { EffectSequenceProccess } from '@eden_yosef/protogame/src/effects/effect-sequence';
import { IEffect } from '@eden_yosef/protogame/src/effects/efffect';
import { vectorAdd } from '@eden_yosef/protogame/src/utils';

export class FlletingTextEffect implements IEffect {
  delta: { x: number; y: number };
  renderedObject: fabric.Text;
  curr = 0;
  currTime: number = 0;
  isDone = false;

  constructor(
    private text: string,
    private currentPos: { x: number; y: number },
    private color: { r: number; g: number; b: number },
    private timeDurationInMilisec: number
  ) {
    this.delta = { x: 0, y: -1 };
    this.renderedObject = new fabric.Text(this.text, {
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

export class SingleFleetingTextEffectCommand implements EffectSequenceProccess {
  current: { x: number; y: number };
  _isDone = false;

  constructor(start: { x: number; y: number }, private text: string) {
    this.current = start;
  }

  generateFleetingText() {
    return new FlletingTextEffect(
      this.text,
      this.current,
      { r: 164, b: 23, g: 32 },
      500
    );
  }

  executeAndTryGetEffects(): IEffect[] | null {
    if (this._isDone) {
      return null;
    }
    this._isDone = true;
    return [this.generateFleetingText()];
  }

  isDone(): boolean {
    return this._isDone;
  }
}
