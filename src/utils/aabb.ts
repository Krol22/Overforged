export function aabb(x: number, y: number, w: number, h: number, x2: number, y2: number, w2: number, h2: number): boolean {
  const xOverlap = Math.max(0, Math.min(x + w, x2 + w2) - Math.max(x, x2));
  const yOverlap = Math.max(0, Math.min(y + h, y2 + h2) - Math.max(y, y2));
  
  return xOverlap > 0 && yOverlap > 0;

}
