export const ROWS = 5;
export const COLS = 5;

export const CELL = {
  EMPTY: "EMPTY",
  WALL: "WALL",
  GOAL: "GOAL",
  PIT: "PIT",
};

export const ACTIONS = ["U", "D", "L", "R"];

export const defaultGrid = () => {
  const grid = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => CELL.EMPTY)
  );

  grid[0][4] = CELL.GOAL;

  grid[4][0] = CELL.PIT;

  
  grid[1][1] = CELL.WALL;
  grid[1][2] = CELL.WALL;
  grid[2][2] = CELL.WALL;
  grid[3][3] = CELL.WALL;

  return grid;
};

export const isTerminal = (grid, r, c) => {
  const t = grid[r][c];
  return t === CELL.GOAL || t === CELL.PIT;
};

export const isWall = (grid, r, c) => grid[r][c] === CELL.WALL;

export const inBounds = (r, c) => r >= 0 && r < ROWS && c >= 0 && c < COLS;

export const makeValueTable = (fill = 0) =>
  Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => fill));

export const makePolicyTable = (fill = "R") =>
  Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => fill));

export const clone2D = (arr) => arr.map((row) => row.slice());
