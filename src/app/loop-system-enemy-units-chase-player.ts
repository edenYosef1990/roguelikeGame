import {
  playerUnitLabel,
  renderedProxyDef,
} from '@eden_yosef/protogame/src/built-in-ecs-components';
import { createSystemWithQueries } from '@eden_yosef/protogame/src/world/system/create-system-with-queries';
import {
  gameStateDef,
  physicalObjectDef,
  unitsGroupDef,
} from './definitions/definitions';

export const enemyUnitsChasePlayer = createSystemWithQueries(
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
    let playerPosition = queryResults.entities[0].worldEntityComp.position;
    let group = queryResults.groups.find(
      ({ id }) => id === state.currentSelectedGroupId
    );
    group!.unitGroups.destination = playerPosition;
  }
);
