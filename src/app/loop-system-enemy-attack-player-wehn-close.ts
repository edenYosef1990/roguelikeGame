import {
  enemyUnitLabel,
  playerUnitLabel,
} from '@eden_yosef/protogame/src/built-in-ecs-components';
import { IntervalBetweenFramesMilisecs } from '@eden_yosef/protogame/src/constants';
import { getVectorLength, vectorSub } from '@eden_yosef/protogame/src/utils';
import { createSystemWithQueries } from '@eden_yosef/protogame/src/world/system/create-system-with-queries';
import {
  armedUnitWithSwordDef,
  physicalObjectDef,
} from './definitions/definitions';
import { SworldAttackEffeCtcommand } from './effects/sword-attack';

export const enemyUnitsAttackPlayerWhenClose = createSystemWithQueries(
  {
    playerEntities: {
      worldEntityComp: physicalObjectDef,
      playerLabel: playerUnitLabel,
    },
    enemyEntities: {
      worldEntityComp: physicalObjectDef,
      enemyLabel: enemyUnitLabel,
      armedUnitWithSwordDef,
    },
  },
  (_deps, queryResults) => {
    let playerPosition =
      queryResults.playerEntities[0].worldEntityComp.position;
    queryResults.enemyEntities.forEach((enemy) => {
      const useSwordData = enemy.armedUnitWithSwordDef;
      if (useSwordData.timeUntilAvailableFireMilisec > 0) {
        //waiting before next hit
        useSwordData.timeUntilAvailableFireMilisec -=
          IntervalBetweenFramesMilisecs;
      } else if (useSwordData.isWeildingSword) {
        // currently weilding sword
        if (useSwordData.timeLeftForWieldingMilisec <= 0) {
          useSwordData.isWeildingSword = false;
        } else {
          useSwordData.timeLeftForWieldingMilisec -=
            IntervalBetweenFramesMilisecs;
        }
      } else {
        const pos = enemy.worldEntityComp.position;
        if (getVectorLength(vectorSub(pos, playerPosition)) < 70) {
          //starting the weilding
          useSwordData.timeUntilAvailableFireMilisec =
            useSwordData.timeBetweenHits;
          useSwordData.timeLeftForWieldingMilisec = useSwordData.weildingTime;
          useSwordData.isWeildingSword = true;
          _deps.effectsSequenceManager.addSequence(
            new SworldAttackEffeCtcommand(pos, playerPosition)
          );
        }
      }
    });
  }
);
