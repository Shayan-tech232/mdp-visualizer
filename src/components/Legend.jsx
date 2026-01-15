export default function Legend() {
  return (
    <div className="legend">
      <div className="tag"><span className="box goal" /> Goal (+10)</div>
      <div className="tag"><span className="box pit" /> Pit (-10)</div>
      <div className="tag"><span className="box wall" /> Wall</div>
      <div className="tag"><span className="box empty" /> Empty (step -0.1)</div>
      <div className="note">
        Transitions: 80% intended, 20% random.
      </div>
    </div>
  );
}
