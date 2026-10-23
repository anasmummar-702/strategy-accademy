import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Phone, Mail, MessageCircle, Trash2, X, Send, Download, Check,
  ChevronRight, Inbox, RotateCcw, UserCheck,
} from 'lucide-react';
import { getAllTrialLeads, updateLeadStatus, deleteTrialLead, addLeadNote } from '../../../utils/trialLeadsData';

// The simple path a trial request follows: New → Called → Joined (or Not interested)
const STATUS = {
  new: { label: 'New', pill: 'bg-blue-50 text-blue-700 ring-blue-200' },
  contacted: { label: 'Called', pill: 'bg-amber-50 text-amber-700 ring-amber-200' },
  converted: { label: 'Joined', pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  archived: { label: 'Not interested', pill: 'bg-zinc-100 text-zinc-500 ring-zinc-200' },
};

const TABS = [
  { id: 'new', label: 'To call' },
  { id: 'contacted', label: 'Called' },
  { id: 'converted', label: 'Joined' },
  { id: 'all', label: 'All' },
];

const SPORTS = [
  { id: 'all', label: 'All sports' },
  { id: 'skating', label: '⛸️ Skating' },
  { id: 'basketball', label: '🏀 Basketball' },
];

// Forms save the 9-digit local number (e.g. 501234567). Older/other entries may already include +971.
export function formatPhone(raw) {
  if (!raw) return '';
  const s = String(raw).trim();
  if (s.startsWith('+') || s.startsWith('00')) return s;
  const digits = s.replace(/\D/g, '').replace(/^0/, '');
  return `+971 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`.trim();
}
function phoneDigits(raw) {
  const s = String(raw || '').trim();
  let d = s.replace(/\D/g, '');
  if (s.startsWith('00')) d = d.slice(2);
  else if (!s.startsWith('+')) d = '971' + d.replace(/^0/, '');
  return d;
}

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (!isFinite(diff)) return '';
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  if (diff < 7 * 86400) return `${Math.floor(diff / 86400)} d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function fullDate(iso) {
  try {
    return new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

function summary(lead) {
  return [
    lead.age && `${lead.age} yrs`,
    lead.ageGroup,
    lead.gender,
    lead.programType,
    lead.experience,
    lead.timeSlot,
  ].filter(Boolean).join(' · ');
}

// Online trial-fee payment (only for bookings made through the payment link)
function PaymentPill({ lead }) {
  if (lead.paymentStatus === 'paid')
    return <span className="px-2.5 py-1 rounded-full text-xs font-semibold ring-1 bg-emerald-50 text-emerald-700 ring-emerald-200">Paid 30 AED</span>;
  if (lead.paymentStatus === 'pending')
    return <span className="px-2.5 py-1 rounded-full text-xs font-semibold ring-1 bg-zinc-50 text-zinc-500 ring-zinc-200">Payment not finished</span>;
  return null;
}

function StatusPill({ status }) {
  const st = STATUS[status] || STATUS.new;
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${st.pill}`}>{st.label}</span>;
}

function ContactButtons({ lead, compact = false }) {
  if (!lead.phone && !lead.email) return null;
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition';
  const size = compact ? 'w-10 h-10' : 'px-4 py-2.5';
  return (
    <>
      {lead.phone && (
        <a href={`tel:+${phoneDigits(lead.phone)}`} title="Call" className={`${base} ${size} bg-zinc-900 text-white hover:bg-black`}>
          <Phone className="w-4 h-4" />
          {!compact && 'Call'}
        </a>
      )}
      {lead.phone && (
        <a
          href={`https://wa.me/${phoneDigits(lead.phone)}`}
          target="_blank"
          rel="noopener noreferrer"
          title="WhatsApp"
          className={`${base} ${size} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100`}
        >
          <MessageCircle className="w-4 h-4" />
          {!compact && 'WhatsApp'}
        </a>
      )}
      {!compact && lead.email && (
        <a href={`mailto:${lead.email}`} title="Email" className={`${base} ${size} ring-1 ring-zinc-200 text-zinc-700 hover:bg-zinc-50`}>
          <Mail className="w-4 h-4" />
          Email
        </a>
      )}
    </>
  );
}

// The one obvious "next step" button for each status
function NextStep({ lead, onChange }) {
  const btn = 'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium ring-1 transition cursor-pointer whitespace-nowrap';
  if (lead.status === 'new')
    return (
      <button onClick={() => onChange(lead.id, 'contacted')} className={`${btn} ring-zinc-300 text-zinc-800 hover:bg-zinc-50`}>
        <Check className="w-4 h-4" /> Mark as called
      </button>
    );
  if (lead.status === 'contacted')
    return (
      <button onClick={() => onChange(lead.id, 'converted')} className={`${btn} ring-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100`}>
        <UserCheck className="w-4 h-4" /> They joined
      </button>
    );
  if (lead.status === 'archived')
    return (
      <button onClick={() => onChange(lead.id, 'new')} className={`${btn} ring-zinc-200 text-zinc-600 hover:bg-zinc-50`}>
        <RotateCcw className="w-4 h-4" /> Move back to “To call”
      </button>
    );
  return null;
}

