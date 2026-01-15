export default function Controls({
  algo,
  setAlgo,
  gamma,
  setGamma,
  onStep,
  onRun,
  onStop,
  onReset,
  iteration,
  delta,
  running,
  piPhase,
  piStable,
}) {
  return (
    <div className="panel">
      <div className="row">
        <label>Algorithm</label>
        <select value={algo} onChange={(e) => setAlgo(e.target.value)}>
          <option value="VI">Value Iteration</option>
          <option value="PI">Policy Iteration</option>
        </select>
      </div>

      <div className="row">
        <label>Discount factor (γ): {gamma.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max="0.99"
          step="0.01"
          value={gamma}
          onChange={(e) => setGamma(parseFloat(e.target.value))}
        />
      </div>

      <div className="row buttons">
        <button onClick={onStep} disabled={running}>Step</button>
        {!running ? (
          <button onClick={onRun}>Run</button>
        ) : (
          <button onClick={onStop}>Stop</button>
        )}
        <button onClick={onReset}>Reset</button>
      </div>

      <div className="stats">
        <div><b>Iteration:</b> {iteration}</div>
        <div><b>Delta:</b> {delta.toFixed(4)}</div>
        {algo === "PI" && (
          <>
            <div><b>PI Phase:</b> {piPhase}</div>
            <div><b>Policy stable:</b> {piStable ? "Yes" : "No"}</div>
          </>
        )}
      </div>
    </div>
  );
}
