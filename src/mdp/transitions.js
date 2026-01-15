import { ACTIONS, CELL, inBounds, isWall } from "./grid";

export const REWARD_GOAL = 10;
export const REWARD_PIT = -10;
export const REWARD_STEP = -0.1;

export const P_INTENDED = 0.8;
export const P_RANDOM_TOTAL = 0.2;

const deltas = {
  U: [-1, 0],
  D: [1, 0],
  L: [0, -1],
  R: [0, 1],
};

function move(grid, r, c, action) {
  const [dr, dc] = deltas[action];
  const nr = r + dr;
  const nc = c + dc;


  if (!inBounds(nr, nc)) return [r, c];
  if (isWall(grid, nr, nc)) return [r, c];
  return [nr, nc];
}

export function getTransitions(grid, r, c, action) {
  const cellType = grid[r][c];
  if (cellType === CELL.GOAL || cellType === CELL.PIT) {

    return [{ nr: r, nc: c, prob: 1, reward: 0, terminal: true }];
  }
  if (cellType === CELL.WALL) {

    return [{ nr: r, nc: c, prob: 1, reward: 0, terminal: false }];
  }

  const others = ACTIONS.filter((a) => a !== action);
  const pOtherEach = P_RANDOM_TOTAL / others.length;

  const outcomes = [
    { a: action, p: P_INTENDED },
    ...others.map((a) => ({ a, p: pOtherEach })),
  ];


  const map = new Map();

  for (const o of outcomes) {
    const [nr, nc] = move(grid, r, c, o.a);
    const nextType = grid[nr][nc];

    let reward = REWARD_STEP;
    let terminal = false;

    if (nextType === CELL.GOAL) {
      reward = REWARD_GOAL;
      terminal = true;
    } else if (nextType === CELL.PIT) {
      reward = REWARD_PIT;
      terminal = true;
    }

    const key = `${nr},${nc},${reward},${terminal}`;
    map.set(key, (map.get(key) || 0) + o.p);
  }

  return Array.from(map.entries()).map(([key, prob]) => {
    const [nr, nc, rewardStr, terminalStr] = key.split(",");
    return {
      nr: Number(nr),
      nc: Number(nc),
      prob,
      reward: Number(rewardStr),
      terminal: terminalStr === "true",
    };
  });
}
