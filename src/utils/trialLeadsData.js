/**
 * Trial Leads Data Utility
 * Stores & retrieves user trial submissions from localStorage
 * Categories: Skating Trial | Basketball Trial
 */

const STORAGE_KEY = 'strategy_trial_leads';

/**
 * Get all trial leads from localStorage
 */
export function getAllTrialLeads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save a new trial lead
 * @param {'skating' | 'basketball'} category
 * @param {Object} formData - The form submission data
 */
export function saveTrialLead(category, formData) {
  const leads = getAllTrialLeads();
  const newLead = {
    id: `LEAD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    category,
    submittedAt: new Date().toISOString(),
    status: 'new', // new | contacted | converted | archived
    ...formData,
  };
  leads.unshift(newLead); // newest first
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (e) {
    // Storage full: don't break the booking form for the visitor
    console.error('Could not store trial lead:', e);
    return { ...newLead, saved: false };
  }

  // Dispatch event so admin panel can react
  window.dispatchEvent(new CustomEvent('strategy_trial_lead_added', { detail: newLead }));
  return newLead;
}

/**
 * Update a lead's status
 */
export function updateLeadStatus(leadId, newStatus) {
  const leads = getAllTrialLeads();
  const idx = leads.findIndex((l) => l.id === leadId);
  if (idx !== -1) {
    leads[idx].status = newStatus;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error('Could not update trial lead:', e);
      return null;
    }
    window.dispatchEvent(new CustomEvent('strategy_trial_leads_changed'));
  }
  return leads;
}

/**
 * Update any fields of a lead (e.g. mark the trial fee as paid)
 */
export function updateTrialLead(leadId, patch) {
  const leads = getAllTrialLeads();
  const idx = leads.findIndex((l) => l.id === leadId);
  if (idx === -1) return null;
  leads[idx] = { ...leads[idx], ...patch };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    window.dispatchEvent(new CustomEvent('strategy_trial_leads_changed'));
  } catch (e) {
    console.error('Could not update trial lead:', e);
    return null;
  }
  return leads[idx];
}

/**
 * Delete a lead
 */
export function deleteTrialLead(leadId) {
  let leads = getAllTrialLeads();
  leads = leads.filter((l) => l.id !== leadId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  window.dispatchEvent(new CustomEvent('strategy_trial_leads_changed'));
  return leads;
}

/**
 * Add a note to a lead
 */
export function addLeadNote(leadId, note) {
  const leads = getAllTrialLeads();
  const idx = leads.findIndex((l) => l.id === leadId);
  if (idx !== -1) {
    if (!leads[idx].notes) leads[idx].notes = [];
    leads[idx].notes.push({ text: note, createdAt: new Date().toISOString() });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error('Could not save note:', e);
      return null;
    }
  }
  return leads;
}
