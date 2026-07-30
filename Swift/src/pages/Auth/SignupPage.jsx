import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Ticket, Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';
import './auth.css';

const ROLES = [
  { value: 'user',    label: 'End User',     desc: 'Submit and track tickets'     },
  { value: 'support', label: 'IT Support',   desc: 'Manage and resolve tickets'   },
  { value: 'manager', label: 'Manager',      desc: 'Reports and team oversight'   },
];

const passwordStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8)          score++;
  if (/[A-Z]/.test(pwd))        score++;
  if (/[0-9]/.test(pwd))        score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score; // 0‑4
};

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];

export const SignupPage = () => {
  const { signup } = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '', role: 'user' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const strength = passwordStrength(form.password);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signup({ name: form.name, email: form.email, password: form.password, role: form.role });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel — branding */}
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-logo">
            <Ticket className="auth-logo-icon" />
          </div>
          <h1 className="auth-brand-title">Swift</h1>
          <p className="auth-brand-tagline">
            Join your team on Swift and experience effortless IT support management.
          </p>

          <div className="auth-steps">
            {[
              { n: '1', title: 'Create your account', desc: 'Takes less than a minute' },
              { n: '2', title: 'Choose your role',    desc: 'User, Support, or Manager' },
              { n: '3', title: 'Start collaborating', desc: 'Manage tickets right away'  },
            ].map(s => (
              <div key={s.n} className="auth-step">
                <div className="auth-step-num">{s.n}</div>
                <div>
                  <p className="auth-step-title">{s.title}</p>
                  <p className="auth-step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
      </div>

      {/* Right panel — form */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Create an account</h2>
            <p className="auth-form-subtitle">Get started with Swift today</p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="auth-field">
              <label htmlFor="signup-name" className="auth-label">Full name</label>
              <input
                id="signup-name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Jane Smith"
                value={form.name}
                onChange={handleChange}
                className="auth-input"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signup-email" className="auth-label">Work email</label>
              <input
                id="signup-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="jane@company.com"
                value={form.email}
                onChange={handleChange}
                className="auth-input"
              />
            </div>

            {/* Role selector */}
            <div className="auth-field">
              <label className="auth-label">I am a…</label>
              <div className="auth-role-grid">
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, role: r.value }))}
                    className={`auth-role-card ${form.role === r.value ? 'auth-role-card--active' : ''}`}
                  >
                    {form.role === r.value && (
                      <span className="auth-role-check"><Check size={12} /></span>
                    )}
                    <span className="auth-role-label">{r.label}</span>
                    <span className="auth-role-desc">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="signup-password" className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <input
                  id="signup-password"
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="auth-input auth-input-padded"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPwd(v => !v)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.password && (
                <div className="auth-strength">
                  <div className="auth-strength-bars">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="auth-strength-bar"
                        style={{ background: i <= strength ? strengthColor[strength] : '#e5e7eb' }}
                      />
                    ))}
                  </div>
                  <span className="auth-strength-label" style={{ color: strengthColor[strength] }}>
                    {strengthLabel[strength]}
                  </span>
                </div>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="signup-confirm" className="auth-label">Confirm password</label>
              <input
                id="signup-confirm"
                type={showPwd ? 'text' : 'password'}
                name="confirm"
                autoComplete="new-password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={handleChange}
                className={`auth-input ${form.confirm && form.confirm !== form.password ? 'auth-input--error' : ''}`}
              />
              {form.confirm && form.confirm !== form.password && (
                <span className="auth-field-error">Passwords don't match</span>
              )}
            </div>

            <button id="signup-submit" type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? (
                <><Loader2 size={18} className="auth-spin" /> Creating account…</>
              ) : (
                <>Create account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
