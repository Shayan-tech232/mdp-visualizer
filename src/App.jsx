import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";
import Controls from "./components/Controls";
import Grid from "./components/Grid";
import Legend from "./components/Legend";
import { defaultGrid, makePolicyTable, makeValueTable, CELL } from "./mdp/grid";
import { valueIterationStep } from "./mdp/valueIteration";
import { policyEvaluationSweep, policyImprovement } from "./mdp/policyIteration";

export default function App() {
  const grid = useMemo(() => defaultGrid(), []);
  const [algo, setAlgo] = useState("VI");
  const [gamma, setGamma] = useState(0.9);

  const [V, setV] = useState(() => makeValueTable(0));
  const [policy, setPolicy] = useState(() => makePolicyTable("R"));

  const [iteration, setIteration] = useState(0);
  const [delta, setDelta] = useState(0);
  const [running, setRunning] = useState(false);

  // Policy Iteration phase
  const [piPhase, setPiPhase] = useState("EVAL");
  const [piStable, setPiStable] = useState(false);

  const timerRef = useRef(null);

  const reset = () => {
    stop();
    setV(makeValueTable(0));
    setPolicy(makePolicyTable("R"));
    setIteration(0);
    setDelta(0);
    setPiPhase("EVAL");
    setPiStable(false);
  };

  const stop = () => {
    setRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const stepOnce = () => {
    if (algo === "VI") {
      const { Vnext, policy: p2, delta: d } = valueIterationStep(grid, V, gamma);
      setV(Vnext);
      setPolicy(p2);
      setDelta(d);
      setIteration((x) => x + 1);
      return;
    }

    if (piPhase === "EVAL") {
      const { Vnext, delta: d } = policyEvaluationSweep(grid, V, policy, gamma);
      setV(Vnext);
      setDelta(d);
      setIteration((x) => x + 1);

      if (d < 0.01) setPiPhase("IMPROVE");
      return;
    } else {
      const { newPolicy, stable } = policyImprovement(grid, V, policy, gamma);
      setPolicy(newPolicy);
      setPiStable(stable);
      setPiPhase("EVAL");
      setIteration((x) => x + 1);

      if (stable) stop();
      return;
    }
  };

  const run = () => {
    if (running) return;
    setRunning(true);

    timerRef.current = setInterval(() => {
      if (algo === "VI" && delta < 0.001 && iteration > 2) {
        stop();
        return;
      }
      if (algo === "PI" && piStable) {
        stop();
        return;
      }
      stepOnce();
    }, 250);
  };

  useEffect(() => {
    stop();
  }, [gamma, algo]);

  useEffect(() => {
    return () => stop();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Grid-World MDP Visualizer (5×5)</h1>
        <p>
          Value Iteration + Policy Iteration, stochastic transitions, rewards & γ control.
        </p>
      </header>

      <div className="layout">
        <div>
          <Grid grid={grid} V={V} policy={policy} />
          <Legend />
        </div>

        <Controls
          algo={algo}
          setAlgo={setAlgo}
          gamma={gamma}
          setGamma={setGamma}
          onStep={stepOnce}
          onRun={run}
          onStop={stop}
          onReset={reset}
          iteration={iteration}
          delta={delta}
          running={running}
          piPhase={piPhase}
          piStable={piStable}
        />
      </div>

      <footer className="footer">
        <small>
          γ = 0.3 vs γ = 0.95 to see policy changes.
        </small>
      </footer>
    </div>
  );
}
