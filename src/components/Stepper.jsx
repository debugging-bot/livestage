export default function Stepper({ steps, current }) {
  return (
    <ol className="stepper">
      {steps.map((label, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "active" : "";
        return (
          <li key={label} className={`step ${state}`}>
            <span className="dot">{n < current ? "✓" : n}</span>
            <span className="step-label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
