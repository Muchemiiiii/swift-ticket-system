import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';

export const Reports = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    api.getTickets().then(setTickets);
  }, []);

  const total = tickets.length;
  const resolved = tickets.filter(t => t.status === 'resolved').length;
  const open = tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Reports & Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Total Tickets</h3>
          <div className="text-4xl font-bold text-gray-900">{total}</div>
        </Card>
        <Card className="text-center">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Open / In Progress</h3>
          <div className="text-4xl font-bold text-blue-600">{open}</div>
        </Card>
        <Card className="text-center">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Resolved</h3>
          <div className="text-4xl font-bold text-green-600">{resolved}</div>
        </Card>
      </div>
    </div>
  );
};
