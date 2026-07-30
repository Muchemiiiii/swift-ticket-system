import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Ticket, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import './auth.css';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!form.email || !form.password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { role: 'End User', email: 'alice@swift.com' },
    { role: 'IT Support', email: 'bob@swift.com' },
    { role: 'Manager', email: 'carol@swift.com' },
  ];

  return (
    <div className="auth-page">
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-logo">
            <Ticket className="auth-logo-icon" />
          </div>

          <h1 className="auth-brand-title">Swift</h1>
          <p className="auth-brand-tagline">
            Sign in to your Swift workspace and manage tickets with your team.
          </p>

          <div className="auth-steps">
            {[
              { n: '1', title: 'Secure access', desc: 'Sign in with your work account' },
              { n: '2', title: 'Stay organized', desc: 'Keep track of tickets and requests' },
              { n: '3', title: 'Collaborate faster', desc: 'Connect with support and management' },
            ].map((step) => (
              <div key={step.n} className="auth-step">
                <div className="auth-step-num">{step.n}</div>
                <div>
                  <p className="auth-step-title">{step.title}</p>
                  <p className="auth-step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Welcome back</h2>
            <p className="auth-form-subtitle">Sign in to continue to Swift.</p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="auth-field">
              <label htmlFor="login-email" className="auth-label">Email</label>
              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                className="auth-input"
              />
              {submitted && !form.email && (
                <span className="auth-field-error">Email is required</span>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="login-password" className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="auth-input auth-input-padded"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPwd((value) => !value)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {submitted && !form.password && (
                <span className="auth-field-error">Password is required</span>
              )}
            </div>

            <button id="login-submit" type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? (
                <><Loader2 size={18} className="auth-spin" /> Signing in…</>
              ) : (
                <>Sign in <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="auth-demo-hint">
            <p className="auth-demo-title">Demo accounts</p>
            <div className="auth-demo-accounts">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  className="auth-demo-chip"
                  onClick={() => {
                    setForm({ email: account.email, password: 'password' });
                    setError('');
                    setSubmitted(false);
                  }}
                >
                  <span className="auth-demo-role">{account.role}</span>
                  <span className="auth-demo-email">{account.email}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="auth-switch">
            Don’t have an account?{' '}
            <Link to="/signup" className="auth-link">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
 