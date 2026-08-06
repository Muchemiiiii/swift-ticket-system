import React from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const clearTickets = () => {
    if (confirm('Are you sure? This will delete all tickets permanently.')) {
      api.clearTickets();
      window.location.reload();
    }
  };

  const clearUsers = () => {
    if (confirm('Are you sure? This will delete all users permanently.')) {
      api.clearUsers();
      window.location.reload();
    }
  };

  const resetSystem = () => {
    if (confirm('Are you sure? This will reset the entire system.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">System management and maintenance</p>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-6">
          <SettingsIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Settings</h3>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Clear All Tickets</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Remove all tickets from the system</p>
            </div>
            <Button variant="danger" onClick={clearTickets}>
              Clear Tickets
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Clear All Users</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Remove all users from the system</p>
            </div>
            <Button variant="danger" onClick={clearUsers}>
              Clear Users
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Reset System</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Clear all data and restore defaults</p>
            </div>
            <Button variant="danger" onClick={resetSystem}>
              Reset All
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
