import {
  UnitLabel,
  renderedProxyDef,
} from '@eden_yosef/protogame/src/built-in-ecs-components';
import { ProgressBarEntityObjectProxy } from '@eden_yosef/protogame/src/ui/types/ui-progress-bar';
import { createSystemWithQueries } from '@eden_yosef/protogame/src/world/system/create-system-with-queries';
import {
  HealthDef,
  physicalObjectDef,
  progressBar,
} from './definitions/definitions';

export const updateUnitsDisplayedData = createSystemWithQueries(
  {
    unitData: {
      renderComp: renderedProxyDef,
      progressBar,
    },
    playerEntities: {
      worldEntityComp: physicalObjectDef,
      renderComp: renderedProxyDef,
      UnitLabel,
      HealthDef,
    },
  },
  (_deps, queryResults) => {
    for (const { id, progressBar, renderComp } of queryResults.unitData) {
      let boid = queryResults.playerEntities.find(
        (x) => x.id === progressBar.belongToEntityId
      )!;
      let posInfo = boid.worldEntityComp!;
      let boidPos = posInfo.position;
      let progressBarEntityObjectProxy =
        renderComp as ProgressBarEntityObjectProxy;
      progressBarEntityObjectProxy.setValue(boid.HealthDef.points);
      let bar = renderComp.getRenderedObject() as fabric.Group;

      bar.set({
        top: boidPos.y + 10,
        left: boidPos.x,
      });
    }
  }
);
