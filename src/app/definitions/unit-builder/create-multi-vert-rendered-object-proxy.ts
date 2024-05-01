import { fabric } from 'fabric';
import { getPosition } from '@eden_yosef/protogame/src/utils';
import { IVertDesc } from './types';
import { MultiVertEntityObjectProxy } from './multi-vert-rendered-object-proxy';
import { VertToRendereditem } from './vert-create-to-rendered-component';

export function indexVertTreeRec(vertTree: IVertDesc, currIndex: number) {
  vertTree.idWithinRenderedComp = currIndex;
  for (let node of vertTree.children) {
    indexVertTreeRec(node, ++currIndex);
  }
}

function indexVertTree(vertTree: IVertDesc) {
  indexVertTreeRec(vertTree, 0);
}

function BuildRenderedObjectsPerNode(
  originPos: { x: number; y: number },
  vertTree: IVertDesc,
  objectsDict: Map<string, fabric.Object>,
  idsDict: Map<string, number>
) {
  objectsDict.set(vertTree.id, VertToRendereditem(vertTree, originPos));
  idsDict.set(vertTree.id, vertTree.idWithinRenderedComp!);
  const pos = getPosition(originPos, vertTree.radius, vertTree.deg);
  for (let child of vertTree.children) {
    BuildRenderedObjectsPerNode(pos, child, objectsDict, idsDict);
  }
}

function mapToSortedIdGroup(dict: Map<string, number>): string[] {
  let list: { id: string; index: number }[] = [];
  for (let objectId of dict.keys()) {
    list.push({ id: objectId, index: dict.get(objectId)! });
  }
  list.sort((a, b) => a.index - b.index);
  return list.map((x) => x.id);
}

export function createMultiVertObjectProxy(
  vertTreeRoot: IVertDesc,
  originalPos: { x: number; y: number }
) {
  let objectsDict = new Map<string, fabric.Object>();
  let idsDict = new Map<string, number>();
  indexVertTree(vertTreeRoot);
  BuildRenderedObjectsPerNode(originalPos, vertTreeRoot, objectsDict, idsDict);
  let idArray = mapToSortedIdGroup(idsDict);
  const RootObject = objectsDict.get(idArray[0])!;
  const posOfRootObject = { x: RootObject.left!, y: RootObject.top! };
  console.log(posOfRootObject);
  let group = idArray.map((x) => objectsDict.get(x)!);
  let groupedObject = new fabric.Group(group);
  return new MultiVertEntityObjectProxy(
    vertTreeRoot,
    groupedObject,
    idsDict,
    originalPos,
    posOfRootObject
  );
}
