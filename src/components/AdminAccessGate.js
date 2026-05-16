import React, { cloneElement, isValidElement, useState } from 'react';
import PropTypes from 'prop-types';

const ACCESS_KEY = 'ictAdminPanelAccessGranted';

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const configuredPassword = process.env.REACT_APP_ADMIN_PANEL_PASSWORD || '';
  const isPasswordConfigured = Boolean(configuredPassword);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!isPasswordConfigured) {
      setErrorMessage('Admin panel password is not configured.');
      return;
    }

    // This is only a lightweight frontend gate. Real production security must be enforced on backend.
    if (password === configuredPassword) {
      sessionStorage.setItem(ACCESS_KEY, 'true');
      onLogin();
      return;
    }

    setErrorMessage('Incorrect password.');
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
              Admin panel password is not configured. Set REACT_APP_ADMIN_PANEL_PASSWORD.
            </div>
          )}
          <input
            id='admin-password'
            type='password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete='current-password'
            disabled={!isPasswordConfigured}
          />
          {errorMessage && (
            <div className='form-error' role='alert'>
              {errorMessage}
            </div>
          )}
          <button type='submit' className='btn btn-primary' disabled={!isPasswordConfigured}>
            Unlock
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
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(ACCESS_KEY) === 'true'
  );

  const handleLogout = () => {
    sessionStorage.removeItem(ACCESS_KEY);
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
