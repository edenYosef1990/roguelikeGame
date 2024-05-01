import {
  UnitLabel,
  enemyUnitLabel,
  renderedProxyDef,
} from '@eden_yosef/protogame/src/built-in-ecs-components';
import {
  calculateTotalForce,
  keepMoveInVelocity,
  stop,
} from '@eden_yosef/protogame/src/physical-object';
import { vectorAdd } from '@eden_yosef/protogame/src/utils';
import { createSystemWithQueries } from '@eden_yosef/protogame/src/world/system/create-system-with-queries';
import { physicalObjectDef } from './definitions/definitions';
import { areColliding } from './loop-system-are-colliding';

export const ecsPhysicsSystem = createSystemWithQueries(
  {
    entities: {
      worldEntityComp: physicalObjectDef,
      renderComp: renderedProxyDef,
    },
    playerEntities: {
      worldEntityComp: physicalObjectDef,
      renderComp: renderedProxyDef,
      playerLabel: enemyUnitLabel,
    },
    allUnitsEntities: {
      worldEntityComp: physicalObjectDef,
      renderComp: renderedProxyDef,
      UnitLabel,
    },
  },
  (_deps, queryResults) => {
    for (const {
      id,
      worldEntityComp: entity,
      renderComp,
    } of queryResults.allUnitsEntities) {
      calculateTotalForce(
        entity,
        queryResults.allUnitsEntities
          .filter((x) => x.id !== id)
          .map((x) => x.worldEntityComp)
      ); //extract outside of this system so it can be build in to the engine
      const thereIsNoCollision = queryResults.entities
        .map(({ worldEntityComp }) => worldEntityComp)
        .filter((otherEntity) => otherEntity !== entity)
        .every((otherEntity) => !areColliding(entity, otherEntity));
      if (thereIsNoCollision) {
        keepMoveInVelocity(entity);
        renderComp.setPosition(vectorAdd(entity.position, entity.velocity));
      } else {
        stop(entity);
      }
    }
  }
);
