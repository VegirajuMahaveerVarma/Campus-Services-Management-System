import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { auth, students, complaints, events, notices } from './services/api';
import type { AuthResponse, Student, Complaint, Event, Notice, Role } from './types';

type Tab = 'overview' | 'complaints' | 'events' | 'notices' | 'profile' | 'students';
type Toast = { type: 'success' | 'error'; message: string } | null;

const saveSession = (a: AuthResponse) => {
  localStorage.setItem('campus_token', a.token);
  localStorage.setItem('campus_role', a.role);
  localStorage.setItem('campus_email', a.email);
};
const role = () => localStorage.getItem('campus_role') as Role | null;
const prettyStatus = (status: string) => status.replaceAll('_', ' ');
const formatDate = (value?: string) => value ? new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '—';
const initials = (name?: string) => (name || 'U').split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase();

function Auth({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (key: string, value: string) => setForm(x => ({ ...x, [key]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const response = mode === 'login'
        ? await auth.login({ email: form.email, password: form.password })
        : await auth.register(form);
      saveSession(response.data);
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to complete the request. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return <main className="auth">
    <div className="auth-shell">
      <section className="auth-showcase">
        <div className="brand large">CS<span>MS</span></div>
        <div>
          <span className="eyebrow">Campus Services Management</span>
          <h1>One digital home for your campus.</h1>
          <p>Track requests, discover events, stay updated and manage student services from a single secure portal.</p>
        </div>
        <div className="auth-features"><span>✓ Secure access</span><span>✓ Real-time requests</span><span>✓ Campus updates</span></div>
      </section>
      <section className="auth-card">
        <div className="auth-mobile-brand"><div className="brand">CS<span>MS</span></div></div>
        <span className="eyebrow">{mode === 'login' ? 'Student portal' : 'Get started'}</span>
        <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p>{mode === 'login' ? 'Sign in to access your campus services.' : 'Register once and start using the student portal.'}</p>
        <form onSubmit={submit}>
          <label>Email<input required type="email" placeholder="you@example.com" value={form.email || ''} onChange={e => set('email', e.target.value)} /></label>
          <label>Password<input required type="password" minLength={6} placeholder="••••••••" value={form.password || ''} onChange={e => set('password', e.target.value)} /></label>
          {mode === 'register' && <div className="form-grid compact">
            <label>Full name<input required placeholder="Full name" value={form.fullName || ''} onChange={e => set('fullName', e.target.value)} /></label>
            <label>Roll number<input required placeholder="Roll number" value={form.rollNumber || ''} onChange={e => set('rollNumber', e.target.value)} /></label>
            <label>Department<input placeholder="Department" value={form.department || ''} onChange={e => set('department', e.target.value)} /></label>
            <label>Year<input placeholder="Year" value={form.year || ''} onChange={e => set('year', e.target.value)} /></label>
            <label className="full">Phone<input placeholder="Phone number" value={form.phone || ''} onChange={e => set('phone', e.target.value)} /></label>
          </div>}
          {error && <div className="error" role="alert">{error}</div>}
          <button className="primary wide" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
        </form>
        <button className="link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
          {mode === 'login' ? 'New student? Create an account' : 'Already registered? Sign in'}
        </button>
      </section>
    </div>
  </main>;
}

function Layout({ tab, setTab, onLogout, children }: { tab: Tab; setTab: (t: Tab) => void; onLogout: () => void; children: ReactNode }) {
  const r = role();
  const nav: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '⌂' },
    { id: 'complaints', label: 'Complaints', icon: '✓' },
    { id: 'events', label: 'Events', icon: '◷' },
    { id: 'notices', label: 'Notices', icon: '!' },
    { id: 'profile', label: 'Profile', icon: '○' },
    ...(r === 'ADMIN' ? [{ id: 'students' as Tab, label: 'Students', icon: '♙' }] : [])
  ];
  return <div className="layout">
    <aside>
      <div className="brand">CS<span>MS</span></div>
      <div className="portal-label"><span className="status-dot" />{r === 'ADMIN' ? 'ADMIN PORTAL' : 'STUDENT PORTAL'}</div>
      <nav>{nav.map(n => <button key={n.id} className={tab === n.id ? 'nav active' : 'nav'} onClick={() => setTab(n.id)}><span className="nav-icon">{n.icon}</span>{n.label}</button>)}</nav>
      <div className="sidebar-bottom"><div className="mini-user"><div className="mini-avatar">{initials(localStorage.getItem('campus_email') || undefined)}</div><div><b>{r === 'ADMIN' ? 'Administrator' : 'Student'}</b><small>{localStorage.getItem('campus_email')}</small></div></div><button className="nav logout" onClick={onLogout}><span className="nav-icon">↪</span>Sign out</button></div>
    </aside>
    <section className="content">
      <header><div><small>Campus Services</small><h2>{nav.find(n => n.id === tab)?.label}</h2></div><div className="header-actions"><span className="role-pill">{r}</span><div className="user-pill">{localStorage.getItem('campus_email')}</div></div></header>
      {children}
    </section>
  </div>;
}

function Overview({ setTab }: { setTab: (t: Tab) => void }) {
  const r = role();
  const [data, setData] = useState({ complaints: [] as Complaint[], events: [] as Event[], notices: [] as Notice[] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => {
    setLoading(true); setError('');
    try {
      const [c, e, n] = await Promise.all([
        r === 'ADMIN' ? complaints.all() : complaints.mine(),
        events.list(), notices.list()
      ]);
      setData({ complaints: c.data, events: e.data, notices: n.data });
    } catch { setError('Some dashboard data could not be loaded.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const upcoming = data.events.filter(e => !e.eventDate || new Date(e.eventDate) >= new Date()).sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  const recent = [...data.complaints].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

  return <div className="dashboard">
    <div className="hero-panel"><div><span className="eyebrow">{r === 'ADMIN' ? 'Operations command center' : 'Student command center'}</span><h1>{r === 'ADMIN' ? 'Keep campus services moving.' : 'Everything your campus needs, in one place.'}</h1><p>{r === 'ADMIN' ? 'Review student requests, publish updates and keep campus activities organized.' : 'Manage complaints, discover events, read notices and keep your student profile current.'}</p></div><div className="hero-orb">CS<br /><span>MS</span></div></div>
    {error && <div className="error page-error">{error}</div>}
    <div className="stats">
      <button onClick={() => setTab('complaints')}><span className="stat-icon">✓</span><b>{loading ? '—' : data.complaints.length}</b><span>{r === 'ADMIN' ? 'Total complaints' : 'My complaints'}</span></button>
      <button onClick={() => setTab('events')}><span className="stat-icon">◷</span><b>{loading ? '—' : upcoming.length}</b><span>Upcoming events</span></button>
      <button onClick={() => setTab('notices')}><span className="stat-icon">!</span><b>{loading ? '—' : data.notices.length}</b><span>Campus notices</span></button>
    </div>
    <div className="dashboard-grid">
      <section className="panel quick-panel"><div className="section-heading"><div><span className="eyebrow">Quick actions</span><h3>Get things done</h3></div></div><div className="quick-actions"><button onClick={() => setTab('complaints')}><b>Submit a complaint</b><span>Report an issue and track its status →</span></button><button onClick={() => setTab('events')}><b>Explore events</b><span>See what is happening on campus →</span></button><button onClick={() => setTab('notices')}><b>Read notices</b><span>Catch the latest campus updates →</span></button><button onClick={() => setTab('profile')}><b>Update profile</b><span>Keep your student details current →</span></button></div></section>
      <section className="panel activity-panel"><div className="section-heading"><div><span className="eyebrow">Latest</span><h3>Recent complaints</h3></div><button className="text-button" onClick={() => setTab('complaints')}>View all →</button></div>{recent.length ? <div className="activity-list">{recent.map(c => <div className="activity" key={c.id}><span className={'status-dot ' + c.status.toLowerCase()} /><div><b>{c.title}</b><small>{formatDate(c.createdAt)}</small></div><span className={'badge ' + c.status}>{prettyStatus(c.status)}</span></div>)}</div> : <div className="empty small">No complaints yet.</div>}</section>
    </div>
  </div>;
}

function Complaints() {
  const r = role(); const [items, setItems] = useState<Complaint[]>([]); const [q, setQ] = useState(''); const [filter, setFilter] = useState('ALL');
  const [form, setForm] = useState({ title: '', description: '', category: '' }); const [busy, setBusy] = useState(false); const [message, setMessage] = useState<Toast>(null);
  const load = async () => { try { const response = r === 'ADMIN' ? await complaints.all() : await complaints.mine(); setItems(response.data); } catch { setMessage({ type: 'error', message: 'Could not load complaints.' }); } };
  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => items.filter(x => (filter === 'ALL' || x.status === filter) && (x.title + ' ' + x.description + ' ' + (x.category || '')).toLowerCase().includes(q.toLowerCase())), [items, q, filter]);
  const create = async (e: FormEvent) => { e.preventDefault(); setBusy(true); setMessage(null); try { await complaints.create(form); setForm({ title: '', description: '', category: '' }); setMessage({ type: 'success', message: 'Complaint submitted successfully.' }); await load(); } catch (err: any) { setMessage({ type: 'error', message: err.response?.data?.message || 'Could not submit complaint.' }); } finally { setBusy(false); } };
  const status = async (id: number, value: string) => { try { await complaints.status(id, value); setMessage({ type: 'success', message: 'Complaint status updated.' }); await load(); } catch { setMessage({ type: 'error', message: 'Could not update status.' }); } };
  return <><PageIntro title="Complaints" text={r === 'ADMIN' ? 'Review and resolve student service requests.' : 'Submit an issue and track its progress from one place.'} />
    {message && <div className={message.type === 'error' ? 'error page-error' : 'success'}>{message.message}</div>}
    <div className="toolbar"><div className="search"><span>⌕</span><input placeholder="Search complaints…" value={q} onChange={e => setQ(e.target.value)} /></div><div className="filter-group">{['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(s => <button key={s} className={filter === s ? 'filter active' : 'filter'} onClick={() => setFilter(s)}>{s === 'ALL' ? 'All' : prettyStatus(s)}</button>)}</div></div>
    {r === 'STUDENT' && <form className="panel form-grid create-panel" onSubmit={create}><div className="form-heading"><span className="eyebrow">New request</span><h3>Submit a complaint</h3></div><label>Title<input required placeholder="e.g. WiFi issue in lab" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label><label>Category<input placeholder="e.g. Infrastructure" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></label><label className="full">Description<textarea required placeholder="Describe the issue clearly so the team can help…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label><button className="primary" disabled={busy}>{busy ? 'Submitting…' : 'Submit complaint'}</button></form>}
    <div className="list">{filtered.map(c => <article className="panel item" key={c.id}><div className="item-main"><div className="item-top"><span className={'badge ' + c.status}>{prettyStatus(c.status)}</span><small>{formatDate(c.createdAt)}</small></div><h3>{c.title}</h3><p>{c.description}</p><small className="meta">{c.category || 'General'}{r === 'ADMIN' && c.student ? ` · ${c.student.fullName} · ${c.student.rollNumber}` : ''}</small></div>{r === 'ADMIN' && <select value={c.status} onChange={e => status(c.id, e.target.value)}><option value="OPEN">Open</option><option value="IN_PROGRESS">In progress</option><option value="RESOLVED">Resolved</option><option value="CLOSED">Closed</option></select>}</article>)}{!filtered.length && <div className="empty">No complaints match your search or filter.</div>}</div>
  </>;
}

function Events() {
  const r = role(); const [items, setItems] = useState<Event[]>([]); const [q, setQ] = useState(''); const [form, setForm] = useState<Event>({ title: '', description: '', eventDate: '', venue: '', organizer: '' }); const [busy, setBusy] = useState(false); const [message, setMessage] = useState<Toast>(null);
  const load = async () => { try { const response = await events.list(); setItems(response.data); } catch { setMessage({ type: 'error', message: 'Could not load events.' }); } };
  useEffect(() => { load(); }, []);
  const filtered = items.filter(e => (e.title + ' ' + (e.description || '') + ' ' + (e.venue || '') + ' ' + (e.organizer || '')).toLowerCase().includes(q.toLowerCase())).sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  const submit = async (e: FormEvent) => { e.preventDefault(); setBusy(true); setMessage(null); try { await events.create(form); setForm({ title: '', description: '', eventDate: '', venue: '', organizer: '' }); setMessage({ type: 'success', message: 'Event created successfully.' }); await load(); } catch (err: any) { setMessage({ type: 'error', message: err.response?.data?.message || 'Could not create event.' }); } finally { setBusy(false); } };
  return <><PageIntro title="Events" text="Discover upcoming campus activities, workshops and programs." />{message && <div className={message.type === 'error' ? 'error page-error' : 'success'}>{message.message}</div>}<div className="toolbar"><div className="search"><span>⌕</span><input placeholder="Search events, venues, organizers…" value={q} onChange={e => setQ(e.target.value)} /></div></div>
    {r === 'ADMIN' && <form className="panel form-grid create-panel" onSubmit={submit}><div className="form-heading"><span className="eyebrow">Event management</span><h3>Create an event</h3></div><label>Event title<input required placeholder="Event title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label><label>Date & time<input required type="datetime-local" value={form.eventDate} onChange={e => setForm({ ...form, eventDate: e.target.value })} /></label><label>Venue<input placeholder="Venue" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} /></label><label>Organizer<input placeholder="Organizer" value={form.organizer} onChange={e => setForm({ ...form, organizer: e.target.value })} /></label><label className="full">Description<textarea placeholder="Tell students what to expect…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label><button className="primary" disabled={busy}>{busy ? 'Creating…' : 'Create event'}</button></form>}
    <div className="cards">{filtered.map(e => <article className="panel card" key={e.id}><div className="event-date"><b>{new Date(e.eventDate).toLocaleDateString([], { day: '2-digit' })}</b><span>{new Date(e.eventDate).toLocaleDateString([], { month: 'short' }).toUpperCase()}</span></div><div className="card-body"><span className="eyebrow">{e.organizer || 'Campus'}</span><h3>{e.title}</h3><p>{e.description || 'No description provided.'}</p><div className="card-meta"><span>◷ {formatDate(e.eventDate)}</span><span>⌖ {e.venue || 'Venue TBA'}</span></div>{r === 'ADMIN' && <button className="danger" onClick={async () => { if (confirm('Delete this event?')) { await events.remove(e.id!); setMessage({ type: 'success', message: 'Event deleted.' }); load(); } }}>Delete event</button>}</div></article>)}{!filtered.length && <div className="empty">No events found.</div>}</div>
  </>;
}

function Notices() {
  const r = role(); const [items, setItems] = useState<Notice[]>([]); const [q, setQ] = useState(''); const [form, setForm] = useState<Notice>({ title: '', content: '', category: '' }); const [busy, setBusy] = useState(false); const [message, setMessage] = useState<Toast>(null);
  const load = async () => { try { const response = await notices.list(); setItems(response.data); } catch { setMessage({ type: 'error', message: 'Could not load notices.' }); } };
  useEffect(() => { load(); }, []);
  const filtered = items.filter(n => (n.title + ' ' + n.content + ' ' + (n.category || '')).toLowerCase().includes(q.toLowerCase()));
  const submit = async (e: FormEvent) => { e.preventDefault(); setBusy(true); setMessage(null); try { await notices.create(form); setForm({ title: '', content: '', category: '' }); setMessage({ type: 'success', message: 'Notice published successfully.' }); await load(); } catch (err: any) { setMessage({ type: 'error', message: err.response?.data?.message || 'Could not publish notice.' }); } finally { setBusy(false); } };
  return <><PageIntro title="Notices" text="Official announcements and important campus updates." />{message && <div className={message.type === 'error' ? 'error page-error' : 'success'}>{message.message}</div>}<div className="toolbar"><div className="search"><span>⌕</span><input placeholder="Search notices…" value={q} onChange={e => setQ(e.target.value)} /></div></div>
    {r === 'ADMIN' && <form className="panel form-grid create-panel" onSubmit={submit}><div className="form-heading"><span className="eyebrow">Communication</span><h3>Publish a notice</h3></div><label>Title<input required placeholder="Notice title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label><label>Category<input placeholder="e.g. Academic" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></label><label className="full">Content<textarea required placeholder="Write the announcement…" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></label><button className="primary" disabled={busy}>{busy ? 'Publishing…' : 'Publish notice'}</button></form>}
    <div className="list">{filtered.map(n => <article className="panel item notice-item" key={n.id}><div className="notice-mark">!</div><div className="item-main"><div className="item-top"><span className="badge OPEN">{n.category || 'NOTICE'}</span><small>{formatDate(n.publishedAt)}</small></div><h3>{n.title}</h3><p>{n.content}</p></div>{r === 'ADMIN' && <button className="danger" onClick={async () => { if (confirm('Delete this notice?')) { await notices.remove(n.id!); setMessage({ type: 'success', message: 'Notice deleted.' }); load(); } }}>Delete</button>}</article>)}{!filtered.length && <div className="empty">No notices found.</div>}</div>
  </>;
}

function Profile() {
  const [s, setS] = useState<Student | null>(null); const [editing, setEditing] = useState(false); const [message, setMessage] = useState<Toast>(null);
  useEffect(() => { students.profile().then(x => setS(x.data)).catch(() => setMessage({ type: 'error', message: 'Could not load profile.' })); }, []);
  if (!s) return <div className="empty">Loading profile…</div>;
  return <><PageIntro title="Profile" text="Keep your student information accurate and up to date." />{message && <div className={message.type === 'error' ? 'error page-error' : 'success'}>{message.message}</div>}<div className="profile-layout"><div className="panel profile"><div className="profile-head"><div className="avatar">{initials(s.fullName)}</div><div><span className="eyebrow">Student profile</span><h2>{s.fullName}</h2><p>{s.rollNumber} · {s.department || 'Department not set'}</p></div></div>{editing ? <ProfileForm s={s} onSave={x => { setS(x); setEditing(false); setMessage({ type: 'success', message: 'Profile updated successfully.' }); }} /> : <><dl><dt>Email</dt><dd>{s.user?.email || localStorage.getItem('campus_email')}</dd><dt>Year</dt><dd>{s.year || '—'}</dd><dt>Phone</dt><dd>{s.phone || '—'}</dd><dt>Department</dt><dd>{s.department || '—'}</dd></dl><button className="primary" onClick={() => setEditing(true)}>Edit profile</button></>}</div><div className="panel profile-side"><span className="eyebrow">Account</span><h3>Profile readiness</h3><div className="progress"><span style={{ width: `${[s.fullName, s.rollNumber, s.department, s.year, s.phone].filter(Boolean).length / 5 * 100}%` }} /></div><b>{Math.round([s.fullName, s.rollNumber, s.department, s.year, s.phone].filter(Boolean).length / 5 * 100)}% complete</b><p>Complete profile details help campus teams identify and support you faster.</p></div></div></>;
}

function ProfileForm({ s, onSave }: { s: Student; onSave: (s: Student) => void }) { const [f, setF] = useState(s); const [busy, setBusy] = useState(false); return <form className="form-grid" onSubmit={async e => { e.preventDefault(); setBusy(true); try { const response = await students.update(f); onSave(response.data); } finally { setBusy(false); } }}><label>Full name<input required value={f.fullName} onChange={e => setF({ ...f, fullName: e.target.value })} /></label><label>Department<input value={f.department || ''} onChange={e => setF({ ...f, department: e.target.value })} /></label><label>Year<input value={f.year || ''} onChange={e => setF({ ...f, year: e.target.value })} /></label><label>Phone<input value={f.phone || ''} onChange={e => setF({ ...f, phone: e.target.value })} /></label><div className="form-actions"><button type="button" className="secondary" onClick={() => onSave(s)}>Cancel</button><button className="primary" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></div></form>; }

function Students() { const [items, setItems] = useState<Student[]>([]); const [q, setQ] = useState(''); useEffect(() => { students.all().then(x => setItems(x.data)); }, []); const filtered = items.filter(s => (s.fullName + ' ' + s.rollNumber + ' ' + (s.department || '')).toLowerCase().includes(q.toLowerCase())); return <><PageIntro title="Students" text="Search and review registered student profiles." /><div className="toolbar"><div className="search"><span>⌕</span><input placeholder="Search name, roll number or department…" value={q} onChange={e => setQ(e.target.value)} /></div><span className="result-count">{filtered.length} student{filtered.length === 1 ? '' : 's'}</span></div><div className="panel table"><div className="tr head"><b>Name</b><b>Roll number</b><b>Department</b><b>Year</b></div>{filtered.map(s => <div className="tr" key={s.id}><span><strong>{s.fullName}</strong></span><span>{s.rollNumber}</span><span>{s.department || '—'}</span><span>{s.year || '—'}</span></div>)}{!filtered.length && <div className="empty">No students found.</div>}</div></>; }

function PageIntro({ title, text }: { title: string; text: string }) { return <div className="page-intro"><div><span className="eyebrow">Campus Services</span><h1>{title}</h1><p>{text}</p></div></div>; }

function App() { const [logged, setLogged] = useState(!!localStorage.getItem('campus_token')); const [tab, setTab] = useState<Tab>('overview'); const logout = () => { localStorage.removeItem('campus_token'); localStorage.removeItem('campus_role'); localStorage.removeItem('campus_email'); setLogged(false); setTab('overview'); }; if (!logged) return <Auth onLogin={() => setLogged(true)} />; return <Layout tab={tab} setTab={setTab} onLogout={logout}>{tab === 'overview' && <Overview setTab={setTab} />}{tab === 'complaints' && <Complaints />}{tab === 'events' && <Events />}{tab === 'notices' && <Notices />}{tab === 'profile' && <Profile />}{tab === 'students' && <Students />}</Layout>; }

export default App;
