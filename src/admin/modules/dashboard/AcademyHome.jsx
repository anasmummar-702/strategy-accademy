import React, { useEffect, useState } from 'react';
import { Inbox, GraduationCap, Image as ImageIcon, Phone, Plus, Tag } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { getAllTrialLeads } from '../../../utils/trialLeadsData';
import { getAcademyPackages } from '../../../utils/academyPackagesData';
import { getSkatingGallery, getBasketballGallery } from '../../../utils/academyGalleriesData';
import { formatPhone } from '../leads/TrialLeadsView';
import { Welcome, SummaryCard, QuickAction, Panel, EmptyRow } from './HomeParts';

const STATUS_LABEL = {
  new: { text: 'New', cls: 'bg-blue-50 text-blue-700' },
  contacted: { text: 'Called', cls: 'bg-amber-50 text-amber-700' },
  converted: { text: 'Joined', cls: 'bg-emerald-50 text-emerald-700' },
  archived: { text: 'Not interested', cls: 'bg-zinc-100 text-zinc-500' },
};

function readData() {
  return {
    leads: getAllTrialLeads(),
    packages: getAcademyPackages(),
    photos: getSkatingGallery().length + getBasketballGallery().length,
  };
}

function shortDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
}

export default function AcademyHome({ onNavigate }) {
  const { admin } = useAdminAuth();
  const [data, setData] = useState(readData);

  useEffect(() => {
    const refresh = () => setData(readData());
    const events = ['strategy_trial_lead_added', 'strategy_trial_leads_changed', 'strategy_packages_updated', 'strategy_gallery_updated', 'storage'];
    events.forEach((e) => window.addEventListener(e, refresh));
    return () => events.forEach((e) => window.removeEventListener(e, refresh));
  }, []);

  const newLeads = data.leads.filter((l) => l.status === 'new');
  const activePackages = data.packages.filter((p) => (p.status || 'active') === 'active');
  const latest = data.leads.slice(0, 5);

  return (
    <div className="space-y-8">
      <Welcome name={admin?.fullName}>
        {newLeads.length > 0
          ? `You have ${newLeads.length} new trial request${newLeads.length === 1 ? '' : 's'} waiting for a call.`
          : 'Everything is up to date. Here is a quick look at your academy.'}
      </Welcome>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          id="home-card-trials"
          icon={Inbox}
          tone={newLeads.length ? 'blue' : 'zinc'}
          value={newLeads.length}
          label="New trial requests"
          hint={`${data.leads.length} in total`}
          action="See requests"
          onClick={() => onNavigate('trial-leads')}
        />
        <SummaryCard
          id="home-card-packages"
          icon={GraduationCap}
          tone="emerald"
          value={activePackages.length}
          label="Packages on the website"
          hint="Change prices and what's included"
          action="Edit packages"
          onClick={() => onNavigate('academy')}
        />
        <SummaryCard
          id="home-card-gallery"
          icon={ImageIcon}
          tone="amber"
          value={data.photos}
          label="Photos in the gallery"
          hint="Skating and basketball pages"
          action="Manage photos"
          onClick={() => onNavigate('galleries')}
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-zinc-500 mb-3">Quick actions</h3>
        <div className="flex flex-wrap gap-3">
          <QuickAction primary icon={Inbox} label="Call new trial requests" onClick={() => onNavigate('trial-leads')} />
          <QuickAction icon={Tag} label="Change a package price" onClick={() => onNavigate('academy')} />
          <QuickAction icon={Plus} label="Add photos" onClick={() => onNavigate('galleries')} />
        </div>
      </div>

      <Panel title="Latest trial requests" linkLabel="See all" onLink={() => onNavigate('trial-leads')}>
        {latest.length === 0 ? (
          <EmptyRow
            icon={Inbox}
            title="No trial requests yet"
            text="When someone books a free trial on your website, they will show up here."
          />
        ) : (
          <ul className="divide-y divide-zinc-100">
            {latest.map((lead) => {
              const st = STATUS_LABEL[lead.status] || STATUS_LABEL.new;
              return (
                <li key={lead.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-lg flex-shrink-0">
                    {lead.category === 'basketball' ? '🏀' : '⛸️'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-medium text-zinc-900 truncate">{lead.name || 'No name'}</p>
                    <p className="text-sm text-zinc-500 truncate">
                      {lead.category === 'basketball' ? 'Basketball' : 'Skating'} trial · {shortDate(lead.submittedAt)}
                    </p>
                  </div>
                  {lead.phone && (
                    <a
                      href={`tel:${formatPhone(lead.phone).replace(/\s/g, '')}`}
                      className="hidden sm:inline-flex items-center gap-1.5 text-sm text-zinc-700 hover:text-zinc-950"
                    >
                      <Phone className="w-4 h-4" />
                      {formatPhone(lead.phone)}
                    </a>
                  )}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${st.cls}`}>{st.text}</span>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}