export default function TrialLeadsView() {
  const [leads, setLeads] = useState(() => getAllTrialLeads());
  // Open on "To call" – or on "All" when nobody is waiting for a call
  const [tab, setTab] = useState(() => (getAllTrialLeads().some((l) => (l.status || 'new') === 'new') ? 'new' : 'all'));
  const [sport, setSport] = useState('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const reload = () => setLeads(getAllTrialLeads());
    const events = ['strategy_trial_lead_added', 'strategy_trial_leads_changed', 'storage'];
    events.forEach((e) => window.addEventListener(e, reload));
    return () => events.forEach((e) => window.removeEventListener(e, reload));
  }, []);

  const counts = useMemo(() => {
    const c = { all: leads.length, new: 0, contacted: 0, converted: 0, archived: 0 };
    leads.forEach((l) => (c[l.status || 'new'] += 1));
    return c;
  }, [leads]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (tab !== 'all' && (l.status || 'new') !== tab) return false;
      if (sport !== 'all' && l.category !== sport) return false;
      if (!q) return true;
      return [l.name, l.email, l.phone].some((v) => String(v || '').toLowerCase().includes(q));
    });
  }, [leads, tab, sport, query]);

  const open = leads.find((l) => l.id === openId) || null;

  const flash = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(''), isError ? 6000 : 2500);
  };

  const changeStatus = (id, status) => {
    if (!updateLeadStatus(id, status)) {
      flash("Not saved: this browser's storage is full.", true);
      return;
    }
    setLeads(getAllTrialLeads());
    const name = leads.find((l) => l.id === id)?.name || 'Request';
    flash(`${name} → ${STATUS[status].label}`);
  };

  const remove = (id) => {
    deleteTrialLead(id);
    setLeads(getAllTrialLeads());
    setOpenId(null);
    setConfirmDelete(false);
    flash('Request deleted');
  };

  const saveNote = () => {
    if (!noteText.trim() || !open) return;
    if (!addLeadNote(open.id, noteText.trim())) {
      flash("Note not saved: this browser's storage is full.", true);
      return;
    }
    setLeads(getAllTrialLeads());
    setNoteText('');
  };

  const downloadList = () => {
    const headers = ['Name', 'Sport', 'Phone', 'Email', 'Status', 'Details', 'Date'];
    const rows = shown.map((l) => [
      l.name || '', l.category || '', formatPhone(l.phone), l.email || '',
      STATUS[l.status]?.label || '', summary(l), fullDate(l.submittedAt),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `trial-requests-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div
          className={`!m-0 fixed top-20 right-6 z-[110] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium ${
            toast.isError ? 'bg-rose-700' : 'bg-zinc-900'
          }`}
        >
          {!toast.isError && <Check className="w-4 h-4 text-emerald-400" />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-base text-zinc-500">
          People who booked a free trial. Call them, then tap <strong className="text-zinc-700">Mark as called</strong>.
        </p>
        {leads.length > 0 && (
          <button
            onClick={downloadList}
            className="flex items-center gap-2 px-4 py-2.5 ring-1 ring-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-sm font-medium rounded-xl cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download list
          </button>
        )}
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`trial-tab-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer flex items-center gap-2 ${
              tab === t.id ? 'bg-zinc-900 text-white' : 'bg-white ring-1 ring-zinc-200 text-zinc-700 hover:ring-zinc-400'
            }`}
          >
            {t.label}
            <span className={`min-w-[22px] px-1.5 py-0.5 rounded-full text-xs font-semibold ${tab === t.id ? 'bg-white/20' : 'bg-zinc-100 text-zinc-600'}`}>
              {counts[t.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Sport + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search name, phone or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 text-sm bg-white ring-1 ring-zinc-200 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-800 placeholder:text-zinc-400"
          />
        </div>
        <div className="flex gap-1 p-1 bg-zinc-100 rounded-xl self-start">
          {SPORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSport(s.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap ${sport === s.id ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-600 hover:text-zinc-900'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-white ring-1 ring-zinc-200 rounded-2xl overflow-hidden">
        {shown.length === 0 ? (
          <div className="py-16 text-center px-6">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-500 flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="text-base font-medium text-zinc-800 mt-3">
              {leads.length === 0 ? 'No trial requests yet' : tab === 'new' ? 'Nobody waiting for a call 🎉' : 'Nothing here'}
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              {leads.length === 0
                ? 'When someone books a free trial on your website, they show up here.'
                : 'Try another tab or clear the search.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {shown.map((lead) => (
              <li key={lead.id} className="p-4 sm:px-5 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                <button
                  onClick={() => setOpenId(lead.id)}
                  className="flex items-center gap-3.5 flex-1 min-w-0 text-left cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-full bg-zinc-100 flex items-center justify-center text-xl flex-shrink-0">
                    {lead.category === 'basketball' ? '🏀' : '⛸️'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-base font-semibold text-zinc-900 group-hover:underline">{lead.name || 'No name'}</p>
                      <StatusPill status={lead.status} />
                      <PaymentPill lead={lead} />
                    </div>
                    <p className="text-sm text-zinc-500 truncate">
                      {formatPhone(lead.phone) || lead.email} · {timeAgo(lead.submittedAt)}
                      {summary(lead) && <span className="hidden md:inline"> · {summary(lead)}</span>}
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap sm:pl-[58px] lg:pl-0">
                  <ContactButtons lead={lead} compact />
                  <NextStep lead={lead} onChange={changeStatus} />
                  <button
                    onClick={() => setOpenId(lead.id)}
                    className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                  >
                    Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Details drawer */}
      {open && (
        <div className="!m-0 fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => { setOpenId(null); setConfirmDelete(false); }} />
          <aside className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col">
            <div className="p-5 border-b border-zinc-100 flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-2xl flex-shrink-0">
                {open.category === 'basketball' ? '🏀' : '⛸️'}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-zinc-900">{open.name || 'No name'}</h2>
                <p className="text-sm text-zinc-500">
                  {open.category === 'basketball' ? 'Basketball' : 'Skating'} trial · {fullDate(open.submittedAt)}
                </p>
              </div>
              <button
                onClick={() => { setOpenId(null); setConfirmDelete(false); }}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <section className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <ContactButtons lead={open} />
                </div>
                <div className="text-sm text-zinc-700 space-y-1">
                  {open.phone && <p>📞 {formatPhone(open.phone)}</p>}
                  {open.email && <p className="break-all">✉️ {open.email}</p>}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-zinc-900 mb-2">Status</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(STATUS).map(([key, st]) => (
                    <button
                      key={key}
                      onClick={() => changeStatus(open.id, key)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium ring-1 cursor-pointer transition ${
                        (open.status || 'new') === key ? `${st.pill} ring-2` : 'ring-zinc-200 text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      {(open.status || 'new') === key && '✓ '}
                      {st.label}
                    </button>
                  ))}
                </div>
              </section>

              {summary(open) && (
                <section>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-2">What they told us</h3>
                  <dl className="text-sm divide-y divide-zinc-100 ring-1 ring-zinc-200 rounded-xl">
                    {[
                      ['Age', open.age],
                      ['Gender', open.gender],
                      ['Program', open.programType],
                      ['Experience', open.experience],
                      ['Trial fee', open.paymentStatus === 'paid' ? 'Paid online (30 AED)' : open.paymentStatus === 'pending' ? 'Went to payment, not finished' : null],
                      ['Age group', open.ageGroup],
                      ['Location', open.location],
                      ['Preferred time', open.timeSlot],
                      ['Skate size', open.skateSize],
                      ['Needs equipment', open.needsEquipment === undefined ? null : open.needsEquipment ? 'Yes' : 'No'],
                      ['Booking code', open.ticketId],
                    ]
                      .filter(([, v]) => v !== null && v !== undefined && v !== '')
                      .map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4 px-3.5 py-2.5">
                          <dt className="text-zinc-500">{k}</dt>
                          <dd className="text-zinc-900 font-medium text-right capitalize">{String(v)}</dd>
                        </div>
                      ))}
                  </dl>
                </section>
              )}

              <section>
                <h3 className="text-sm font-semibold text-zinc-900 mb-2">Notes</h3>
                {(open.notes || []).length > 0 && (
                  <ul className="space-y-2 mb-3">
                    {open.notes.map((n, i) => (
                      <li key={i} className="p-3 bg-amber-50 rounded-xl text-sm text-zinc-800">
                        {n.text}
                        <span className="block text-xs text-zinc-400 mt-1">{fullDate(n.createdAt)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Coming Saturday with her brother"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveNote()}
                    className="flex-1 px-3.5 py-2.5 text-sm ring-1 ring-zinc-200 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                  <button
                    onClick={saveNote}
                    disabled={!noteText.trim()}
                    className="px-3.5 rounded-xl bg-zinc-900 text-white disabled:opacity-40 cursor-pointer"
                    title="Save note"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </section>
            </div>

            <div className="p-4 border-t border-zinc-100">
              {confirmDelete ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-zinc-700">Delete this request for good?</span>
                  <div className="flex gap-2">
                    <button onClick={() => setConfirmDelete(false)} className="px-3.5 py-2 rounded-xl text-sm ring-1 ring-zinc-200 cursor-pointer">
                      Keep
                    </button>
                    <button onClick={() => remove(open.id)} className="px-3.5 py-2 rounded-xl text-sm bg-rose-600 text-white cursor-pointer">
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-2 text-sm text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Delete request
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
