import { useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_API_URL || "";
const statuses = [
  "new",
  "contacted",
  "discussion",
  "site-visit",
  "converted",
  "closed",
];
const contentTypes = [
  "service",
  "project",
  "gallery",
  "testimonial",
  "blog",
  "team",
];
const pretty = (value) => String(value || "").replaceAll("-", " ");
const money = (value) => (value ? `₹${(value / 100000).toFixed(1)}L` : "—");
const date = (value) =>
  new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

function ContentManager({ token }) {
  const [type, setType] = useState("project");
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  const blank = {
    type,
    title: "",
    description: "",
    image: "",
    category: "",
    location: "",
    order: 0,
    active: true,
    meta: {},
  };

  async function load() {
    const res = await fetch(`${API}/api/content/admin?type=${type}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setItems((await res.json()).items || []);
  }
  useEffect(() => {
    load();
  }, [type, token]);

  async function save(event) {
    event.preventDefault();
    const body = {
      ...editing,
      type,
      order: Number(editing.order || 0),
      active: Boolean(editing.active),
    };
    const url = editing._id
      ? `${API}/api/content/admin/${editing._id}`
      : `${API}/api/content/admin`;
    const res = await fetch(url, {
      method: editing._id ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "Could not save.");
    setEditing(null);
    setMessage("Saved successfully.");
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this content item?")) return;
    const res = await fetch(`${API}/api/content/admin/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) load();
  }

  return (
    <section className="admin-content-manager">
      <div className="admin-content-head">
        <div>
          <p className="eyebrow">Content Studio</p>
          <h2>Manage website content</h2>
          <p>
            Add and update the cards, projects, gallery and editorial content
            shown on the website.
          </p>
        </div>
        <button
          className="admin-primary"
          onClick={() => setEditing({ ...blank })}
        >
          + Add {type}
        </button>
      </div>
      <div className="content-tabs">
        {contentTypes.map((item) => (
          <button
            key={item}
            className={type === item ? "active" : ""}
            onClick={() => {
              setType(item);
              setEditing(null);
            }}
          >
            {pretty(item)}
          </button>
        ))}
      </div>
      {message && <div className="admin-success">{message}</div>}
      <div className="content-admin-grid">
        {items.map((item) => (
          <article className="content-admin-card" key={item._id}>
            {item.image && <img src={item.image} alt="" />}
            <div>
              <span>
                {item.category || item.meta?.role || pretty(item.type)}
              </span>
              <h3>{item.title}</h3>
              <p>{item.description || "No description"}</p>
              <div className="content-admin-actions">
                <button onClick={() => setEditing(item)}>Edit</button>
                <button
                  className="danger-link"
                  onClick={() => remove(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
        {!items.length && (
          <div className="empty-content">No {type} items yet.</div>
        )}
      </div>
      {editing && (
        <div
          className="lead-overlay"
          onMouseDown={(e) => e.target === e.currentTarget && setEditing(null)}
        >
          <form className="content-editor" onSubmit={save}>
            <div className="lead-modal-head">
              <div>
                <p className="eyebrow">Content Editor</p>
                <h2>
                  {editing._id ? "Edit" : "Add"} {type}
                </h2>
              </div>
              <button type="button" onClick={() => setEditing(null)}>
                ×
              </button>
            </div>
            <div className="editor-grid">
              <label>
                Title
                <input
                  required
                  value={editing.title || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                />
              </label>
              <label>
                Category / Role
                <input
                  value={editing.category || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                />
              </label>
              <label>
                Location
                <input
                  value={editing.location || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, location: e.target.value })
                  }
                />
              </label>
              <label>
                Image URL
                <input
                  value={editing.image || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, image: e.target.value })
                  }
                />
              </label>
              <label className="full">
                Description
                <textarea
                  rows="5"
                  value={editing.description || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                />
              </label>
              <label>
                Order
                <input
                  type="number"
                  value={editing.order || 0}
                  onChange={(e) =>
                    setEditing({ ...editing, order: e.target.value })
                  }
                />
              </label>
              <label className="editor-check">
                <input
                  type="checkbox"
                  checked={editing.active !== false}
                  onChange={(e) =>
                    setEditing({ ...editing, active: e.target.checked })
                  }
                />{" "}
                Visible on website
              </label>
            </div>
            <div className="lead-modal-actions">
              <button
                type="button"
                className="admin-refresh"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button className="admin-primary">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState(
    localStorage.getItem("ivy_admin_token") || "",
  );
  const [login, setLogin] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("leads");

  async function load(current = token) {
    if (!current) return;
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${current}` };
      const [leadResponse, statsResponse] = await Promise.all([
        fetch(`${API}/api/admin/enquiries`, { headers }),
        fetch(`${API}/api/admin/stats`, { headers }),
      ]);
      if (leadResponse.status === 401 || statsResponse.status === 401) {
        localStorage.removeItem("ivy_admin_token");
        setToken("");
        return;
      }
      const leadData = await leadResponse.json();
      const statsData = await statsResponse.json();
      if (!leadResponse.ok)
        throw new Error(leadData.error || "Could not load enquiries.");
      setEnquiries(leadData.enquiries || []);
      setStats(statsData);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [token]);

  async function signIn(event) {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch(`${API}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed.");
      localStorage.setItem("ivy_admin_token", data.token);
      setToken(data.token);
    } catch (requestError) {
      setError(requestError.message);
    }
  }
  async function updateStatus(id, value) {
    const response = await fetch(`${API}/api/admin/enquiries/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: value }),
    });
    if (response.ok) {
      setEnquiries((current) =>
        current.map((item) =>
          item._id === id ? { ...item, status: value } : item,
        ),
      );
      if (selected?._id === id)
        setSelected((current) => ({ ...current, status: value }));
    }
  }
  async function removeLead(id) {
    if (!window.confirm("Delete this enquiry permanently?")) return;
    const response = await fetch(`${API}/api/admin/enquiries/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      setSelected(null);
      load();
    }
  }
  function logout() {
    localStorage.removeItem("ivy_admin_token");
    setToken("");
  }
  function exportCsv() {
    const headers = [
      "Name",
      "Phone",
      "Email",
      "City",
      "Service",
      "Property",
      "Area",
      "Finish",
      "Budget Lower",
      "Budget Upper",
      "Source",
      "Status",
      "Date",
    ];
    const values = rows.map((item) => [
      item.name,
      item.phone,
      item.email,
      item.city,
      item.service,
      item.propertyType,
      item.area,
      item.quality,
      item.estimatedLower,
      item.estimatedUpper,
      item.source,
      item.status,
      item.createdAt,
    ]);
    const csv = [headers, ...values]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ivy-interio-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return enquiries.filter(
      (item) =>
        (filter === "all" || item.status === filter) &&
        (!query ||
          [item.name, item.phone, item.email, item.city, item.service].some(
            (value) =>
              String(value || "")
                .toLowerCase()
                .includes(query),
          )),
    );
  }, [enquiries, filter, search]);

  if (!token)
    return (
      <main className="admin-page admin-login-page">
        <form className="admin-login" onSubmit={signIn}>
          <div className="admin-brand">
            <img src="images/ivy-interio-logo.jpg" alt="Ivy Interio" />
            <div>
              IVY INTERIO<small>Admin Portal</small>
            </div>
          </div>
          <p className="eyebrow">Secure access</p>
          <h1>Welcome back.</h1>
          <p className="admin-muted">
            Manage leads, calculator requests and all website content.
          </p>
          <label>
            Email
            <input
              type="email"
              required
              value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
            />
          </label>
          {error && <p className="admin-error">{error}</p>}
          <button className="admin-primary">Sign In</button>
          <a className="admin-back" href="/">
            ← Back to website
          </a>
        </form>
      </main>
    );

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <div className="admin-brand">
          <img src="/images/ivy-interio-logo.jpg" alt="Ivy Interio" />
          <div>
            IVY INTERIO<small>Admin Dashboard</small>
          </div>
        </div>
        <div className="admin-top-actions">
          <a href="/">View Website</a>
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      <div className="admin-wrap">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">Control centre</p>
            <h1>{tab === "leads" ? "Customer Leads" : "Website Content"}</h1>
            <p>
              {tab === "leads"
                ? "Every contact and calculator request in one place."
                : "Manage the content displayed on the public website."}
            </p>
          </div>
          <div className="admin-heading-actions">
            <button
              className={`admin-refresh ${tab === "leads" ? "active-tab" : ""}`}
              onClick={() => setTab("leads")}
            >
              Leads
            </button>
            <button
              className={`admin-refresh ${tab === "content" ? "active-tab" : ""}`}
              onClick={() => setTab("content")}
            >
              Content
            </button>
          </div>
        </div>
        {tab === "content" ? (
          <ContentManager token={token} />
        ) : (
          <>
            <section className="admin-stats">
              {[
                ["Total Leads", stats.total],
                ["New", stats.newCount],
                ["Calculator", stats.calculatorCount],
                ["Contact Forms", stats.contactCount],
                ["Converted", stats.converted],
              ].map(([label, value]) => (
                <div className="admin-stat" key={label}>
                  <span>{label}</span>
                  <strong>{value ?? 0}</strong>
                </div>
              ))}
            </section>
            <section className="admin-panel">
              <div className="admin-toolbar">
                <input
                  placeholder="Search name, phone, email, city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {pretty(status)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Project</th>
                      <th>Budget</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <button
                            className="customer-link"
                            onClick={() => setSelected(item)}
                          >
                            <strong>{item.name}</strong>
                          </button>
                          <small>{item.phone}</small>
                          <small>{item.email || "—"}</small>
                        </td>
                        <td>
                          <strong>{item.service || "—"}</strong>
                          <small>
                            {item.propertyType || ""}
                            {item.area ? ` · ${item.area} sq.ft.` : ""}
                          </small>
                          <small>{item.city || ""}</small>
                        </td>
                        <td>
                          {item.estimatedLower
                            ? `${money(item.estimatedLower)} – ${money(item.estimatedUpper)}`
                            : "—"}
                        </td>
                        <td>
                          <span className="source-pill">
                            {item.source === "cost-calculator"
                              ? "Calculator"
                              : "Contact"}
                          </span>
                        </td>
                        <td>
                          <select
                            className="status-select"
                            value={item.status}
                            onChange={(e) =>
                              updateStatus(item._id, e.target.value)
                            }
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {pretty(status)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>{date(item.createdAt)}</td>
                        <td>
                          <button
                            className="view-btn"
                            onClick={() => setSelected(item)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!rows.length && (
                      <tr>
                        <td colSpan="7" className="empty-cell">
                          No enquiries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
      {selected && (
        <div
          className="lead-overlay"
          onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="lead-modal">
            <div className="lead-modal-head">
              <div>
                <p className="eyebrow">Lead Details</p>
                <h2>{selected.name}</h2>
              </div>
              <button onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="lead-detail-grid">
              <div>
                <span>Phone</span>
                <a href={`tel:+91${selected.phone}`}>+91 {selected.phone}</a>
              </div>
              <div>
                <span>Email</span>
                <a href={`mailto:${selected.email}`}>{selected.email || "—"}</a>
              </div>
              <div>
                <span>City / Area</span>
                <strong>{selected.city || "—"}</strong>
              </div>
              <div>
                <span>Service</span>
                <strong>{selected.service || "—"}</strong>
              </div>
              <div>
                <span>Property</span>
                <strong>{selected.propertyType || "—"}</strong>
              </div>
              <div>
                <span>Carpet Area</span>
                <strong>
                  {selected.area ? `${selected.area} sq.ft.` : "—"}
                </strong>
              </div>
              <div>
                <span>Finish</span>
                <strong>{selected.quality || "—"}</strong>
              </div>
              <div>
                <span>Estimated Budget</span>
                <strong>
                  {selected.estimatedLower
                    ? `${money(selected.estimatedLower)} – ${money(selected.estimatedUpper)}`
                    : "—"}
                </strong>
              </div>
              <div>
                <span>Source</span>
                <strong>
                  {selected.source === "cost-calculator"
                    ? "Cost Calculator"
                    : "Contact Form"}
                </strong>
              </div>
              <div>
                <span>Received</span>
                <strong>{date(selected.createdAt)}</strong>
              </div>
              <div className="full">
                <span>Customer Message</span>
                <p>{selected.message || "No additional message."}</p>
              </div>
            </div>
            <div className="lead-modal-actions">
              <select
                className="status-select"
                value={selected.status}
                onChange={(e) => updateStatus(selected._id, e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {pretty(status)}
                  </option>
                ))}
              </select>
              <a
                className="admin-primary small-btn"
                href={`https://wa.me/91${selected.phone}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp Customer
              </a>
              <button
                className="delete-btn"
                onClick={() => removeLead(selected._id)}
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
