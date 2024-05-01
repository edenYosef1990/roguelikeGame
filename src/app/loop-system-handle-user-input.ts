import {
  playerUnitLabel,
  renderedProxyDef,
} from '@eden_yosef/protogame/src/built-in-ecs-components';
import {
  ConcurrentEffectList,
  ConsecutiveEffectsList,
  EffectAndThenAction,
  ShotTrailEffectCommand,
  generateBigExplostionEffectCommand,
  generateGunfireEffectCommand,
} from '@eden_yosef/protogame/src/effects/effect-sequence';
import { updateKeyTrackerFromSnapshot } from '@eden_yosef/protogame/src/input-from-devices/input-snapshot';
import { createSystemWithQueries } from '@eden_yosef/protogame/src/world/system/create-system-with-queries';
import {
  bulletHitEventDef,
  gameStateDef,
  physicalObjectDef,
  unitsGroupDef,
} from './definitions/definitions';
import { UnitEntityObjectProxy } from './unit-rendered-object';

export const trackKeysPressing = createSystemWithQueries(
  {
    state: {
      gameState: gameStateDef,
    },
  },
  (depends, queryResults) => {
    let gameState = queryResults.state[0].gameState;
    let snapshot =
      depends.devicesInputModule.inputFromDevicesCollector.calculateInputSnapshot();
    updateKeyTrackerFromSnapshot(gameState.ArrowDownTracker, snapshot);
    updateKeyTrackerFromSnapshot(gameState.ArrowUpTracker, snapshot);
    updateKeyTrackerFromSnapshot(gameState.ArrowRightTracker, snapshot);
    updateKeyTrackerFromSnapshot(gameState.ArrowLeftTracker, snapshot);
  }
);

export const debugKeysPressing = createSystemWithQueries(
  {
    state: {
      gameState: gameStateDef,
    },
  },
  (depends, queryResults) => {
    let gameState = queryResults.state[0].gameState;
    console.log(`arrow left is down: ${gameState.ArrowLeftTracker.isDown}`);
    // console.log(`arrow right is down: ${gameState.ArrowRightTracker.isDown}`);
    // console.log(`arrow up is down: ${gameState.ArrowUpTracker.isDown}`);
    // console.log(`arrow down is down: ${gameState.ArrowDownTracker.isDown}`);
  }
);

export const handleUserInput = createSystemWithQueries(
  {
    entities: {
      worldEntityComp: physicalObjectDef,
      renderComp: renderedProxyDef,
      playerLabel: playerUnitLabel,
    },
    state: {
      gameState: gameStateDef,
    },
    groups: {
      unitGroups: unitsGroupDef,
    },
  },
  (_deps, queryResults) => {
    const state = queryResults.state[0].gameState;
    const snapshot =
      _deps.devicesInputModule.inputFromDevicesCollector.calculateInputSnapshot();

    if (snapshot.leftMouseKey.isThereClickEventUnconsumed) {
      snapshot.leftMouseKey.isThereClickEventUnconsumed = false;

      queryResults.entities.forEach(({ renderComp }) => {
        let unitRenderedComp = renderComp as UnitEntityObjectProxy;
        _deps.effectsSequenceManager.addSequence(
          generateGunfireEffectCommand(unitRenderedComp.getCanonEdgePosition())
        );
      });

      _deps.effectsSequenceManager.addSequence(
        new EffectAndThenAction(
          new ConsecutiveEffectsList([
            new ConcurrentEffectList(
              queryResults.entities.map(
                ({ worldEntityComp }) =>
                  new ShotTrailEffectCommand(
                    worldEntityComp.position,
                    snapshot.leftMouseKey.currentPosition!,
                    100
                  )
              )
            ),
            generateBigExplostionEffectCommand(
              snapshot.leftMouseKey.currentPosition!
            ),
          ]),
          () => {
            _deps.worldsManager.eventsContainer.addEvent(
              {
                hitPoints: 30,
                hitPosition: snapshot.leftMouseKey.currentPosition!,
                radius: 200,
              },
              bulletHitEventDef
            );
          }
        )
      );
    } else if (snapshot.leftMouseKey.isThereClickEventUnconsumed) {
      const { x, y } = snapshot.leftMouseKey.currentPosition!;
      snapshot.leftMouseKey.isThereClickEventUnconsumed = false;
      let group = queryResults.groups.find(
        ({ id }) => id === state.currentSelectedGroupId
      );
      group!.unitGroups.destination = { x, y };
    }
  }
);

export const handleKeysForMainCharacter = createSystemWithQueries(
  {
    entities: {
      worldEntityComp: physicalObjectDef,
      renderComp: renderedProxyDef,
      enemyLabel: playerUnitLabel,
    },
    state: {
      gameState: gameStateDef,
    },
    groups: {
      unitGroups: unitsGroupDef,
    },
  },
  (_deps, queryResults) => {
    const state = queryResults.state[0].gameState;
    const snapshot =
      _deps.devicesInputModule.inputFromDevicesCollector.calculateInputSnapshot();
    let main = queryResults.entities[0].worldEntityComp;

    const deltaLeft =
      snapshot.keysState.get('ArrowLeft')?.isDown ?? false ? 2 : 0;
    const deltaRight =
      snapshot.keysState.get('ArrowRight')?.isDown ?? false ? 2 : 0;
    const deltaUp = snapshot.keysState.get('ArrowUp')?.isDown ?? false ? 2 : 0;
    const deltaDown =
      snapshot.keysState.get('ArrowDown')?.isDown ?? false ? 2 : 0;
    main.velocity = {
      x: deltaRight - deltaLeft,
      y: deltaDown - deltaUp,
    };
  }
);
