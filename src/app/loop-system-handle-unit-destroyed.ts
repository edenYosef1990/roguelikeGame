import {
  enemyUnitLabel,
  renderedProxyDef,
} from '@eden_yosef/protogame/src/built-in-ecs-components';
import { blueRgbs } from '@eden_yosef/protogame/src/ui/types/ui-tree-node';
import { createSystemWithQueries } from '@eden_yosef/protogame/src/world/system/create-system-with-queries';
import {
  physicalObjectDef,
  progressBar,
  unitDestroyedDef,
} from './definitions/definitions';
import { UnitDestroyEffectCommand } from './effects/body-piece';

export const handleUnitDestroyedEvent = createSystemWithQueries(
  {
    bulletHitsEvents: unitDestroyedDef,
    entities: {
      renderedProxyDef,
      playerLabel: enemyUnitLabel,
      worldEntityComp: physicalObjectDef,
    },
    unitData: {
      renderComp: renderedProxyDef,
      progressBar,
    },
  },
  (_deps, queryResults) => {
    for (let event of queryResults.bulletHitsEvents) {
      let unitDisplayedDataEntity = queryResults.unitData.find(
        (x) => x.progressBar.belongToEntityId === event.unitId
      );
      let entity = queryResults.entities.find(
        (x) => x.id === event.unitId
      )!.worldEntityComp;
      _deps.worldsManager.removeEntity(event.unitId);
      _deps.worldsManager.removeEntity(unitDisplayedDataEntity?.id!);
      _deps.effectsSequenceManager.addSequence(
        new UnitDestroyEffectCommand(entity.position, blueRgbs, 10)
      );
    }
  }
);
