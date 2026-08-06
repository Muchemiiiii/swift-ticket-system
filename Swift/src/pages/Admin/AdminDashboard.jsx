import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Ticket, Users, BarChart3, Settings, Trash2, Eye, Shield, TicketIcon, Home } from 'lucide-react';

const TABS = {
  OVERVIEW: 'overview',
  TICKETS: 'tickets',
  USERS: 'users',
  REPORTS: 'reports',
  SETTINGS: 'settings'
};

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);
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

  const refreshData = () => {
    setLoading(true);
    Promise.all([api.getTickets(), api.getUsers()]).then(([ticketsData, usersData]) => {
      setTickets(ticketsData || []);
      setUsers(usersData || []);
      setLoading(false);
    });
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    assigned: tickets.filter(t => t.status === 'assigned').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length,
    totalUsers: users.length,
  };

  const deleteTicket = async (id) => {
    if (!confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) return;
    const updated = tickets.filter(t => t.id !== id);
    setTickets(updated);
    localStorage.setItem('swift_tickets', JSON.stringify(updated));
  };

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    localStorage.setItem('swift_users', JSON.stringify(updated));
  };

  const updateTicketStatus = async (id, newStatus) => {
    const updated = tickets.map(t => {
      if (t.id === id) {
        const update = { status: newStatus };
        if (newStatus === 'resolved' || newStatus === 'closed') {
          update.resolvedAt = new Date().toISOString();
          if (!t.resolution) {
            update.resolution = 'Resolved by admin';
          }
        }
        return { ...t, ...update };
      }
      return t;
    });
    setTickets(updated);
    localStorage.setItem('swift_tickets', JSON.stringify(updated));
  };

  const getUserName = (userId) => {
    if (!userId) return 'Unassigned';
    const user = users.find(u => u.id === userId);
    return user ? `${user.name || user.email}` : 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.OVERVIEW:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{stats.open}</p>
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
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.resolved + stats.closed}</p>
                  </div>
                  <div className="p-3 bg-green-200 dark:bg-green-800 rounded-lg">
                    <Shield className="w-6 h-6 text-green-700 dark:text-green-300" />
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Tickets</h3>
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Users</h3>
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

      case TABS.TICKETS:
        return (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Tickets</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">{tickets.length} total</span>
            </div>
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Resolution</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(ticket => (
                    <tr key={ticket.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
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
                          onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
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
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                        {ticket.resolution || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => deleteTicket(ticket.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
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
        );

      case TABS.USERS:
        return (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Users</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">{users.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Joined</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium text-blue-700 dark:text-blue-300">
                            {user.avatar || user.name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant={user.role === 'manager' ? 'purple' : user.role === 'support' ? 'blue' : 'gray'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => deleteUser(user.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No users found</p>
                </div>
              )}
            </div>
          </Card>
        );

      case TABS.REPORTS:
        const categoryStats = tickets.reduce((acc, t) => {
          acc[t.category || 'Uncategorized'] = (acc[t.category || 'Uncategorized'] || 0) + 1;
          return acc;
        }, {});

        const priorityStats = tickets.reduce((acc, t) => {
          acc[t.priority || 'medium'] = (acc[t.priority || 'medium'] || 0) + 1;
          return acc;
        }, {});

        const statusStats = {
          open: stats.open,
          assigned: stats.assigned,
          inProgress: stats.inProgress,
          resolved: stats.resolved,
          closed: stats.closed
        };

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tickets by Category</h3>
                <div className="space-y-3">
                  {Object.entries(categoryStats).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(count / Math.max(stats.total, 1)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                  {Object.keys(categoryStats).length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No data available</p>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tickets by Priority</h3>
                <div className="space-y-3">
                  {Object.entries(priorityStats).map(([priority, count]) => (
                    <div key={priority} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{priority}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${priority === 'high' ? 'bg-red-600' : priority === 'medium' ? 'bg-yellow-600' : 'bg-gray-600'}`}
                            style={{ width: `${(count / Math.max(stats.total, 1)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                  {Object.keys(priorityStats).length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No data available</p>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Overview</h3>
                <div className="space-y-3">
                  {Object.entries(statusStats).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{status.replace('-', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${status === 'resolved' || status === 'closed' ? 'bg-green-600' : status === 'in-progress' ? 'bg-yellow-600' : 'bg-blue-600'}`}
                            style={{ width: `${(count / Math.max(stats.total, 1)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resolution Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.resolved + stats.closed}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Resolved</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.total > 0 ? Math.round(((stats.resolved + stats.closed) / stats.total) * 100) : 0}%
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Resolution Rate</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.open + stats.assigned + stats.inProgress}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                </div>
              </div>
            </Card>
          </div>
        );

      case TABS.SETTINGS:
        return (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">System Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Clear All Tickets</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Remove all tickets from the system</p>
                </div>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (confirm('Are you sure? This will delete all tickets permanently.')) {
                      localStorage.removeItem('swift_tickets');
                      setTickets([]);
                    }
                  }}
                >
                  Clear Tickets
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Clear All Users</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Remove all users from the system</p>
                </div>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (confirm('Are you sure? This will delete all users permanently.')) {
                      localStorage.removeItem('swift_users');
                      setUsers([]);
                    }
                  }}
                >
                  Clear Users
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Reset System</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Clear all data and restore defaults</p>
                </div>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (confirm('Are you sure? This will reset the entire system.')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                >
                  Reset All
                </Button>
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  const tabs = [
    { id: TABS.OVERVIEW, label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: TABS.TICKETS, label: 'Tickets', icon: <Ticket className="w-4 h-4" /> },
    { id: TABS.USERS, label: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: TABS.REPORTS, label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: TABS.SETTINGS, label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Ticket className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">Swift</span>
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="secondary" size="sm">
                  <Home className="w-4 h-4" />
                  User View
                </Button>
              </Link>
              <Button variant="secondary" size="sm" onClick={refreshData}>
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};
