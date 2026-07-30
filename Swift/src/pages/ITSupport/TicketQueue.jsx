import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const TicketQueue = () => {
  const [tickets, setTickets] = useState([]);

  const loadTickets = () => {
    api.getTickets().then(setTickets);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const resolveTicket = async (id) => {
    await api.updateTicket(id, { status: 'resolved' });
    loadTickets();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Ticket Queue</h1>
      <div className="grid gap-4">
        {tickets.map(ticket => (
          <Card key={ticket.id} className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{ticket.title}</h3>
                <Badge variant={ticket.status === 'resolved' ? 'green' : ticket.status === 'in-progress' ? 'yellow' : 'gray'}>
                  {ticket.status}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-1">{ticket.description}</p>
              <div className="text-xs text-gray-400">ID: {ticket.id}</div>
            </div>
            {ticket.status !== 'resolved' && (
              <Button variant="secondary" onClick={() => resolveTicket(ticket.id)}>
                Mark Resolved
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
