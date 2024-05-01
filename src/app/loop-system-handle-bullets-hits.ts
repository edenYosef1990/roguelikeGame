import {
  enemyUnitLabel,
  renderedProxyDef,
} from '@eden_yosef/protogame/src/built-in-ecs-components';
import { BleedingEffectCommand } from '@eden_yosef/protogame/src/effects/effect-sequence';
import { getVectorLength, vectorSub } from '@eden_yosef/protogame/src/utils';
import { createSystemWithQueries } from '@eden_yosef/protogame/src/world/system/create-system-with-queries';
import {
  HealthDef,
  bulletHitEventDef,
  unitDestroyedDef,
} from './definitions/definitions';
import { SingleFleetingTextEffectCommand } from './effects/fleeting-text';

export const handleBulletHitsEvents = createSystemWithQueries(
  {
    bulletHitsEvents: bulletHitEventDef,
    entities: {
      renderedProxyDef,
      playerLabel: enemyUnitLabel,
      HealthDef,
    },
  },
  (_deps, queryResults) => {
    for (let event of queryResults.bulletHitsEvents) {
      queryResults.entities.find((x) => {
        let pos = x.renderedProxyDef.getPosition();
        if (
          getVectorLength(vectorSub(pos, event.hitPosition)) <
          10 + event.radius
        ) {
          x.HealthDef.points = Math.max(
            0,
            x.HealthDef.points - event.hitPoints
          );
          if (x.HealthDef.points === 0) {
            _deps.worldsManager.eventsContainer.addEvent(
              { unitId: x.id },
              unitDestroyedDef
            );
          }
          _deps.effectsSequenceManager.addSequence(
            new SingleFleetingTextEffectCommand(pos, `-${event.hitPoints}`)
          );
          _deps.effectsSequenceManager.addSequence(
            new BleedingEffectCommand(pos)
          );
        }
      });
    }
  }
);
