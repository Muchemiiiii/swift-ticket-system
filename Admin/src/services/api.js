import { supabase } from '../lib/supabaseClient';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return !!(url && key && key !== 'YOUR_SUPABASE_PUBLISHABLE_KEY_HERE' && key !== '');
};

const SEED_TICKETS = [];
const SEED_USERS = [];

const initDB = () => {
  if (!localStorage.getItem('swift_tickets')) {
    localStorage.setItem('swift_tickets', JSON.stringify(SEED_TICKETS));
  }
  if (!localStorage.getItem('swift_users')) {
    localStorage.setItem('swift_users', JSON.stringify(SEED_USERS));
  }
};

if (!isSupabaseConfigured()) {
  initDB();
}

const getTickets = () => JSON.parse(localStorage.getItem('swift_tickets') || '[]');
const getUsers = () => JSON.parse(localStorage.getItem('swift_users') || '[]');

export const api = {
  async getTickets() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
        console.warn('Supabase tickets fetch failed, falling back:', error?.message);
      } catch (e) {
        console.warn('Supabase tickets error, falling back:', e);
      }
    }
    await delay(300);
    return getTickets();
  },

  async getUsers() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
        if (!error && data) return data;
        console.warn('Supabase profiles fetch failed, falling back:', error?.message);
      } catch (e) {
        console.warn('Supabase profiles error, falling back:', e);
      }
    }
    await delay(200);
    return getUsers().map(({ password: _, ...u }) => u);
  },

  async deleteTicket(id) {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('tickets')
          .delete()
          .eq('id', id);
        if (!error) return true;
        console.warn('Supabase ticket delete failed, falling back:', error?.message);
      } catch (e) {
        console.warn('Supabase ticket delete error, falling back:', e);
      }
    }
    const tickets = getTickets().filter(t => t.id !== id);
    localStorage.setItem('swift_tickets', JSON.stringify(tickets));
    return true;
  },

  async deleteUser(id) {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', id);
        if (!error) return true;
        console.warn('Supabase user delete failed, falling back:', error?.message);
      } catch (e) {
        console.warn('Supabase user delete error, falling back:', e);
      }
    }
    const users = getUsers().filter(u => u.id !== id);
    localStorage.setItem('swift_users', JSON.stringify(users));
    return true;
  },

  async updateTicket(id, updates) {
    if (isSupabaseConfigured()) {
      try {
        const payload = {};
        if (updates.status !== undefined) payload.status = updates.status;
        if (updates.resolution !== undefined) payload.resolution = updates.resolution;
        if (updates.technicianComments !== undefined) payload.technician_comments = updates.technicianComments;
        if (updates.resolvedAt !== undefined) payload.resolved_at = updates.resolvedAt;

        const { data, error } = await supabase
          .from('tickets')
          .update(payload)
          .eq('id', id)
          .select('*')
          .single();
        if (!error && data) return data;
        console.warn('Supabase ticket update failed, falling back:', error?.message);
      } catch (e) {
        console.warn('Supabase ticket update error, falling back:', e);
      }
    }
    await delay(400);
    const tickets = getTickets();
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Ticket not found');
    tickets[index] = { ...tickets[index], ...updates };
    localStorage.setItem('swift_tickets', JSON.stringify(tickets));
    return tickets[index];
  },

  async clearTickets() {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('tickets')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) console.warn('Supabase clear tickets failed:', error?.message);
      } catch (e) {
        console.warn('Supabase clear tickets error:', e);
      }
    }
    localStorage.removeItem('swift_tickets');
    return true;
  },

  async clearUsers() {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) console.warn('Supabase clear users failed:', error?.message);
      } catch (e) {
        console.warn('Supabase clear users error:', e);
      }
    }
    localStorage.removeItem('swift_users');
    return true;
  },
};
