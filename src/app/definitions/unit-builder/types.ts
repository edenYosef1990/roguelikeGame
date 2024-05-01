interface MultiVertUnit {
  setVertRelativeLocation(vertId: string, deg: number, radius: number): void; //move Vert Entity and children accordingly
}

export type VertType = 'line' | 'circle' | 'polygon';

export interface IVertDesc {
  id: string;
  type: VertType; // (line , rectangle ,triangle etc .......)
  //renderedComponent: fabric.Object
  deg: number;
  radius: number;
  children: IVertDesc[];
  idWithinRenderedComp?: number;
}

export interface VertUpdate {
  id: string;
  deg?: number;
  radius?: number;
}

export interface VertUpdateByIndex {
  index: number;
  deg?: number;
  radius?: number;
}

export interface LineVertDesc extends IVertDesc {
  type: 'line';
}

export interface CircleVertDesc extends IVertDesc {
  type: 'circle';
  circleRadius: number;
}

export interface PolygonVertDesc extends IVertDesc {
  type: 'polygon';
  points: { x: number; y: number }[]; //points with position relative to target (set by deg and rad)
}

export interface BuildRes {
  renderedComponentGroup: fabric.Group;
  subreeVertDesc: IVertDesc;
}
