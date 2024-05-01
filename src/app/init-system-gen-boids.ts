import {
  UnitLabel,
  playerUnitLabel,
  enemyUnitLabel,
  renderedProxyDef,
} from '@eden_yosef/protogame/src/built-in-ecs-components';
import { DependenciesList } from '@eden_yosef/protogame/src/dependencies-management/get-dependencies';
import { KeyTracker } from '@eden_yosef/protogame/src/input-from-devices/input-snapshot';
import {
  generateEntityObject as generatePhysicalObject,
  generateRenderedLine as generateRenderedIndicator,
  generateRenderedObject,
} from '@eden_yosef/protogame/src/physical-object';
import { UiProgressBarTreeNode } from '@eden_yosef/protogame/src/ui/types/ui-progress-bar';
import { Color } from '@eden_yosef/protogame/src/ui/types/ui-tree-node';
import { createSystemWithQueries } from '@eden_yosef/protogame/src/world/system/create-system-with-queries';
import {
  HealthDef,
  UnitsGroup,
  armedUnitWithSwordDef,
  belongToGroupDef,
  debugVector,
  gameStateDef,
  multiVertLabel,
  physicalObjectDef,
  progressBar,
  unitsGroupDef,
} from './definitions/definitions';
import { MultiVertEntityObjectProxy } from './definitions/unit-builder/multi-vert-rendered-object-proxy';
import { CircleVertDesc, LineVertDesc } from './definitions/unit-builder/types';
import { createMultiVertObjectProxy } from './definitions/unit-builder/create-multi-vert-rendered-object-proxy';

export function genProgressBar(
  id: number,
  depedencies: DependenciesList,
  p: { x: number; y: number }
) {
  depedencies.worldsManager.initEntity(
    {
      renderComp: renderedProxyDef,
      progressBar,
    },
    {
      renderComp: new UiProgressBarTreeNode(
        '56',
        50,
        10,
        null,
        p,
        Color.Green,
        Color.LightGray,
        100,
        100
      ).generateWorldObject(),
      progressBar: { belongToEntityId: id },
    }
  );
}

export function genDebugIndicator(
  id: number,
  depedencies: DependenciesList,
  p: { x: number; y: number }
) {
  depedencies.worldsManager.initEntity(
    {
      renderComp: renderedProxyDef,
      debugVector,
    },
    {
      renderComp: generateRenderedIndicator('red', p),
      debugVector: { belongToEntityId: id },
    }
  );
}

export function genBoidEnemy(
  depedencies: DependenciesList,
  x: number,
  y: number
) {
  return depedencies.worldsManager.initEntity(
    {
      worldEntityComp: physicalObjectDef,
      renderComp: renderedProxyDef,
      enemyLabel: playerUnitLabel,
      UnitLabel,
      HealthDef,
    },
    {
      worldEntityComp: generatePhysicalObject({ x, y }, 10),
      renderComp: generateRenderedObject('red', { x, y }, 10),
      enemyLabel: {},
      UnitLabel: {},
      HealthDef: { points: 100 },
    }
  );
}

export function genMultiVert(depedencies: DependenciesList) {
  return depedencies.worldsManager.initEntity(
    {
      renderComp: renderedProxyDef,
      multiVertLabel,
    },
    {
      multiVertLabel,
      renderComp: createMultiVertObjectProxy(
        {
          id: 'cir',
          type: 'circle',
          radius: 0,
          deg: 0,
          circleRadius: 50,
          children: [
            {
              id: 'cir2',
              type: 'line',
              radius: 50,
              deg: 45,
              children: [
                {
                  id: 'cir212',
                  type: 'line',
                  radius: 50,
                  deg: 180,
                  children: [
                    {
                      id: 'cir2112',
                      type: 'circle',
                      radius: 0,
                      deg: 180,
                      circleRadius: 20,
                      children: [],
                    } as CircleVertDesc,
                  ],
                } as LineVertDesc,
              ],
            } as LineVertDesc,
          ],
        } as CircleVertDesc,
        { x: 400, y: 400 }
      ),
    }
  );
}

let counter = 0;

export const moveMultiVert = createSystemWithQueries(
  {
    entities: {
      renderComp: renderedProxyDef,
      label: multiVertLabel,
    },
  },
  (_deps, queryResults) => {
    let renderedComp = queryResults.entities[0]
      .renderComp as MultiVertEntityObjectProxy;

    renderedComp.updateVerts(
      new Map([
        [
          'cir2',
          {
            deg: (counter += 1),
          },
        ],
      ])
    );
  }
);
export function genBoidPlayer(
  depedencies: DependenciesList,
  x: number,
  y: number,
  groupId: number
) {
  return depedencies.worldsManager.initEntity(
    {
      physicalObjectDef,
      renderComp: renderedProxyDef,
      playerLabel: enemyUnitLabel,
      UnitLabel,
      HealthDef,
      belongToGroupDef,
      armedUnitWithSwordDef,
    },
    {
      physicalObjectDef: generatePhysicalObject({ x, y }, 10),
      renderComp: generateRenderedObject('blue', { x, y }, 10),
      playerLabel: {},
      UnitLabel: {},
      HealthDef: { points: 100 },
      belongToGroupDef: { groupId },
      armedUnitWithSwordDef: {
        timeUntilAvailableFireMilisec: 0,
        timeBetweenHits: 700,
        isWeildingSword: false,
        timeLeftForWieldingMilisec: 0,
        weildingTime: 200,
      },
    }
  );
}

export function initGameState(depedencies: DependenciesList) {
  depedencies.worldsManager.initEntity(
    {
      gameState: gameStateDef,
    },
    {
      gameState: {
        ArrowDownTracker: new KeyTracker('ArrowDown'),
        ArrowUpTracker: new KeyTracker('ArrrowUp'),
        ArrowLeftTracker: new KeyTracker('ArrowLeft'),
        ArrowRightTracker: new KeyTracker('ArrowRight'),
      },
    }
  );
}

export const initEntitiesSystem = createSystemWithQueries(
  {
    state: {
      gameState: gameStateDef,
    },
  },
  (depedencies, queryResults) => {
    let group: UnitsGroup = { unitsIds: [] };
    const groupId = depedencies.worldsManager.initEntity(
      { unitsGroupDef },
      {
        unitsGroupDef: group,
      }
    );
    queryResults.state[0].gameState.currentSelectedGroupId = groupId;
    let coords: { pos: { x: number; y: number }; isEnemy: boolean }[] = [
      { pos: { x: 534, y: 512 }, isEnemy: false },
      { pos: { x: 832, y: 160 }, isEnemy: false },
      { pos: { x: 280, y: 280 }, isEnemy: false },
      { pos: { x: 700, y: 200 }, isEnemy: false },

      { pos: { x: 700, y: 700 }, isEnemy: true },
      // { pos: { x: 400, y: 400 }, isEnemy: true },
    ];
    for (const { pos, isEnemy } of coords) {
      let id = isEnemy
        ? genBoidEnemy(depedencies, pos.x, pos.y)
        : genBoidPlayer(depedencies, pos.x, pos.y, groupId);
      if (!isEnemy) {
        // genDebugIndicator(id, depedencies, { x: pos.x + 20, y: pos.y });
        group.unitsIds.push(id);
      }
      genProgressBar(id, depedencies, { x: pos.x, y: pos.y + 10 });
    }
    genMultiVert(depedencies);
  }
);
