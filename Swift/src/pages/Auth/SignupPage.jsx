import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Ticket, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import './auth.css';

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

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const strength = passwordStrength(form.password);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return /^[A-Za-z\s]+$/.test(value) ? '' : 'Name must contain letters and spaces only.';
      case 'email':
        return /^[A-Za-z0-9@._-]+$/.test(value) ? '' : 'Email must contain only letters, numbers, @, ., _, and -.';
      case 'password':
        return /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':",.<>/?`~@]*$/.test(value) ? '' : 'Password must contain letters, numbers, and symbols only.';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameErr = validateField('name', form.name);
    const emailErr = validateField('email', form.email);
    const pwdErr = validateField('password', form.password);
    setFieldErrors({
      name: nameErr,
      email: emailErr,
      password: pwdErr,
      confirm: form.password !== form.confirm ? 'Passwords do not match.' : '',
    });

    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (nameErr || emailErr || pwdErr) {
      setError('Please fix the errors above.');
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
      await signup({ name: form.name, email: form.email, password: form.password });
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
            IT support infrastructure for modern organizations.
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </span>
              <span>99.9% platform reliability</span>
            </div>
            <div className="auth-brand-feature">
              <span className="auth-brand-feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </span>
              <span>Cross-platform access</span>
            </div>
          </div>
        </div>

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
                className={`auth-input ${fieldErrors.name ? 'auth-input--error' : ''}`}
              />
              {fieldErrors.name && (
                <span className="auth-field-error">{fieldErrors.name}</span>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="signup-email" className="auth-label">Email</label>
              <input
                id="signup-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={`auth-input ${fieldErrors.email ? 'auth-input--error' : ''}`}
              />
              {fieldErrors.email && (
                <span className="auth-field-error">{fieldErrors.email}</span>
              )}
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
                  className={`auth-input auth-input-padded ${fieldErrors.password ? 'auth-input--error' : ''}`}
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
              {fieldErrors.password && (
                <span className="auth-field-error">{fieldErrors.password}</span>
              )}
              {form.password && (
                <div className="auth-strength">
                  <div className="auth-strength-bars">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="auth-strength-bar"
                        style={{ background: i <= strength ? strengthColor[strength] : 'rgba(59,130,246,0.15)' }}
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
            <Link to="/login" className="auth-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
