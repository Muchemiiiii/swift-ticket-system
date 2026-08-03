import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Input, TextArea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Shield, CheckCircle2, Copy, Check } from 'lucide-react';

const CATEGORIES = [
  'Examination Issues',
  'Timetable & Scheduling',
  'Lecturer Complaints',
  'Library Services',
  'Student Health Insurance',
  'Food Quality & Hygiene',
  'Accommodation & Housing',
  'IT & Network Services',
  'Finance & Fees',
  'Transport & Parking',
  'Security & Safety',
  'Sports & Recreation',
];

export const CreateTicket = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tn = `STS-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
    setTrackingNumber(tn);
  }, []);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await api.createTicket({
      title: trackingNumber,
      description,
      category,
      trackingNumber,
      priority: 'medium',
    });
    setTrackingNumber(result.trackingNumber || result.id);
    setSubmitted(true);
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Card className="text-center py-12 bg-white dark:bg-gray-800">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Report Submitted Successfully</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Your anonymous report has been submitted. Save your tracking number to check the status later.</p>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 max-w-sm mx-auto">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Your Tracking Number</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white break-all">{trackingNumber}</p>
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300 flex-shrink-0"
                aria-label="Copy tracking number"
              >
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/track" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Ticket Status Update
            </Link>
            <Button variant="secondary" onClick={() => { setSubmitted(false); setStep(1); }} className="w-full sm:w-auto">
              Submit another report
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Incident Details' },
    { num: 2, label: 'Media & Description' },
    { num: 3, label: 'Review & Submit' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Report an Incident</h1>

      <div className="flex items-center justify-between mb-8">
        {steps.map((s, idx) => (
          <React.Fragment key={s.num}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s.num ? 'bg-blue-600 text-white' : step > s.num ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}>
                {s.num}
              </div>
              <span className={`ml-2 text-sm ${step === s.num ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${step > s.num ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={true}
                      disabled
                      className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:bg-gray-700"
                    />
                    <label htmlFor="anonymous" className="text-sm text-blue-900 dark:text-blue-100 font-medium cursor-pointer">
                      Submit anonymously
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tracking Number</label>
                    <div className="relative">
                      <Input
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        required
                        maxLength={999}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className="absolute right-2 top-[38px] p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-500 dark:text-gray-400"
                        aria-label="Copy tracking number"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This is your unique tracking number. Copy it to check your issue status later.</p>
                  </div>

                  <Button type="button" onClick={nextStep} className="w-full">
                    Next
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <TextArea
                    label="Description"
                    placeholder="Provide more context and steps to reproduce..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Attach photos or videos (optional)</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Drag and drop files here, or click to browse</p>
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="secondary" onClick={prevStep} className="w-full">
                      Back
                    </Button>
                    <Button type="button" onClick={nextStep} className="w-full">
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Review Your Report</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                        Anonymous Report
                      </span>
                      {category && <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">{category}</span>}
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tracking Number</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">{trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white whitespace-pre-wrap">{description}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="secondary" onClick={prevStep} className="w-full">
                      Back
                    </Button>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Submitting...' : 'Submit Report'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-medium mb-4">
              <Shield className="w-5 h-5" />
              <span>Anonymous Reporting</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Your identity is protected. No personal information is collected or stored. Your tracking number is the only way to identify your report.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};