export function getUpgradeCost(base: number, level: number): number {
  if (level <= 1) {
    return base;
  }

  let a = base;
  let b = base;
  let temp: number;

  for (let i = 2; i < level; i++) {
    temp = a + b;
    a = b;
    b = temp;
  }

  return b;
}
