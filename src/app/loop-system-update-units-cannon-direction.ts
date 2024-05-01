import {
  UnitLabel,
  renderedProxyDef,
} from '@eden_yosef/protogame/src/built-in-ecs-components';
import { createSystemWithQueries } from '@eden_yosef/protogame/src/world/system/create-system-with-queries';
import { UnitEntityObjectProxy } from './unit-rendered-object';

export const updateUnitsCannonDirection = createSystemWithQueries(
  {
    playerEntities: {
      renderComp: renderedProxyDef,
      UnitLabel,
    },
  },
  (_deps, queryResults) => {
    const snapshot =
      _deps.devicesInputModule.inputFromDevicesCollector.calculateInputSnapshot();
    if (snapshot.leftMouseKey.currentPosition === null) return;
    for (const { renderComp } of queryResults.playerEntities) {
      let unitRenderedComp = renderComp as UnitEntityObjectProxy;

      unitRenderedComp.setCannonDirection(
        snapshot.leftMouseKey.currentPosition
      );
    }
  }
);
