import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

export const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getKnowledgeBase().then(setArticles);
  }, []);

  const filtered = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(article => (
          <Card key={article.id} className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{article.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{article.content}</p>
            <div className="flex gap-2">
              {article.tags.map(tag => (
                <Badge key={tag} variant="blue">{tag}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};