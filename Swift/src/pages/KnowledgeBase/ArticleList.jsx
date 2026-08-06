import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

export const ArticleList = () => {
  const [resolutions, setResolutions] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getTickets(), api.getUsers()]).then(([tickets, allUsers]) => {
      const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');
      setResolutions(resolved);
      setUsers(allUsers);
      setLoading(false);
    });
  }, []);

  const getUserName = (userId) => {
    if (!userId) return 'Unassigned';
    const user = users.find(u => u.id === userId);
    return user ? `${user.name || user.email}` : 'Unknown';
  };

  const filtered = resolutions.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    (r.resolution && r.resolution.toLowerCase().includes(search.toLowerCase())) ||
    (r.trackingNumber && r.trackingNumber.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading resolutions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resolution Details</h1>
        <div className="w-72 relative">
          <Input
            placeholder="Search resolutions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">No resolutions found</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">There are no resolved tickets in the system yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(ticket => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{ticket.title}</h3>
                <Badge variant="green">Resolved</Badge>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Resolution Message</p>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    {ticket.resolution || 'No resolution message provided.'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Technician's Comments</p>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    {ticket.technicianComments || 'No comments provided.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Resolved By</p>
                    <p className="text-gray-900 dark:text-white font-medium">{getUserName(ticket.assignedTo)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Date & Time Resolved</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {ticket.resolvedAt ? new Date(ticket.resolvedAt).toLocaleString() : new Date(ticket.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
