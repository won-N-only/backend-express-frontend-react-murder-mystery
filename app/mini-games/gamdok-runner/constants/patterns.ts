export type ObstacleType = 'bottom' | 'top' | 'gap' | 'hole';

export const OBSTACLE_PATTERNS: ObstacleType[][] = [
  // Pattern 1: Simple jump, slide, jump sequence
  ['bottom', 'gap', 'top', 'gap', 'bottom'],
  // Pattern 2: Hole followed by obstacles
  ['hole', 'gap', 'bottom', 'gap', 'top'],
  // Pattern 3: Consecutive holes (separated by gaps)
  ['hole', 'gap', 'hole', 'gap', 'bottom'],
  // Pattern 4: Mixed obstacles with varied gaps
  ['top', 'gap', 'bottom', 'gap', 'gap', 'hole'],
  // Pattern 5: Longer sequence with different types
  ['bottom', 'gap', 'bottom', 'gap', 'top', 'gap', 'hole'],
  // Pattern 6: More gaps for easier sections
  ['gap', 'gap', 'top', 'gap', 'bottom', 'gap'],
  // Pattern 7: Hole first, then jump/slide
  ['hole', 'gap', 'top', 'gap', 'bottom'],
  // Pattern 8: Double jump/slide opportunity
  ['bottom', 'gap', 'bottom', 'gap', 'gap', 'top', 'gap', 'top'],
  // Pattern 9: High obstacle then low, testing reactions
  ['top', 'gap', 'bottom', 'gap', 'hole'],
];