import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Ticket, Trash2, TicketIcon, Save, X } from 'lucide-react';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);
  const [resolutionForm, setResolutionForm] = useState({ resolution: '', technicianComments: '' });

  const loadTickets = () => {
    setLoading(true);
    api.getTickets().then(data => {
      setTickets(data || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const deleteTicket = async (id) => {
    if (!confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) return;
    await api.deleteTicket(id);
    loadTickets();
  };

  const updateTicketStatus = async (id, newStatus) => {
    await api.updateTicket(id, { status: newStatus });
    setResolvingId(null);
    setResolutionForm({ resolution: '', technicianComments: '' });
    loadTickets();
  };

  const submitResolution = async (id) => {
    if (!resolutionForm.resolution.trim()) {
      alert('Please enter a resolution message.');
      return;
    }
    await api.updateTicket(id, {
      status: 'resolved',
      resolution: resolutionForm.resolution.trim(),
      technicianComments: resolutionForm.technicianComments.trim(),
      resolvedAt: new Date().toISOString()
    });
    setResolvingId(null);
    setResolutionForm({ resolution: '', technicianComments: '' });
    loadTickets();
  };

  const startResolve = (ticket) => {
    setResolvingId(ticket.id);
    setResolutionForm({
      resolution: ticket.resolution || '',
      technicianComments: ticket.technicianComments || ''
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tickets</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage all tickets in the system</p>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{tickets.length} total</span>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Tracking</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Title</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Priority</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Created</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <React.Fragment key={ticket.id}>
                  <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4 text-sm font-mono text-gray-900 dark:text-white">{ticket.trackingNumber || ticket.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{ticket.title}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{ticket.category}</td>
                    <td className="py-3 px-4">
                      <Badge variant={ticket.priority === 'high' ? 'red' : ticket.priority === 'medium' ? 'yellow' : 'gray'}>
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ticket.status}
                        onChange={(e) => {
                          if (e.target.value === 'resolved' || e.target.value === 'closed') {
                            startResolve(ticket);
                          } else {
                            updateTicketStatus(ticket.id, e.target.value);
                          }
                        }}
                        className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="open">Open</option>
                        <option value="assigned">Assigned</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => deleteTicket(ticket.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {resolvingId === ticket.id && (
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/10">
                      <td colSpan="7" className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resolution Message</label>
                            <textarea
                              value={resolutionForm.resolution}
                              onChange={(e) => setResolutionForm(prev => ({ ...prev, resolution: e.target.value }))}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Describe how this ticket was resolved..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Technician's Comments</label>
                            <textarea
                              value={resolutionForm.technicianComments}
                              onChange={(e) => setResolutionForm(prev => ({ ...prev, technicianComments: e.target.value }))}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Add any additional comments..."
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                          <Button variant="ghost" size="sm" onClick={() => { setResolvingId(null); setResolutionForm({ resolution: '', technicianComments: '' }); }}>
                            <X className="w-4 h-4 mr-1" /> Cancel
                          </Button>
                          <Button size="sm" onClick={() => submitResolution(ticket.id)}>
                            <Save className="w-4 h-4 mr-1" /> Save Resolution
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {tickets.length === 0 && (
            <div className="text-center py-12">
              <TicketIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No tickets found</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
