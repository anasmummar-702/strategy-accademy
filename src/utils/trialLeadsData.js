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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }
  return leads;
}

/**
 * Delete a lead
 */
export function deleteTrialLead(leadId) {
  let leads = getAllTrialLeads();
  leads = leads.filter((l) => l.id !== leadId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }
  return leads;
}
