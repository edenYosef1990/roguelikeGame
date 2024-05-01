import { GameLoopScheduler } from '@eden_yosef/protogame/src/scheduler/gameloop-scheduler';
import { detectMouseOverUi } from '@eden_yosef/protogame/src/ui/system-detect-mouse-over-ui';
import {
  initEntitiesSystem,
  initGameState,
  moveMultiVert,
} from './init-system-gen-boids';
import {
  readEventSystem,
  readStateSystem,
  stateIsOk as stateIsC,
  writeEventSystem,
  writeStateSystem,
} from './init-systems-events-read-write';
import { updateUnitsDisplayedData } from './loop-system-update-units-displayed-data';
import {
  handleKeysForMainCharacter,
  handleUserInput,
} from './loop-system-handle-user-input';
import { handleBulletHitsEvents } from './loop-system-handle-bullets-hits';
import { handleWaitingBulletHits } from './loop-system-handle-waiting-bullets-hits-events';
import { ecsPhysicsSystem } from './loop-system-physics';
import { SystemsModuleBuilder } from '@eden_yosef/protogame/src/scheduler/system-module-builder';
import { when } from '@eden_yosef/protogame/src/scheduler/types';
import { MyState, stateDef } from './definitions/definitions';
import { calculateAdditionalForceForGroupMember } from './moving-in-group/loop-calculate-force-for-group-memebers';
import { stopGroupWhenFirstMemeberArriveToDestination } from './moving-in-group/stop-group-when-first-member-arrive-to-destination';
import { updateUnitsCannonDirection } from './loop-system-update-units-cannon-direction';
import { handleUnitDestroyedEvent } from './loop-system-handle-unit-destroyed';
import { enemyUnitsChasePlayer } from './loop-system-enemy-units-chase-player';
import { enemyUnitsAttackPlayerWhenClose } from './loop-system-enemy-attack-player-wehn-close';
import { changeUiSystem, initUiSystem } from './init-system-gen-ui';

export function physicsEcsStartup(
  canvas: fabric.StaticCanvas,
  uiCanvas: fabric.Canvas
) {
  const gameLoopScheduler = new GameLoopScheduler(canvas, uiCanvas);
  gameLoopScheduler.setModule(
    new SystemsModuleBuilder()
      .addInitSystem(initGameState)
      .addInitSystem(initEntitiesSystem)
      .addInitSystem(writeEventSystem)
      .addInitSystem(readEventSystem)
      .addInitSystem(writeStateSystem)
      .addInitSystem(readStateSystem)
      .addInitSystem(initUiSystem)
      .addInitSystem(changeUiSystem)

      .addSystem(stateIsC, when().isEnterState(stateDef, MyState.C))

      .addSystem(detectMouseOverUi)
      .addSystem(handleUserInput)
      .addSystem(enemyUnitsChasePlayer)
      .addSystem(enemyUnitsAttackPlayerWhenClose)
      .addSystem(handleKeysForMainCharacter)
      .addSystem((dependencies) =>
        dependencies.effectsSequenceManager.iterate()
      )
      .addSystem(updateUnitsCannonDirection)
      .addSystem(calculateAdditionalForceForGroupMember)
      .addSystem(stopGroupWhenFirstMemeberArriveToDestination)
      .addSystem(moveMultiVert)
      .addSystem(ecsPhysicsSystem)
      .addSystem(updateUnitsDisplayedData)
      //bullets
      .addSystem(handleWaitingBulletHits)
      .addSystem(handleBulletHitsEvents)
      .addSystem(handleUnitDestroyedEvent)

      .build()
  );
  gameLoopScheduler.startLoop();
}
