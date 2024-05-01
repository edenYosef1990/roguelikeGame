import { renderedUiProxyDef } from '@eden_yosef/protogame/src/built-in-ecs-components';
import { EntityUiObjectProxy } from '@eden_yosef/protogame/src/ui/types/entity-ui-object-proxy';
import { testGrid } from '@eden_yosef/protogame/src/ui/grid/test-grid';
import { createSystemWithQueries } from '@eden_yosef/protogame/src/world/system/create-system-with-queries';

export const initUiSystem = createSystemWithQueries({}, (depedencies, _) => {
  depedencies.worldsManager.initEntity(
    { renderComp: renderedUiProxyDef },
    { renderComp: new EntityUiObjectProxy(testGrid()) }
  );
});

export const changeUiSystem = createSystemWithQueries(
  {
    ui: {
      renderedUiProxyDef,
    },
  },
  (depedencies, entitiesQuery) => {
    const { id } = entitiesQuery.ui[0];
    // depedencies.worldsManager.replaceUiElement(
    //   id!,
    //   'try',
    //   generateUiTextBuildTreeNode(
    //     'try',
    //     { text: 'replaced!' },
    //     { x: 0, y: 0, width: 200, height: 30 }
    //   )
    // );

    depedencies.worldsManager.changeTextUiElement(id!, 'try', 'new text');
  }
);
