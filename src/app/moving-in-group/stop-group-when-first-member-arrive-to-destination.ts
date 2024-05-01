import { createSystemWithQueries } from '@eden_yosef/protogame/src/world/system/create-system-with-queries';
import {
  belongToGroupDef,
  firstUnitOfGroupArrivedEventDef,
  physicalObjectDef,
  unitsGroupDef,
} from '../definitions/definitions';
import {
  UnitLabel,
  renderedProxyDef,
} from '@eden_yosef/protogame/src/built-in-ecs-components';
import { getVectorZero } from '@eden_yosef/protogame/src/utils';

export const stopGroupWhenFirstMemeberArriveToDestination =
  createSystemWithQueries(
    {
      units: {
        worldEntityComp: physicalObjectDef,
        renderComp: renderedProxyDef,
        belongToGroupDef,
      },
      unitGroups: {
        unitGroups: unitsGroupDef,
      },
      unitFromGroupStopped: firstUnitOfGroupArrivedEventDef,
    },
    (_deps, queryResults) => {
      for (const event of queryResults.unitFromGroupStopped) {
        console.log(event);
        let groupId = event.groupId;
        let group = queryResults.unitGroups.find(({ id }) => id === groupId)!;
        group.unitGroups.destination = undefined;

        let units = queryResults.units.filter(
          (x) => x.belongToGroupDef.groupId === groupId
        );

        units.forEach((unit) => {
          unit.worldEntityComp.velocity = getVectorZero();
          unit.worldEntityComp.acceleration = getVectorZero();
          unit.worldEntityComp.externalForce = getVectorZero();
        });
      }
    }
  );
