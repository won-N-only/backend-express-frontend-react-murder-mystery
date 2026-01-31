export type ObstacleType = 'bottom' | 'top' | 'gap' | 'hole';

export const OBSTACLE_PATTERNS: ObstacleType[][] = [
  // Pattern 1: Simple jump, slide, jump sequence
  ['bottom', 'gap', 'top', 'gap', 'bottom', 'gap'],
  // Pattern 2: Hole followed by obstacles
  ['hole', 'gap', 'bottom', 'gap', 'top', 'gap'],
  // Pattern 3: Consecutive holes (separated by gaps)
  ['hole', 'gap', 'hole', 'gap', 'bottom', 'gap'],
  // Pattern 4: Mixed obstacles with varied gaps
  ['top', 'gap', 'bottom', 'gap', 'gap', 'hole', 'gap'],
  // Pattern 5: Longer sequence with different types
  ['bottom', 'gap', 'bottom', 'gap', 'top', 'gap', 'hole', 'gap'],
  // Pattern 6: More gaps for easier sections
  ['gap', 'gap', 'top', 'gap', 'bottom', 'gap', 'gap'],
  // Pattern 7: Hole first, then jump/slide
  ['hole', 'gap', 'top', 'gap', 'bottom', 'gap'],
  // Pattern 8: Double jump/slide opportunity
  ['bottom', 'gap', 'bottom', 'gap', 'gap', 'top', 'gap', 'top', 'gap'],
  // Pattern 9: High obstacle then low, testing reactions
  ['top', 'gap', 'bottom', 'gap', 'hole', 'gap'],
  // Pattern 10: Simple gap sequence for relief
  ['gap', 'gap', 'gap', 'bottom', 'gap'],
];