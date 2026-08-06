import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Ticket, Users, BarChart3, Eye, Shield, TicketIcon } from 'lucide-react';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getTickets(), api.getUsers()]).then(([ticketsData, usersData]) => {
      setTickets(ticketsData || []);
      setUsers(usersData || []);
      setLoading(false);
    });
  }, []);

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    assigned: tickets.filter(t => t.status === 'assigned').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
    totalUsers: users.length,
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Overview of your Swift Ticket System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Tickets</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-200 dark:bg-blue-800 rounded-lg">
              <TicketIcon className="w-6 h-6 text-blue-700 dark:text-blue-300" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Open Tickets</p>
              <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{stats.open + stats.assigned + stats.inProgress}</p>
            </div>
            <div className="p-3 bg-yellow-200 dark:bg-yellow-800 rounded-lg">
              <Eye className="w-6 h-6 text-yellow-700 dark:text-yellow-300" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">In Progress</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.inProgress}</p>
            </div>
            <div className="p-3 bg-purple-200 dark:bg-purple-800 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-700 dark:text-purple-300" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Resolved</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.resolved}</p>
            </div>
            <div className="p-3 bg-green-200 dark:bg-green-800 rounded-lg">
              <Shield className="w-6 h-6 text-green-700 dark:text-green-300" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tickets</h3>
            <Link to="/dashboard/tickets" className="text-sm text-blue-600 hover:text-blue-700">View all</Link>
          </div>
          <div className="space-y-3">
            {tickets.slice(0, 5).map(ticket => (
              <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{ticket.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{ticket.category}</p>
                </div>
                <Badge variant={ticket.status === 'resolved' || ticket.status === 'closed' ? 'green' : ticket.status === 'in-progress' ? 'yellow' : 'gray'}>
                  {ticket.status}
                </Badge>
              </div>
            ))}
            {tickets.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No tickets yet</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Users</h3>
            <Link to="/dashboard/users" className="text-sm text-blue-600 hover:text-blue-700">View all</Link>
          </div>
          <div className="space-y-3">
            {users.slice(0, 5).map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium text-blue-700 dark:text-blue-300">
                    {user.avatar || user.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <Badge variant={user.role === 'manager' ? 'purple' : user.role === 'support' ? 'blue' : 'gray'}>
                  {user.role}
                </Badge>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No users yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
