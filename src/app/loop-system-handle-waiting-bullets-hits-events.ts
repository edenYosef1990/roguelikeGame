import { IntervalBetweenFramesMilisecs } from '@eden_yosef/protogame/src/constants';
import { createSystemWithQueries } from '@eden_yosef/protogame/src/world/system/create-system-with-queries';
import { WaitingBulletHit, bulletHitEventDef } from './definitions/definitions';

export const handleWaitingBulletHits = createSystemWithQueries(
  {
    waitingBulletHits: {
      WaitingBulletHit,
    },
  },
  (_deps, queryResults) => {
    for (let { id, WaitingBulletHit: hit } of queryResults.waitingBulletHits) {
      if (hit.timeLeftInMilisec <= 0) {
        _deps.worldsManager.eventsContainer.addEvent(
          {
            hitPoints: hit.hitPoints,
            hitPosition: hit.hitPosition,
            radius: hit.radius,
          },
          bulletHitEventDef
        );
        _deps.worldsManager.removeComponent(id!, WaitingBulletHit);
      }
      hit.timeLeftInMilisec -= IntervalBetweenFramesMilisecs;
    }
  }
);
