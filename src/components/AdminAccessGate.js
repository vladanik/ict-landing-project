import React, { cloneElement, isValidElement, useState } from 'react';
import PropTypes from 'prop-types';

import {
  clearAdminSession,
  createAdminSession,
  isAdminPasswordConfigured,
  isAdminSessionValid,
  validateAdminPassword,
} from '../utils/adminAuth';

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isPasswordConfigured = isAdminPasswordConfigured();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!isPasswordConfigured) {
      setErrorMessage('Admin panel password hash is not configured.');
      return;
    }

    setIsSubmitting(true);

    try {
      const isValidPassword = await validateAdminPassword(password);

      if (isValidPassword) {
        createAdminSession();
        setPassword('');
        setErrorMessage('');
        onLogin();
        return;
      }

      setErrorMessage('Invalid password.');
    } catch (error) {
      console.error('Unable to validate admin password:', error);
      setErrorMessage('Unable to validate password in this browser session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h1 className='page-header'>Admin Panel</h1>
      <section className='section admin-login'>
        <h2>Admin access</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor='admin-password'>Password</label>
          {!isPasswordConfigured && (
            <div className='error-message' role='alert'>
              Admin panel password hash is not configured. Set REACT_APP_ADMIN_PANEL_PASSWORD_HASH.
            </div>
          )}
          <input
            id='admin-password'
            type='password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete='current-password'
            disabled={!isPasswordConfigured || isSubmitting}
          />
          {errorMessage && (
            <div className='form-error' role='alert'>
              {errorMessage}
            </div>
          )}
          <button type='submit' className='btn btn-primary' disabled={!isPasswordConfigured || isSubmitting}>
            {isSubmitting ? 'Checking...' : 'Unlock'}
          </button>
        </form>
      </section>
    </main>
  );
}

AdminLogin.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

function AdminAccessGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => isAdminSessionValid());

  const handleLogout = () => {
    clearAdminSession();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  if (typeof children === 'function') {
    return children({ onLogout: handleLogout });
  }

  if (isValidElement(children)) {
    return cloneElement(children, { onLogout: handleLogout });
  }

  return children;
}

AdminAccessGate.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
};

export default AdminAccessGate;
