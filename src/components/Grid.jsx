import { CELL } from "../mdp/grid";

const arrow = (a) => {
  switch (a) {
    case "U": return "↑";
    case "D": return "↓";
    case "L": return "←";
    case "R": return "→";
    default: return "•";
  }
};

export default function Grid({ grid, V, policy }) {
  const values = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] !== CELL.WALL) values.push(V[r][c]);
    }
  }
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const norm = (x) => (maxV === minV ? 0.5 : (x - minV) / (maxV - minV));

  return (
    <div className="grid">
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const v = V[r][c];
          const p = policy[r][c];
          const intensity = norm(v);
          const heatStyle =
            cell === CELL.WALL
              ? {}
              : { background: `rgba(0,0,0,${0.08 + intensity * 0.22})` };

          return (
            <div
              key={`${r}-${c}`}
              className={`cell ${cell.toLowerCase()}`}
              style={heatStyle}
            >
              {cell === CELL.WALL ? (
                <div className="wall">█</div>
              ) : cell === CELL.GOAL ? (
                <div className="terminal">
                  <div className="t-title">GOAL</div>
                  <div className="t-reward">+10</div>
                </div>
              ) : cell === CELL.PIT ? (
                <div className="terminal">
                  <div className="t-title">PIT</div>
                  <div className="t-reward">-10</div>
                </div>
              ) : (
                <>
                  <div className="value">{v.toFixed(2)}</div>
                  <div className="policy">{arrow(p)}</div>
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
