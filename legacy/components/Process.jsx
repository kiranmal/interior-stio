import { steps } from '../data/content.js';
import useReveal from '../hooks/useReveal.js';

export default function Process() {
  const ref = useReveal();

  return (
    <section id="process" className="section process">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Our Process</p>
          <h2>From vision to <em>reality.</em></h2>
          <p className="sub">A clear process keeps your project comfortable, transparent and organised.</p>
        </div>

        <ol className="process-grid reveal" ref={ref}>
          {steps.map((step, index) => (
            <li className="step" key={step.title}>
              <div className="step-number">0{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
