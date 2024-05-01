export const degreesToRads = (deg: number) => (deg * Math.PI) / 180.0;

export function calcPosAroundCenter(
  pos: { x: number; y: number },
  rad: number,
  deg: number
) {
  const deltaX = rad * Math.cos(degreesToRads(deg));
  const deltaY = rad * Math.sin(degreesToRads(deg));
  return { x: pos.x + deltaX, y: pos.y + deltaY };
}
