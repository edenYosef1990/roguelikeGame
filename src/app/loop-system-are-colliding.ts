import {
  PhysicalObject,
  getFuturePosition,
} from '@eden_yosef/protogame/src/physical-object';
import { getVectorLength, vectorSub } from '@eden_yosef/protogame/src/utils';

export function areColliding(
  entity: PhysicalObject,
  otherEntity: PhysicalObject
): boolean {
  const distance = getVectorLength(
    vectorSub(getFuturePosition(entity), otherEntity.position)
  );

  return distance < entity.radius + otherEntity.radius;
}
