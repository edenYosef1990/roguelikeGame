import { fabric } from 'fabric';
import { EntityObjectProxy } from '@eden_yosef/protogame/src/entity-object-proxy';
import {
  getPosition,
  getVectorZero,
  vectorSub,
} from '@eden_yosef/protogame/src/utils';
import { IVertDesc } from './types';
import { updateVertRendereditem } from './vert-update-to-rendeded-component';

export class MultiVertEntityObjectProxy extends EntityObjectProxy {
  centerPosRelative: { x: number; y: number };

  constructor(
    private vertTreeRoot: IVertDesc,
    private group: fabric.Group,
    private objectsIndexesDict: Map<string, number>,
    private originalPos: { x: number; y: number },
    private posOfRootObject: { x: number; y: number }
  ) {
    super(group);
    const obj = group.item(0);
    console.log(`x: ${obj.left}, y: ${obj.top}`);
    let center = posOfRootObject;
    let groupBottomRight = super.getPosition();
    console.log(groupBottomRight);
    this.centerPosRelative = { x: obj.left!, y: obj.top! }; // relative to bottom right
  }

  updateVerts(
    updates: Map<
      string,
      {
        deg?: number;
        radius?: number;
      }
    >
  ) {
    this.updateVertsRec(
      this.vertTreeRoot,
      false,
      updates,
      this.centerPosRelative,
      0
    );
  }

  updateVertsStraightIndexes(
    updates: Map<
      number,
      {
        deg?: number;
        radius?: number;
      }
    >
  ) {
    this.updateVertsByIndexRec(
      this.vertTreeRoot,
      false,
      updates,
      this.centerPosRelative,
      0
    );
  }

  getIndexesDict() {
    return new Map(this.objectsIndexesDict);
  }

  updateVertsRec(
    vertTree: IVertDesc,
    isFatherDirty: boolean,
    updates: Map<
      string,
      {
        deg?: number;
        radius?: number;
      }
    >,
    originPos: { x: number; y: number },
    rad: number
  ) {
    let updateForCurrentNode = updates.get(vertTree.id);
    const isDirty = isFatherDirty || updateForCurrentNode !== undefined;

    if (isDirty) {
      if (updateForCurrentNode) {
        vertTree.deg = updateForCurrentNode.deg ?? vertTree.deg;
        vertTree.radius = updateForCurrentNode.radius ?? vertTree.radius;
      }
      let index = this.objectsIndexesDict.get(vertTree.id);
      updateVertRendereditem(vertTree, this.group, index!, originPos);
    }
    originPos = getPosition(originPos, vertTree.radius, vertTree.deg);

    for (let child of vertTree.children) {
      this.updateVertsRec(
        child,
        isDirty,
        updates,
        originPos,
        rad + vertTree.deg
      );
    }
  }

  updateVertsByIndexRec(
    //exists for optimizations reasons. is it effective? I dunno
    vertTree: IVertDesc,
    isFatherDirty: boolean,
    updates: Map<
      number,
      {
        deg?: number;
        radius?: number;
      }
    >,
    originPos: { x: number; y: number },
    deg: number
  ) {
    let updateForCurrentNode = updates.get(vertTree.idWithinRenderedComp!);
    const isDirty = isFatherDirty || updateForCurrentNode !== undefined;

    if (isDirty) {
      if (updateForCurrentNode) {
        vertTree.deg = updateForCurrentNode.deg ?? vertTree.deg;
        vertTree.radius = updateForCurrentNode.radius ?? vertTree.radius;
      }
      updateVertRendereditem(
        vertTree,
        this.group,
        vertTree.idWithinRenderedComp!,
        originPos
      );
    }
    originPos = getPosition(originPos, vertTree.radius, vertTree.deg);

    for (let child of vertTree.children) {
      this.updateVertsByIndexRec(
        child,
        isDirty,
        updates,
        originPos,
        deg + vertTree.deg
      );
    }
  }
}
