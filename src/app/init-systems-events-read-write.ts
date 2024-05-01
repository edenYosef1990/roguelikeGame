import { createSystemWithQueries } from '@eden_yosef/protogame/src/world/system/create-system-with-queries';
import { MyState, eventDef, stateDef } from './definitions/definitions';

export const writeEventSystem = createSystemWithQueries(
  {},
  (_deps, queryResults) => {
    _deps.worldsManager.eventsContainer.addEvent({ points: 42 }, eventDef);
  }
);

export const readEventSystem = createSystemWithQueries(
  {
    event: eventDef,
  },
  (_deps, queryResults) => {
    console.log(queryResults.event[0].points);
  }
);

export const writeStateSystem = createSystemWithQueries(
  {},
  (_deps, queryResults) => {
    _deps.worldsManager.setState(stateDef, MyState.C);
  }
);

export const readStateSystem = createSystemWithQueries(
  {
    event: stateDef,
  },
  (_deps, queryResults) => {
    console.log(queryResults.event);
  }
);

export const stateIsOk = createSystemWithQueries({}, (_deps, queryResults) => {
  console.log('it works');
});
