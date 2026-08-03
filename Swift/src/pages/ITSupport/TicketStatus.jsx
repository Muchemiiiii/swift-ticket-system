import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Ticket, UserCheck, Zap, CheckCircle2, Lock } from 'lucide-react';

const STATUS_CONFIG = {
  open: {
    label: 'Open Tickets',
    icon: Ticket,
    color: 'blue',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-300',
    description: 'Newly submitted tickets awaiting review'
  },
  assigned: {
    label: 'Assigned Tickets',
    icon: UserCheck,
    color: 'purple',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-700 dark:text-purple-300',
    description: 'Tickets assigned to support staff'
  },
  'in-progress': {
    label: 'In Progress',
    icon: Zap,
    color: 'yellow',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    description: 'Tickets currently being worked on'
  },
  resolved: {
    label: 'Resolved',
    icon: CheckCircle2,
    color: 'green',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    textColor: 'text-green-700 dark:text-green-300',
    description: 'Tickets that have been resolved'
  },
  closed: {
    label: 'Closed Tickets',
    icon: Lock,
    color: 'gray',
    bgColor: 'bg-gray-50 dark:bg-gray-700/50',
    borderColor: 'border-gray-200 dark:border-gray-600',
    textColor: 'text-gray-700 dark:text-gray-300',
    description: 'Tickets that have been closed'
  }
};

export const TicketStatus = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = () => {
    api.getTickets().then(data => {
      setTickets(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const updateTicketStatus = async (id, newStatus) => {
    await api.updateTicket(id, { status: newStatus });
    loadTickets();
  };

  const getNextStatus = (currentStatus) => {
    const flow = {
      'open': 'assigned',
      'assigned': 'in-progress',
      'in-progress': 'resolved',
      'resolved': 'closed'
    };
    return flow[currentStatus];
  };

  const getNextStatusLabel = (currentStatus) => {
    const labels = {
      'open': 'Assign Ticket',
      'assigned': 'Start Progress',
      'in-progress': 'Mark Resolved',
      'resolved': 'Close Ticket'
    };
    return labels[currentStatus];
  };

  const groupedTickets = tickets.reduce((acc, ticket) => {
    const status = ticket.status || 'open';
    if (!acc[status]) acc[status] = [];
    acc[status].push(ticket);
    return acc;
  }, {});

  const statusOrder = ['open', 'assigned', 'in-progress', 'resolved', 'closed'];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ticket Status Update</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage and update the status of all tickets</p>
      </div>

      <div className="grid gap-6">
        {statusOrder.map(status => {
          const config = STATUS_CONFIG[status];
          const statusTickets = groupedTickets[status] || [];
          const Icon = config.icon;

          if (statusTickets.length === 0) return null;

          return (
            <Card key={status} className={`${config.bgColor} ${config.borderColor} border`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${config.textColor}`} />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${config.textColor}`}>{config.label}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{config.description}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
                  {statusTickets.length} {statusTickets.length === 1 ? 'ticket' : 'tickets'}
                </span>
              </div>

              <div className="grid gap-3">
                {statusTickets.map(ticket => (
                  <Card key={ticket.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{ticket.title}</h3>
                          <Badge variant={config.color}>{status}</Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{ticket.description}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                          {ticket.category && <span>Category: {ticket.category}</span>}
                          {ticket.priority && <span>Priority: {ticket.priority}</span>}
                          <span>Tracking: {ticket.trackingNumber || ticket.id}</span>
                          <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                        {ticket.resolution && (
                          <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                            Resolution: {ticket.resolution}
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        {getNextStatus(status) && (
                          <Button
                            size="sm"
                            onClick={() => updateTicketStatus(ticket.id, getNextStatus(status))}
                          >
                            {getNextStatusLabel(status)}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {tickets.length === 0 && (
        <Card className="text-center py-16">
          <Ticket className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tickets found</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">There are no tickets in the system yet.</p>
        </Card>
      )}
    </div>
  );
};
