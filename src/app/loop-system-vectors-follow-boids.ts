import {
  enemyUnitLabel,
  renderedProxyDef,
} from '@eden_yosef/protogame/src/built-in-ecs-components';
import { vectorAdd, vectorScale } from '@eden_yosef/protogame/src/utils';
import { createSystemWithQueries } from '@eden_yosef/protogame/src/world/system/create-system-with-queries';
import { debugVector, physicalObjectDef } from './definitions/definitions';

export const vectorsFollowBoid = createSystemWithQueries(
  {
    vectors: {
      renderComp: renderedProxyDef,
      debugVector,
    },
    playerEntities: {
      worldEntityComp: physicalObjectDef,
      renderComp: renderedProxyDef,
      playerLabel: enemyUnitLabel,
    },
  },
  (_deps, queryResults) => {
    for (const { id, debugVector, renderComp } of queryResults.vectors) {
      let boid = queryResults.playerEntities.find(
        (x) => x.id === debugVector.belongToEntityId
      )!.worldEntityComp;

      let boidPos = boid.position;
      let line = renderComp.getRenderedObject() as fabric.Line;
      let newPos = vectorAdd(
        vectorScale(boid.debugSperationForce, 20),
        boidPos
      );
      line.set({
        x1: boidPos.x,
        y1: boidPos.y,
        x2: newPos.x,
        y2: newPos.y,
      });
    }
  }
);
