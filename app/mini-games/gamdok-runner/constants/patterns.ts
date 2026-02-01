export type ObstacleType = 'bottom' | 'top' | 'gap' | 'hole';

export const OBSTACLE_PATTERNS: ObstacleType[][] = [
  ['gap', 'bottom', 'gap', 'top', 'gap'],
  ['gap', 'gap', 'bottom', 'gap', 'top'],
  ['bottom', 'gap', 'gap', 'bottom', 'gap'],
  ['top', 'gap', 'gap', 'top', 'gap'],

  ['bottom', 'gap', 'top', 'gap', 'bottom'],
  ['top', 'gap', 'bottom', 'gap', 'top'],
  ['hole', 'gap', 'bottom', 'gap', 'top'],
  ['bottom', 'gap', 'hole', 'gap', 'bottom'],
  ['top', 'gap', 'hole', 'gap', 'top'],

  ['bottom', 'gap', 'gap', 'top', 'gap', 'bottom'],
  ['top', 'gap', 'gap', 'bottom', 'gap', 'top'],
  ['gap', 'bottom', 'gap', 'top', 'gap', 'hole'],
  ['gap', 'top', 'gap', 'bottom', 'gap', 'hole'],

  ['bottom', 'gap', 'bottom', 'gap', 'top'],
  ['top', 'gap', 'top', 'gap', 'bottom'],
  ['bottom', 'gap', 'top', 'gap', 'top'],
  ['top', 'gap', 'bottom', 'gap', 'bottom'],

  ['bottom', 'gap', 'bottom', 'gap', 'bottom'],
  ['top', 'gap', 'top', 'gap', 'top'],
  ['bottom', 'gap', 'top', 'gap', 'bottom', 'gap', 'top'],

  ['hole', 'gap', 'hole', 'gap', 'bottom'],
  ['hole', 'gap', 'hole', 'gap', 'top'],
  ['bottom', 'gap', 'hole', 'gap', 'hole'],
  ['top', 'gap', 'hole', 'gap', 'hole'],

  ['bottom', 'gap', 'hole', 'gap', 'bottom', 'gap', 'top'],
  ['top', 'gap', 'hole', 'gap', 'top', 'gap', 'bottom'],
  ['hole', 'gap', 'bottom', 'gap', 'top', 'gap', 'hole'],
  ['bottom', 'gap', 'top', 'gap', 'hole', 'gap', 'bottom'],
];