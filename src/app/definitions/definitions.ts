// @eden_yosef/protogame/src
import { KeyTracker } from '@eden_yosef/protogame/src/input-from-devices/input-snapshot';
import { PhysicalObject } from '@eden_yosef/protogame/src/physical-object';
import { GetComponentQueryBaseMethods } from '@eden_yosef/protogame/src/world/component';
import { GetEventsQueryBaseMethods } from '@eden_yosef/protogame/src/world/event';
import { createEventDefintion } from '@eden_yosef/protogame/src/world/state';
import { labelType } from '@eden_yosef/protogame/src/built-in-ecs-components';
import { getResourceQueryBaseMethods } from '@eden_yosef/protogame/src/world/resources';

export interface UnitsGroup {
  unitsIds: number[];
  destination?: { x: number; y: number };
}

export interface GameState {
  currentSelectedGroupId?: number;
  ArrowLeftTracker: KeyTracker;
  ArrowRightTracker: KeyTracker;
  ArrowUpTracker: KeyTracker;
  ArrowDownTracker: KeyTracker;
}

export interface ArmedUnitWithGun {
  timeUntilAvailableFireMilisec: number;
  timeBetweenHits: number;
}

export interface ArmedUnitWithSword {
  timeUntilAvailableFireMilisec: number;
  timeBetweenHits: number;
  isWeildingSword: boolean;
  timeLeftForWieldingMilisec: number;
  weildingTime: number;
}

export const armedUnitWithSwordDef =
  GetComponentQueryBaseMethods<ArmedUnitWithSword>('armed-u-sword');

export const armedUnitWithGunDef =
  GetComponentQueryBaseMethods<ArmedUnitWithGun>('armed-u-gun');

export const gameStateDef =
  GetComponentQueryBaseMethods<GameState>('gameState');

export const unitsGroupDef =
  GetComponentQueryBaseMethods<UnitsGroup>('unitsGroup');

export interface BelongToGroup {
  groupId: number;
}

export const multiVertLabel =
  GetComponentQueryBaseMethods<labelType>('multiVert');

export const belongToGroupDef =
  GetComponentQueryBaseMethods<BelongToGroup>('belongToGroup');

export const physicalObjectDef =
  GetComponentQueryBaseMethods<PhysicalObject>('physicalObject');

export interface UnitDisplayedDataItem {
  belongToEntityId: number;
}

export interface Health {
  points: number;
}

export const HealthDef = GetComponentQueryBaseMethods<Health>('health');

export const debugVector =
  GetComponentQueryBaseMethods<UnitDisplayedDataItem>('debugVector');

export const progressBar =
  GetComponentQueryBaseMethods<UnitDisplayedDataItem>('progressBar');

export interface SimpleEvent {
  points: number;
}

export interface BulletHitEvent {
  hitPosition: { x: number; y: number };
  radius: number;
  hitPoints: number;
}

export interface UnitDestroyedEvent {
  unitId: number;
}

export const bulletHitEventDef = GetEventsQueryBaseMethods<BulletHitEvent>();
export const unitDestroyedDef = GetEventsQueryBaseMethods<UnitDestroyedEvent>();

export interface WaitingBulletHit {
  timeLeftInMilisec: number;
  hitPosition: { x: number; y: number };
  radius: number;
  hitPoints: number;
}

export const WaitingBulletHit =
  GetComponentQueryBaseMethods<WaitingBulletHit>('waitingBulletHit');

export const eventDef = GetEventsQueryBaseMethods<SimpleEvent>();

export interface firstUnitOfGroupArrivedEvent {
  groupId: number;
}
export const firstUnitOfGroupArrivedEventDef =
  GetEventsQueryBaseMethods<firstUnitOfGroupArrivedEvent>();

export enum MyState {
  A,
  B,
  C,
  D,
}

export const stateDef = createEventDefintion<MyState>(MyState.C);

export interface ScoreResource {
  score: number;
}

export const scoreResourceDef = getResourceQueryBaseMethods<ScoreResource>();
