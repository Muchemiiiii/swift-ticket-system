import { supabase } from '../lib/supabaseClient';

// Helper to simulate network delay
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to check if Supabase is fully configured in the environment
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return !!(url && key && key !== 'YOUR_SUPABASE_PUBLISHABLE_KEY_HERE' && key !== '');
};

// Seed data for fallback/localStorage mode
const SEED_USERS = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@swift.com', password: 'password', role: 'user',    avatar: 'AJ' },
  { id: 'u2', name: 'Bob Martinez',  email: 'bob@swift.com',   password: 'password', role: 'support', avatar: 'BM' },
  { id: 'u3', name: 'Carol White',   email: 'carol@swift.com', password: 'password', role: 'manager', avatar: 'CW' },
];

const SEED_TICKETS = [];

const SEED_KB = [
  { id: 'kb1', title: 'How to reset your password',      category: 'Account',  views: 1240, content: 'Go to the login page and click "Forgot password"…' },
  { id: 'kb2', title: 'Connecting to the VPN',           category: 'Network',  views: 980,  content: 'Download the VPN client from the IT portal…' },
  { id: 'kb3', title: 'Setting up Multi-Factor Auth',    category: 'Security', views: 765,  content: 'Install the authenticator app and scan the QR code…' },
  { id: 'kb4', title: 'Requesting new hardware',         category: 'Hardware', views: 432,  content: 'Submit a ticket under the Hardware category…' },
];

// ─── LocalStorage Init (fallback only) ───────────────────────────────────────
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

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getUsers   = () => JSON.parse(localStorage.getItem('swift_users')   || '[]');
const getTickets = () => JSON.parse(localStorage.getItem('swift_tickets') || '[]');

// ─── API ─────────────────────────────────────────────────────────────────────
export const api = {
  // Auth
  login: async (email, password) => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.user) throw new Error('Authentication failed.');

        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const user = (profile && !profileErr) ? profile : {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email.split('@')[0],
          role: data.user.user_metadata?.role || 'user',
          avatar: data.user.user_metadata?.avatar || 'U',
        };
        return user;
      } catch (e) {
        console.warn('Supabase login failed, falling back:', e);
      }
    }
    await delay(600);
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) throw new Error('Invalid email or password.');
    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  signup: async ({ name, email, password, role = 'user' }) => {
    if (isSupabaseConfigured()) {
      try {
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role,
              avatar: initials,
            },
          },
        });
        if (error) throw error;
        if (!data.user) throw new Error('Registration failed.');

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const user = profile || {
          id: data.user.id,
          email: data.user.email,
          name,
          role,
          avatar: initials,
        };
        return user;
      } catch (e) {
        console.warn('Supabase signup failed, falling back:', e);
      }
    }
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
            trackingNumber:tracking_number,
            submittedBy:submitted_by,
            assignedTo:assigned_to,
            createdAt:created_at,
            resolution,
            technicianComments:technician_comments,
            resolvedAt:resolved_at
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
    const trackingNumber = ticketData.trackingNumber || `STS-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
    if (isSupabaseConfigured()) {
      try {
        const payload = {
          title: ticketData.title,
          description: ticketData.description,
          category: ticketData.category,
          priority: ticketData.priority,
          first_name: ticketData.firstName,
          last_name: ticketData.lastName,
          email: ticketData.email,
          phone: ticketData.phone,
          registration_number: ticketData.registrationNumber,
          location: ticketData.location,
          tracking_number: trackingNumber,
          submitted_by: ticketData.creatorId || ticketData.submittedBy,
          assigned_to: ticketData.assignedTo || null,
          resolution: ticketData.resolution || null,
          technician_comments: ticketData.technicianComments || null,
          resolved_at: ticketData.resolvedAt || null
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
            trackingNumber:tracking_number,
            submittedBy:submitted_by,
            assignedTo:assigned_to,
            createdAt:created_at,
            resolution,
            technicianComments:technician_comments,
            resolvedAt:resolved_at
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
      id: trackingNumber,
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
        if (updates.technicianComments !== undefined) payload.technician_comments = updates.technicianComments;
        if (updates.resolvedAt !== undefined) payload.resolved_at = updates.resolvedAt;

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
            resolution,
            technicianComments:technician_comments,
            resolvedAt:resolved_at
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

  // Resolution Details
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
