import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Search, Filter, Mail, Phone, Calendar, ChevronDown,
  Trash2, Eye, X, MessageSquare, Send, Clock, CheckCircle2,
  Archive, ArrowUpRight, UserCheck, AlertCircle, Sparkles,
  Download, MoreHorizontal
} from 'lucide-react';
import { getAllTrialLeads, updateLeadStatus, deleteTrialLead, addLeadNote } from '../../../utils/trialLeadsData';

// Status config
const STATUS_CONFIG = {
  new: { label: 'New Lead', color: '#3b82f6', bg: '#1e3a5f' },
  contacted: { label: 'Contacted', color: '#f59e0b', bg: '#422006' },
  converted: { label: 'Converted', color: '#10b981', bg: '#064e3b' },
  archived: { label: 'Archived', color: '#6b7280', bg: '#1f2937' },
};

const CATEGORY_CONFIG = {
  skating: { label: 'Skating Trial', color: '#06b6d4', emoji: '⛸️' },
  basketball: { label: 'Basketball Trial', color: '#f97316', emoji: '🏀' },
};

export default function TrialLeadsView() {
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Load leads
  const loadLeads = () => {
    setLeads(getAllTrialLeads());
  };

  useEffect(() => {
    loadLeads();
    const handler = () => loadLeads();
    window.addEventListener('strategy_trial_lead_added', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('strategy_trial_lead_added', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchCategory = filterCategory === 'all' || lead.category === filterCategory;
      const matchStatus = filterStatus === 'all' || lead.status === filterStatus;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        (lead.name || '').toLowerCase().includes(q) ||
        (lead.email || '').toLowerCase().includes(q) ||
        (lead.phone || '').includes(q);
      return matchCategory && matchStatus && matchSearch;
    });
  }, [leads, filterCategory, filterStatus, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === 'new').length;
    const skatingCount = leads.filter((l) => l.category === 'skating').length;
    const basketballCount = leads.filter((l) => l.category === 'basketball').length;
    return { total, newCount, skatingCount, basketballCount };
  }, [leads]);

  const handleStatusChange = (leadId, newStatus) => {
    updateLeadStatus(leadId, newStatus);
    loadLeads();
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleDelete = (leadId) => {
    deleteTrialLead(leadId);
    loadLeads();
    if (selectedLead?.id === leadId) setSelectedLead(null);
    setShowDeleteConfirm(null);
  };

  const handleAddNote = () => {
    if (!noteText.trim() || !selectedLead) return;
    addLeadNote(selectedLead.id, noteText.trim());
    loadLeads();
    setNoteText('');
    // Refresh selected lead
    const updated = getAllTrialLeads().find((l) => l.id === selectedLead.id);
    if (updated) setSelectedLead(updated);
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Category', 'Status', 'Submitted At'];
    const rows = filteredLeads.map((l) => [
      l.name || '', l.email || '', l.phone || '', l.category || '', l.status || '', l.submittedAt || ''
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trial_leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Trial Leads & Registrations
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            User data collected from trial booking pages — categorized by Skating & Basketball
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-medium rounded-lg transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Leads', value: stats.total, icon: Users, color: '#6366f1' },
          { label: 'New / Uncontacted', value: stats.newCount, icon: Sparkles, color: '#3b82f6' },
          { label: 'Skating Leads', value: stats.skatingCount, icon: () => <span className="text-base">⛸️</span>, color: '#06b6d4' },
          { label: 'Basketball Leads', value: stats.basketballCount, icon: () => <span className="text-base">🏀</span>, color: '#f97316' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-zinc-200/90 rounded-xl p-4 flex items-center gap-3"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
            </div>
            <div>
              <div className="text-lg font-bold text-zinc-900">{stat.value}</div>
              <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 text-zinc-800 placeholder:text-zinc-400"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 text-zinc-700 cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="skating">⛸️ Skating</option>
          <option value="basketball">🏀 Basketball</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 text-zinc-700 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="new">🆕 New</option>
          <option value="contacted">📞 Contacted</option>
          <option value="converted">✅ Converted</option>
          <option value="archived">📦 Archived</option>
        </select>
      </div>

      {/* Main Content: Table + Detail Panel */}
      <div className="flex gap-4" style={{ minHeight: 400 }}>
        {/* Table */}
        <div className={`flex-1 bg-white border border-zinc-200/90 rounded-xl overflow-hidden transition-all ${selectedLead ? 'w-2/3' : 'w-full'}`}>
          {filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-zinc-400" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-700 mb-1">No trial leads yet</h3>
              <p className="text-xs text-zinc-500 max-w-xs">
                When users submit trial booking forms on your Skating or Basketball pages, their data will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200">
                    <th className="text-left px-4 py-2.5 font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">User</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">Contact</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">Category</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">Status</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">Date</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredLeads.map((lead) => {
                    const cat = CATEGORY_CONFIG[lead.category] || CATEGORY_CONFIG.skating;
                    const st = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
                    const isSelected = selectedLead?.id === lead.id;

                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50/70' : 'hover:bg-zinc-50/80'}`}
                      >
                        {/* User */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                              style={{ background: `linear-gradient(135deg, ${cat.color}, ${cat.color}aa)` }}
                            >
                              {(lead.name || '??').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-zinc-900 text-xs">{lead.name || 'Unknown'}</div>
                              {lead.age && (
                                <div className="text-[10px] text-zinc-400 mt-0.5">Age: {lead.age} • {lead.gender || '—'}</div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1 text-zinc-700">
                              <Mail className="w-3 h-3 text-zinc-400" />
                              <span className="truncate max-w-[160px]">{lead.email || '—'}</span>
                            </div>
                            <div className="flex items-center gap-1 text-zinc-500">
                              <Phone className="w-3 h-3 text-zinc-400" />
                              <span>{lead.phone ? `+971 ${lead.phone}` : '—'}</span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{ color: cat.color, backgroundColor: `${cat.color}15`, border: `1px solid ${cat.color}30` }}
                          >
                            {cat.emoji} {cat.label}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <select
                            value={lead.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleStatusChange(lead.id, e.target.value);
                            }}
                            className="px-2 py-1 rounded-md text-[10px] font-semibold border-0 cursor-pointer focus:outline-none"
                            style={{ color: st.color, backgroundColor: `${st.bg}` }}
                          >
                            <option value="new" style={{ background: '#1e3a5f', color: '#3b82f6' }}>🆕 New</option>
                            <option value="contacted" style={{ background: '#422006', color: '#f59e0b' }}>📞 Contacted</option>
                            <option value="converted" style={{ background: '#064e3b', color: '#10b981' }}>✅ Converted</option>
                            <option value="archived" style={{ background: '#1f2937', color: '#6b7280' }}>📦 Archived</option>
                          </select>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-zinc-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(lead.submittedAt)}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLead(lead);
                              }}
                              className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-500 hover:text-indigo-600 transition cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteConfirm(lead.id);
                              }}
                              className="p-1.5 rounded-md hover:bg-red-50 text-zinc-500 hover:text-red-500 transition cursor-pointer"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Sidebar */}
        {selectedLead && (
          <div className="w-80 bg-white border border-zinc-200/90 rounded-xl overflow-hidden flex-shrink-0 flex flex-col">
            {/* Detail Header */}
            <div
              className="p-4 border-b border-zinc-200/80 relative"
              style={{ background: `linear-gradient(135deg, ${CATEGORY_CONFIG[selectedLead.category]?.color || '#6366f1'}10, white)` }}
            >
              <button
                onClick={() => setSelectedLead(null)}
                className="absolute top-3 right-3 p-1 rounded-md hover:bg-zinc-200/60 text-zinc-400 hover:text-zinc-700 transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${CATEGORY_CONFIG[selectedLead.category]?.color || '#6366f1'}, ${CATEGORY_CONFIG[selectedLead.category]?.color || '#6366f1'}aa)` }}
                >
                  {(selectedLead.name || '??').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">{selectedLead.name || 'Unknown'}</h3>
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold mt-0.5"
                    style={{
                      color: CATEGORY_CONFIG[selectedLead.category]?.color,
                      backgroundColor: `${CATEGORY_CONFIG[selectedLead.category]?.color}15`,
                    }}
                  >
                    {CATEGORY_CONFIG[selectedLead.category]?.emoji} {CATEGORY_CONFIG[selectedLead.category]?.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Detail Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: 'none' }}>
              {/* Contact Info */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Contact Information</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 p-2 bg-zinc-50 rounded-lg">
                    <Mail className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span className="text-xs text-zinc-700 break-all">{selectedLead.email || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-zinc-50 rounded-lg">
                    <Phone className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span className="text-xs text-zinc-700">{selectedLead.phone ? `+971 ${selectedLead.phone}` : '—'}</span>
                  </div>
                </div>
              </div>

              {/* Extra Details */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Submission Details</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedLead.age && (
                    <div className="p-2 bg-zinc-50 rounded-lg">
                      <div className="text-[9px] text-zinc-400 uppercase font-medium">Age</div>
                      <div className="text-xs font-semibold text-zinc-800">{selectedLead.age}</div>
                    </div>
                  )}
                  {selectedLead.gender && (
                    <div className="p-2 bg-zinc-50 rounded-lg">
                      <div className="text-[9px] text-zinc-400 uppercase font-medium">Gender</div>
                      <div className="text-xs font-semibold text-zinc-800">{selectedLead.gender}</div>
                    </div>
                  )}
                  {selectedLead.programType && (
                    <div className="p-2 bg-zinc-50 rounded-lg col-span-2">
                      <div className="text-[9px] text-zinc-400 uppercase font-medium">Program</div>
                      <div className="text-xs font-semibold text-zinc-800">{selectedLead.programType}</div>
                    </div>
                  )}
                  {selectedLead.experience && (
                    <div className="p-2 bg-zinc-50 rounded-lg col-span-2">
                      <div className="text-[9px] text-zinc-400 uppercase font-medium">Experience</div>
                      <div className="text-xs font-semibold text-zinc-800">{selectedLead.experience}</div>
                    </div>
                  )}
                  {selectedLead.timeSlot && (
                    <div className="p-2 bg-zinc-50 rounded-lg">
                      <div className="text-[9px] text-zinc-400 uppercase font-medium">Time Slot</div>
                      <div className="text-xs font-semibold text-zinc-800">{selectedLead.timeSlot}</div>
                    </div>
                  )}
                  {selectedLead.ticketId && (
                    <div className="p-2 bg-zinc-50 rounded-lg">
                      <div className="text-[9px] text-zinc-400 uppercase font-medium">Ticket ID</div>
                      <div className="text-xs font-mono font-semibold text-indigo-600">{selectedLead.ticketId}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Change */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Lead Status</h4>
                <div className="flex gap-1.5 flex-wrap">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => handleStatusChange(selectedLead.id, key)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border transition cursor-pointer ${
                        selectedLead.status === key
                          ? 'ring-2 ring-offset-1'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      style={{
                        color: cfg.color,
                        backgroundColor: cfg.bg,
                        borderColor: `${cfg.color}40`,
                        ...(selectedLead.status === key ? { ringColor: cfg.color } : {}),
                      }}
                    >
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Notes</h4>
                {selectedLead.notes && selectedLead.notes.length > 0 ? (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                    {selectedLead.notes.map((n, i) => (
                      <div key={i} className="p-2 bg-amber-50 border border-amber-200/60 rounded-lg">
                        <p className="text-[11px] text-zinc-700">{n.text}</p>
                        <p className="text-[9px] text-zinc-400 mt-1">{formatDate(n.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-400 italic">No notes added yet</p>
                )}
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Add a note..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                    className="flex-1 px-2.5 py-1.5 text-[11px] bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 text-zinc-800 placeholder:text-zinc-400"
                  />
                  <button
                    onClick={handleAddNote}
                    className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Submitted At */}
              <div className="pt-2 border-t border-zinc-100">
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <Calendar className="w-3 h-3" />
                  Submitted: {formatDate(selectedLead.submittedAt)}
                </div>
                <div className="text-[9px] text-zinc-300 font-mono mt-0.5">{selectedLead.id}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-zinc-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Delete This Lead?</h3>
                <p className="text-[11px] text-zinc-500">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition cursor-pointer"
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
