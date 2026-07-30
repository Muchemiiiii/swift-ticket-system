import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';

export const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    api.getTickets().then(allTickets => {
      setTickets(allTickets.filter(t => t.creatorId === currentUser.id));
    });
  }, [currentUser]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
        <Link to="/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Create New Ticket
        </Link>
      </div>

      <div className="grid gap-4">
        {tickets.length === 0 ? (
          <Card className="text-center py-12 text-gray-500">You haven't submitted any tickets yet.</Card>
        ) : (
          tickets.map(ticket => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{ticket.title}</h3>
                <Badge variant={ticket.status === 'resolved' ? 'green' : ticket.status === 'in-progress' ? 'yellow' : 'gray'}>
                  {ticket.status}
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">{ticket.description}</p>
              <div className="text-sm text-gray-400">
                Created: {new Date(ticket.createdAt).toLocaleDateString()}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
