import {
  getVectorZero,
  normalizeVector,
  vectorAdd,
  vectorsAdd,
} from '@eden_yosef/protogame/src/utils';
import {
  calcAlignForce,
  calcCohesionForce,
  calcSteeringForce,
  clacSeperationForce,
} from './forces-calculations';
import {
  PhysicalObject,
  calculateTotalForce,
} from '@eden_yosef/protogame/src/physical-object';
import { createSystemWithQueries } from '@eden_yosef/protogame/src/world/system/create-system-with-queries';
import {
  armedUnitWithSwordDef,
  belongToGroupDef,
  firstUnitOfGroupArrivedEventDef,
  physicalObjectDef,
  unitsGroupDef,
} from '../definitions/definitions';
import {
  UnitLabel,
  enemyUnitLabel,
  renderedProxyDef,
} from '@eden_yosef/protogame/src/built-in-ecs-components';

function calculateExternalForceForGroupMember(
  entityObject: PhysicalObject,
  destination: { x: number; y: number },
  otherGroupUnits: PhysicalObject[],
  allUnits: PhysicalObject[]
) {
  const steeringForce = calcSteeringForce(entityObject, destination);
  if (!steeringForce) {
    return false;
  }
  const alignForce = calcAlignForce(entityObject, otherGroupUnits);
  const seperationForce = clacSeperationForce(entityObject, allUnits);
  entityObject.debugSperationForce = seperationForce;
  const cohesionForce = calcCohesionForce(entityObject, otherGroupUnits);
  entityObject.externalForce = vectorsAdd(
    steeringForce,
    alignForce,
    seperationForce,
    cohesionForce
  );
  return true;
}

export const calculateAdditionalForceForGroupMember = createSystemWithQueries(
  {
    entities: {
      worldEntityComp: physicalObjectDef,
      renderComp: renderedProxyDef,
    },
    enemyUnitsEntities: {
      worldEntityComp: physicalObjectDef,
      renderComp: renderedProxyDef,
      playerLabel: enemyUnitLabel,
      armedUnitWithSwordDef,
      belongToGroupDef,
    },
    allUnitsEntities: {
      worldEntityComp: physicalObjectDef,
      renderComp: renderedProxyDef,
      UnitLabel,
    },
    unitGroups: {
      unitGroups: unitsGroupDef,
    },
  },
  (_deps, queryResults) => {
    queryResults.unitGroups
      .filter((x) => x.unitGroups.destination !== undefined)
      .forEach(({ id: groupId, unitGroups }) => {
        for (const {
          id,
          worldEntityComp: entity,
          armedUnitWithSwordDef,
        } of queryResults.enemyUnitsEntities.filter(
          (x) => x.belongToGroupDef.groupId === groupId
        )) {
          if (armedUnitWithSwordDef.isWeildingSword) {
            entity.externalForce = getVectorZero();
            entity.velocity = getVectorZero();
            entity.acceleration = getVectorZero();
          } else if (
            !calculateExternalForceForGroupMember(
              entity,
              unitGroups.destination!,
              queryResults.enemyUnitsEntities
                .filter((x) => x.id !== id)
                .map((x) => x.worldEntityComp),
              queryResults.allUnitsEntities
                .filter((x) => x.id !== id)
                .map((x) => x.worldEntityComp)
            )
          ) {
            _deps.worldsManager.eventsContainer.addEvent(
              { groupId },
              firstUnitOfGroupArrivedEventDef
            );
          }
        }
      });
  }
);
