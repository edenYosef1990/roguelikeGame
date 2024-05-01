import { PhysicalObject } from '@eden_yosef/protogame/src/physical-object';
import {
  divVector,
  getVectorLength,
  getVectorZero,
  normalizeVector,
  vectorAdd,
  vectorSub,
} from '@eden_yosef/protogame/src/utils';

const radius = 10;

export function clacSeperationForce(
  entityObject: PhysicalObject,
  otherEntities: PhysicalObject[]
) {
  let maxSpeed = 3;
  let closeEntities = otherEntities.filter(
    (curr) =>
      getVectorLength(vectorSub(entityObject.position, curr.position)) < 400
  );
  if (closeEntities.length > 0) {
    let sum = closeEntities.reduce((prev, curr) => {
      let dist = vectorSub(entityObject.position, curr.position);
      return length < 400
        ? vectorAdd(
            prev,
            normalizeVector(dist, 500 / (getVectorLength(dist) - 2 * radius))
          )
        : getVectorZero();
    }, getVectorZero());
    const avg = divVector(sum, closeEntities.length);
    const desiredVelocity = normalizeVector(avg, maxSpeed);
    return vectorSub(avg, entityObject.velocity);
  }
  return getVectorZero();
}

export function calcCohesionForce(
  entityObject: PhysicalObject,
  otherEntities: PhysicalObject[]
) {
  const sum = otherEntities.reduce(
    (prev, curr) => vectorAdd(prev, curr.position),
    getVectorZero()
  );
  let maxSpeed = 3;
  const avg = divVector(sum, otherEntities.length);
  const distanceVector = vectorSub(avg, entityObject.position);
  const desiredVelocity = normalizeVector(distanceVector, maxSpeed);
  return vectorSub(desiredVelocity, entityObject.velocity);
}

export function calcAlignForce(
  entityObject: PhysicalObject,
  otherEntities: PhysicalObject[]
) {
  let maxSpeed = 3;
  const sum = otherEntities.reduce(
    (prev, curr) => vectorAdd(prev, curr.velocity),
    getVectorZero()
  );
  const avg = divVector(sum, otherEntities.length);
  const desiredVelocity = normalizeVector(avg, maxSpeed);
  return vectorSub(desiredVelocity, entityObject.velocity);
}

export function calcSteeringForce(
  entityObject: PhysicalObject,

  destination: { x: number; y: number }
): {
  x: number;
  y: number;
} | null {
  if (destination === null) return { x: 0, y: 0 };

  let maxSpeed = 3;
  const distanceVector = vectorSub(destination, entityObject.position);
  const distance = getVectorLength(distanceVector);
  if (distance < entityObject.proximityLimitForAcc) {
    maxSpeed = (maxSpeed * distance) / entityObject.proximityLimitForAcc;
  }
  if (distance < entityObject.proximityLimitForMovement) {
    return null;
  }
  const desiredVelocity = normalizeVector(distanceVector, maxSpeed);
  return vectorSub(desiredVelocity, entityObject.velocity);
}
