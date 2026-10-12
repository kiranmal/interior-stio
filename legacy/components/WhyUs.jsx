export default function WhyUs() {
  return (
    <section className="section why-section">
      <div className="wrap">
        <div className="section-head center"><p className="eyebrow">Why Ivy Interio</p><h2>Thoughtful design. <em>Fewer compromises.</em></h2></div>
        <div className="why-grid">
          {[
            ['01','Personalised','Design shaped around your lifestyle, taste and daily routines.'],
            ['02','Transparent','Clear scope, practical estimates and decisions before execution.'],
            ['03','End-to-end','Design planning and execution coordination under one roof.'],
            ['04','Detail-led','Lighting, storage, finishes and proportions are considered together.']
          ].map(([no,title,text]) => <article className="why-card" key={no}><span>{no}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </div>
    </section>
  );
}
