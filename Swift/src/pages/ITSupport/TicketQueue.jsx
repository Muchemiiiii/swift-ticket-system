import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const STATUS_FLOW = {
  'open': { next: 'assigned', label: 'Assign Ticket', variant: 'primary' },
  'assigned': { next: 'in-progress', label: 'Start Progress', variant: 'primary' },
  'in-progress': { next: 'resolved', label: 'Mark Resolved', variant: 'secondary' },
  'resolved': { next: 'closed', label: 'Close Ticket', variant: 'secondary' },
};

export const TicketQueue = () => {
  const [tickets, setTickets] = useState([]);

  const loadTickets = () => {
    api.getTickets().then(setTickets);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const updateTicketStatus = async (id, newStatus) => {
    await api.updateTicket(id, { status: newStatus });
    loadTickets();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Incident Queue</h1>
      <div className="grid gap-4">
        {tickets.map(ticket => {
          const nextAction = STATUS_FLOW[ticket.status];
          return (
            <Card key={ticket.id} className="flex justify-between items-center bg-white dark:bg-gray-800">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{ticket.title}</h3>
                  <Badge variant={ticket.status === 'resolved' ? 'green' : ticket.status === 'in-progress' ? 'yellow' : ticket.status === 'assigned' ? 'purple' : 'gray'}>
                    {ticket.status}
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">{ticket.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                  {ticket.category && <span>Category: {ticket.category}</span>}
                  {ticket.priority && <span>Priority: {ticket.priority}</span>}
                  <span>Tracking: {ticket.trackingNumber || ticket.id}</span>
                  {ticket.createdAt && (
                    <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {nextAction && (
                  <Button
                    variant={nextAction.variant}
                    size="sm"
                    onClick={() => updateTicketStatus(ticket.id, nextAction.next)}
                  >
                    {nextAction.label}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
