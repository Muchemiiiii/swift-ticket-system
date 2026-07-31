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

  return (
    <div className="auth-page">
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-logo">
            <Ticket className="auth-logo-icon" />
          </div>

          <h1 className="auth-brand-title">Swift</h1>
          <p className="auth-brand-tagline">
            The IT support platform your team actually uses. Faster resolution, zero friction.
          </p>

          <div className="auth-brand-features">
            <div className="auth-brand-feature">
              <span className="auth-brand-feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </span>
              <span>Enterprise-grade security</span>
            </div>
            <div className="auth-brand-feature">
              <span className="auth-brand-feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </span>
              <span>Real-time ticket tracking</span>
            </div>
            <div className="auth-brand-feature">
              <span className="auth-brand-feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </span>
              <span>Built for modern teams</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Login</h2>
            <p className="auth-form-subtitle">Enter your credentials to access your workspace.</p>
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
                <>Login <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Don’t have an account?{' '}
            <Link to="/signup" className="auth-link">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
