import { ACTIONS, CELL, clone2D, COLS, ROWS } from "./grid";
import { getTransitions } from "./transitions";

export function valueIterationStep(grid, V, gamma) {
  const Vnext = clone2D(V);
  const policy = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => "R"));

  let delta = 0;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const t = grid[r][c];
      if (t === CELL.WALL) continue;
      if (t === CELL.GOAL || t === CELL.PIT) {
        Vnext[r][c] = 0;
        policy[r][c] = "•";
        continue;
      }

      let best = -Infinity;
      let bestA = "R";

      for (const a of ACTIONS) {
        const trans = getTransitions(grid, r, c, a);
        let q = 0;
        for (const { nr, nc, prob, reward } of trans) {
          q += prob * (reward + gamma * V[nr][nc]);
        }
        if (q > best) {
          best = q;
          bestA = a;
        }
      }

      Vnext[r][c] = best;
      policy[r][c] = bestA;
      delta = Math.max(delta, Math.abs(Vnext[r][c] - V[r][c]));
    }
  }

  return { Vnext, policy, delta };
}
