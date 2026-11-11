import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from './context.js';
import { when } from './ui.jsx';
import { TYPES } from './schemas.js';

const STATUS = ['new', 'contacted', 'discussion', 'site-visit', 'converted', 'closed'];

export default function Dashboard() {
  const { api } = useAdmin();
  const [s, setS] = useState(null); const [err, setErr] = useState('');
  useEffect(() => { let a = true; api('/api/admin/stats').then((r) => a && setS(r)).catch((e) => a && setErr(e.message)); return () => { a = false; }; }, [api]);
  if (err) return <p className="a-error" role="alert">{err}</p>;
  if (!s) return <p className="a-muted">Loading dashboard…</p>;
  const max = Math.max(1, ...STATUS.map((k) => s.byStatus[k] || 0));
  return (
    <>
      <div className="a-head"><div><h1>Dashboard</h1><p className="a-muted">Live figures from your database.</p></div></div>
      <div className="a-stats">
        {[['Total enquiries', s.total], ['New (unhandled)', s.newCount], ['Last 7 days', s.last7], ['Last 30 days', s.last30], ['Converted', s.converted], ['Published items', s.published], ['Drafts', s.drafts]].map(([l, n]) => <div className="a-stat" key={l}><span>{l}</span><strong>{n}</strong></div>)}
      </div>
      <div className="a-two">
        <section className="a-card pad"><h2>Enquiry status</h2>
          <ul className="a-bars">{STATUS.map((k) => <li key={k}><Link to={`/admin/enquiries?status=${k}`}><span>{k}</span><i style={{ width: `${((s.byStatus[k] || 0) / max) * 100}%` }} /><b>{s.byStatus[k] || 0}</b></Link></li>)}</ul>
          <p className="a-muted">From contact form: {s.contactCount}, quote form: {s.bySource.quote || 0}, cost calculator: {s.calculatorCount}.</p></section>
        <section className="a-card pad"><h2>Recent enquiries</h2>
          {!s.recentEnquiries.length ? <p className="a-muted">No enquiries yet.</p> : <ul className="a-list">{s.recentEnquiries.map((e) => <li key={e._id}><Link to={`/admin/enquiries?open=${e._id}`}><b>{e.name}</b><span>{e.service || e.source} · {e.status}</span><small>{when(e.createdAt)}</small></Link></li>)}</ul>}
          <Link className="tl" to="/admin/enquiries">All enquiries</Link></section>
        <section className="a-card pad"><h2>Content</h2>
          <ul className="a-list">{Object.keys(TYPES).map((t) => <li key={t}><Link to={`/admin/content/${t}`}><b>{TYPES[t].plural}</b><span>{s.contentByType[t] || 0} items</span></Link></li>)}<li><Link to="/admin/pages"><b>Pages</b><span>{s.pages} page(s)</span></Link></li></ul></section>
        <section className="a-card pad"><h2>Recently updated</h2>
          {!s.recentContent.length ? <p className="a-muted">Nothing yet.</p> : <ul className="a-list">{s.recentContent.map((c) => <li key={c._id}><Link to={`/admin/content/${c.type}`}><b>{c.title}</b><span>{TYPES[c.type]?.label || c.type} · {c.active ? 'published' : 'draft'}</span><small>{when(c.updatedAt)}</small></Link></li>)}</ul>}</section>
      </div>
    </>
  );
}
