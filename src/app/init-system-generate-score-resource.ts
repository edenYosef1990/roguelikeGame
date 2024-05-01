import { renderedUiProxyDef } from '../built-in-ecs-components';
import { EntityUiObjectProxy } from '../ui/entity-ui-object-proxy';
import { testGrid } from '../ui/grid/test-grid';
import { createSystemWithQueries } from '../world/system/create-system-with-queries';
import { scoreResourceDef } from './definitions/definitions';

export const initUiSystem = createSystemWithQueries({}, (depedencies, _) => {
  depedencies.worldsManager.addResource({ scoreResourceDef }, {});
});
