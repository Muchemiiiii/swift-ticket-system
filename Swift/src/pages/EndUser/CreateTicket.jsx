import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Input, TextArea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Lightbulb } from 'lucide-react';

export const CreateTicket = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleTitleChange = async (e) => {
    const val = e.target.value;
    setTitle(val);
    
    if (val.length > 5) {
      const kb = await api.getKnowledgeBase();
      const matches = kb.filter(article => 
        article.title.toLowerCase().includes(val.toLowerCase()) || 
        article.tags.some(tag => val.toLowerCase().includes(tag))
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.createTicket({ title, description, creatorId: currentUser.id, priority: 'medium' });
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Submit a New Support Request</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input 
                label="Issue Summary" 
                placeholder="Briefly describe the issue..."
                value={title}
                onChange={handleTitleChange}
                required
              />
              <TextArea 
                label="Details"
                placeholder="Provide more context and steps to reproduce..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </Button>
            </form>
          </Card>
        </div>

        <div className="md:col-span-1">
          {suggestions.length > 0 ? (
            <Card className="bg-blue-50 border-blue-100">
              <div className="flex items-center gap-2 text-blue-800 font-medium mb-4">
                <Lightbulb className="w-5 h-5" />
                <span>Suggested Solutions</span>
              </div>
              <div className="space-y-4">
                {suggestions.map(s => (
                  <div key={s.id}>
                    <h4 className="font-medium text-sm text-gray-900">{s.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{s.content}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <div className="text-sm text-gray-500 text-center py-8">
              Start typing your issue to see relevant guides from our knowledge base.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
