import { supabase } from '../lib/supabaseClient';

// Helper to simulate network delay
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to check if Supabase is fully configured in the environment
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!(url && key && key !== 'YOUR_SUPABASE_ANON_KEY_HERE' && key !== '');
};

// ─── Seed Data ───────────────────────────────────────────────────────────────
const SEED_USERS = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@swift.com', password: 'password', role: 'user',    avatar: 'AJ' },
  { id: 'u2', name: 'Bob Martinez',  email: 'bob@swift.com',   password: 'password', role: 'support', avatar: 'BM' },
  { id: 'u3', name: 'Carol White',   email: 'carol@swift.com', password: 'password', role: 'manager', avatar: 'CW' },
];

const SEED_TICKETS = [
  { id: 't1', title: 'VPN not connecting',           description: 'Cannot connect to VPN since this morning.',           category: 'Network',   priority: 'high',   status: 'open',       submittedBy: 'u1', assignedTo: 'u2', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), resolution: null },
  { id: 't2', title: 'Outlook keeps crashing',       description: 'Outlook crashes every time I try to open an email.', category: 'Software',  priority: 'medium', status: 'in-progress', submittedBy: 'u1', assignedTo: 'u2', createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), resolution: null },
  { id: 't3', title: 'New laptop setup request',     description: 'Need a new laptop configured for the sales team.',   category: 'Hardware',  priority: 'low',    status: 'resolved',   submittedBy: 'u1', assignedTo: 'u2', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), resolution: 'Laptop ordered and configured.' },
];

const SEED_KB = [
  { id: 'kb1', title: 'How to reset your password',      category: 'Account',  views: 1240, content: 'Go to the login page and click "Forgot password"…' },
  { id: 'kb2', title: 'Connecting to the VPN',           category: 'Network',  views: 980,  content: 'Download the VPN client from the IT portal…' },
  { id: 'kb3', title: 'Setting up Multi-Factor Auth',    category: 'Security', views: 765,  content: 'Install the authenticator app and scan the QR code…' },
  { id: 'kb4', title: 'Requesting new hardware',         category: 'Hardware', views: 432,  content: 'Submit a ticket under the Hardware category…' },
];

// ─── DB Init ─────────────────────────────────────────────────────────────────
const initDB = () => {
  if (!localStorage.getItem('swift_tickets')) {
    localStorage.setItem('swift_tickets', JSON.stringify(SEED_TICKETS));
  }
  if (!localStorage.getItem('swift_users')) {
    localStorage.setItem('swift_users', JSON.stringify(SEED_USERS));
  }
};
initDB();

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getUsers   = () => JSON.parse(localStorage.getItem('swift_users')   || '[]');
const getTickets = () => JSON.parse(localStorage.getItem('swift_tickets') || '[]');

// ─── API ─────────────────────────────────────────────────────────────────────
export const api = {
  // Auth (Fallback endpoints kept for legacy/fallback support if needed)
  login: async (email, password) => {
    await delay(600);
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) throw new Error('Invalid email or password.');
    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  signup: async ({ name, email, password, role = 'user' }) => {
    await delay(600);
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newUser = {
      id: `u${Date.now()}`,
      name,
      email,
      password,
      role,
      avatar: initials,
    };
    users.push(newUser);
    localStorage.setItem('swift_users', JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  },

  // Users
  getUsers: async () => {
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

  // Tickets
  getTickets: async () => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select(`
            id,
            title,
            description,
            category,
            priority,
            status,
            submittedBy:submitted_by,
            assignedTo:assigned_to,
            createdAt:created_at,
            resolution
          `)
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

  createTicket: async (ticketData) => {
    if (isSupabaseConfigured()) {
      try {
        const payload = {
          title: ticketData.title,
          description: ticketData.description,
          category: ticketData.category,
          priority: ticketData.priority,
          submitted_by: ticketData.creatorId || ticketData.submittedBy,
          assigned_to: ticketData.assignedTo || null,
          resolution: ticketData.resolution || null
        };
        const { data, error } = await supabase
          .from('tickets')
          .insert(payload)
          .select(`
            id,
            title,
            description,
            category,
            priority,
            status,
            submittedBy:submitted_by,
            assignedTo:assigned_to,
            createdAt:created_at,
            resolution
          `)
          .single();
        if (!error && data) return data;
        console.warn('Supabase ticket creation failed, falling back:', error?.message);
      } catch (e) {
        console.warn('Supabase ticket creation error, falling back:', e);
      }
    }
    await delay(400);
    const tickets = getTickets();
    const newTicket = {
      id: `t${Date.now()}`,
      ...ticketData,
      status: 'open',
      assignedTo: null,
      createdAt: new Date().toISOString(),
      resolution: null,
    };
    tickets.push(newTicket);
    localStorage.setItem('swift_tickets', JSON.stringify(tickets));
    return newTicket;
  },

  updateTicket: async (id, updates) => {
    if (isSupabaseConfigured()) {
      try {
        const payload = {};
        if (updates.status !== undefined) payload.status = updates.status;
        if (updates.assignedTo !== undefined) payload.assigned_to = updates.assignedTo;
        if (updates.resolution !== undefined) payload.resolution = updates.resolution;

        const { data, error } = await supabase
          .from('tickets')
          .update(payload)
          .eq('id', id)
          .select(`
            id,
            title,
            description,
            category,
            priority,
            status,
            submittedBy:submitted_by,
            assignedTo:assigned_to,
            createdAt:created_at,
            resolution
          `)
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

  // Knowledge Base
  getKnowledgeBase: async () => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('knowledge_base')
          .select('*')
          .order('views', { ascending: false });
        if (!error && data) {
          return data;
        }
        console.warn('Supabase KB fetch failed, falling back:', error?.message);
      } catch (e) {
        console.warn('Supabase KB error, falling back:', e);
      }
    }
    await delay(200);
    return SEED_KB;
  },
};
