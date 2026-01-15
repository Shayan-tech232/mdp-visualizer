import { ACTIONS, CELL, clone2D, COLS, ROWS } from "./grid";
import { getTransitions } from "./transitions";

export function policyEvaluationSweep(grid, V, policy, gamma) {
  const Vnext = clone2D(V);
  let delta = 0;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const t = grid[r][c];
      if (t === CELL.WALL) continue;
      if (t === CELL.GOAL || t === CELL.PIT) {
        Vnext[r][c] = 0;
        continue;
      }

      const a = policy[r][c];
      const trans = getTransitions(grid, r, c, a);

      let v = 0;
      for (const { nr, nc, prob, reward } of trans) {
        v += prob * (reward + gamma * V[nr][nc]);
      }

      Vnext[r][c] = v;
      delta = Math.max(delta, Math.abs(Vnext[r][c] - V[r][c]));
    }
  }

  return { Vnext, delta };
}

export function policyImprovement(grid, V, policy, gamma) {
  const newPolicy = clone2D(policy);
  let stable = true;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const t = grid[r][c];
      if (t === CELL.WALL) continue;
      if (t === CELL.GOAL || t === CELL.PIT) {
        newPolicy[r][c] = "•";
        continue;
      }

      let best = -Infinity;
      let bestA = policy[r][c];

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

      if (bestA !== policy[r][c]) stable = false;
      newPolicy[r][c] = bestA;
    }
  }

  return { newPolicy, stable };
}
