import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { FileText, Search, Shield, Zap, Eye, Lock, TrendingUp, Clock, CheckCircle2, AlertCircle, ChevronRight, BarChart3, Activity } from 'lucide-react';

export const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });

  useEffect(() => {
    api.getTickets().then(setTickets);
  }, []);

  useEffect(() => {
    if (tickets.length > 0) {
      setStats({
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in-progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
      });
    }
  }, [tickets]);

  const categories = [
    { name: 'Examination Issues', icon: '📝', desc: 'Marks, grades, results, and exam scheduling.' },
    { name: 'Timetable & Scheduling', icon: '📅', desc: 'Class schedules, clashes, and allocations.' },
    { name: 'Lecturer Complaints', icon: '👨‍🏫', desc: 'Concerns about teaching conduct or communication.' },
    { name: 'Library Services', icon: '📚', desc: 'Books, resources, and library systems.' },
    { name: 'Student Health Insurance', icon: '🏥', desc: 'Medical cover, claims, and referrals.' },
    { name: 'Food Quality & Hygiene', icon: '🍽️', desc: 'Meals, hygiene, and ingredient concerns.' },
    { name: 'Accommodation & Housing', icon: '🏠', desc: 'Hostel, dormitory, and housing concerns.' },
    { name: 'IT & Network Services', icon: '💻', desc: 'WiFi, labs, systems, and technical support.' },
    { name: 'Finance & Fees', icon: '💰', desc: 'Fees, payments, and financial aid.' },
    { name: 'Transport & Parking', icon: '🚗', desc: 'Shuttle services, parking, and access.' },
    { name: 'Security & Safety', icon: '🛡️', desc: 'Campus security, incidents, and safety.' },
    { name: 'Sports & Recreation', icon: '⚽', desc: 'Facilities, equipment, and activities.' },
  ];

  const steps = [
    { num: '01', title: 'Submit', desc: 'Fill in the short form. Attach files if you need to.' },
    { num: '02', title: 'We route it', desc: 'Your case goes to the right department automatically.' },
    { num: '03', title: 'Track & resolve', desc: 'Check status anytime with your tracking number.' },
  ];

  const statCards = [
    { label: 'Total Reports', value: stats.total, icon: BarChart3, color: 'bg-blue-500', textColor: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/30' },
    { label: 'Open', value: stats.open, icon: AlertCircle, color: 'bg-yellow-500', textColor: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-900/30' },
    { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'bg-purple-500', textColor: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-900/30' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/30' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 dark:from-blue-900 dark:via-blue-800 dark:to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 text-sm">
            <Shield className="w-4 h-4" />
            <span>Anonymous option available</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Report campus issues,<br />
            <span className="text-blue-200 dark:text-blue-300">get real answers.</span>
          </h1>
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Submit academic or non-academic concerns straight to the right university department. Track your case from submission to resolution — no login needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create" className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              <FileText className="w-5 h-5" />
              Submit an issue
            </Link>
            <Link to="/track" className="inline-flex items-center justify-center gap-2 bg-blue-800/50 dark:bg-blue-900/60 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-800/70 transition-all border border-blue-500/50 hover:-translate-y-0.5">
              <Search className="w-5 h-5" />
              Track my issue
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map(stat => (
            <Card key={stat.label} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </div>
                <div className={`text-3xl font-bold ${stat.textColor} mb-1`}>{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why use our system?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">A simple, transparent way to get your campus issues resolved.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group bg-white dark:bg-gray-800">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Auto-routed</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Sent to the correct department instantly. No more guessing where to send your concerns.</p>
            </div>
          </Card>
          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group bg-white dark:bg-gray-800">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Transparent tracking</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Live status from submitted to closed. Watch your issue progress in real-time.</p>
            </div>
          </Card>
          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group bg-white dark:bg-gray-800">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Secure</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Your data is handled with care. Optional anonymous submissions available.</p>
            </div>
          </Card>
        </div>
      </section>

      {/* What can you report? */}
      <section className="bg-white dark:bg-gray-800 py-20 transition-colors">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">What can you report?</h2>
              <p className="text-gray-600 dark:text-gray-300">Twelve categories across academic and non-academic services.</p>
            </div>
            <Link to="/create" className="hidden md:inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold group">
              See all
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link key={cat.name} to="/create" className="group">
                <Card className="h-full hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700 group-hover:border-blue-200 dark:group-hover:border-blue-700 group-hover:-translate-y-1 bg-white dark:bg-gray-800">
                  <div className="p-5">
                    <div className="text-3xl mb-3">{cat.icon}</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors mb-1">{cat.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{cat.desc}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-6 md:hidden text-center">
            <Link to="/create" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
              See all categories
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-800 transition-colors">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-16">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={step.num} className="relative">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg shadow-blue-500/30">
                      {step.num}
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="hidden md:block absolute top-10 left-[60%] w-[80%]">
                        <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-600"></div>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Issues */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Recent Issues</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Activity className="w-4 h-4" />
            <span>Live updates</span>
          </div>
        </div>
        <div className="grid gap-4">
          {tickets.length === 0 ? (
            <Card className="text-center py-16 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2 text-gray-900 dark:text-white">No issues reported yet</p>
              <p className="text-sm mb-6">Be the first to submit an issue and help improve our campus.</p>
              <Link to="/create" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Submit an Issue
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Card>
          ) : (
            tickets.slice(0, 10).map(ticket => (
              <Card key={ticket.id} className="hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700 group bg-white dark:bg-gray-800">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{ticket.title}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">#{ticket.trackingNumber || ticket.id}</span>
                            {ticket.category && <span className="text-xs text-gray-500 dark:text-gray-400">•</span>}
                            {ticket.category && <span className="text-xs text-gray-500 dark:text-gray-400">{ticket.category}</span>}
                          </div>
                        </div>
                    </div>
                    <Badge variant={ticket.status === 'resolved' ? 'green' : ticket.status === 'in-progress' ? 'yellow' : 'gray'} className="text-xs">
                      {ticket.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{ticket.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                    {ticket.location && (
                      <span className="inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
                        {ticket.location}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white py-20 transition-colors">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to make a difference?</h2>
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-10 max-w-2xl mx-auto">Your feedback helps us create a better campus environment for everyone.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create" className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              <FileText className="w-5 h-5" />
              Submit an issue
            </Link>
            <Link to="/track" className="inline-flex items-center justify-center gap-2 bg-blue-800/50 dark:bg-blue-900/60 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-800/70 transition-all border border-blue-500/50 hover:-translate-y-0.5">
              <Search className="w-5 h-5" />
              Track my issue
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">Swift</span>
              </div>
              <p className="text-gray-400 text-sm">Fast, Smart, Support.<br />Assisting Every User, Every Time.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link to="/create" className="block hover:text-white transition-colors">Submit an Issue</Link>
                <Link to="/track" className="block hover:text-white transition-colors">Track Issue</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-700 pt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Swift Ticket System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};