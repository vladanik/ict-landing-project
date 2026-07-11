import React, { cloneElement, isValidElement, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import {
  clearAdminSession,
  createAdminSession,
  isAdminPasswordConfigured,
  isAdminSessionValid,
  validateAdminPassword,
} from '../utils/adminAuth';

function AdminLogin({ onLogin }) {
  const { t } = useTranslation('admin');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isPasswordConfigured = isAdminPasswordConfigured();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!isPasswordConfigured) {
      setErrorMessage(t('login.missingHash'));
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

      setErrorMessage(t('login.invalidPassword'));
    } catch (error) {
      console.error('Unable to validate admin password:', error);
      setErrorMessage(t('login.validationError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h1 className="page-header">{t('common.panelTitle')}</h1>
      <section className="section admin-login">
        <h2>{t('login.title')}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-password">{t('login.password')}</label>
          {!isPasswordConfigured && (
            <div className="error-message" role="alert">
              {t('login.missingHashDetails')}
            </div>
          )}
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            disabled={!isPasswordConfigured || isSubmitting}
          />
          {errorMessage && (
            <div className="form-error" role="alert">
              {errorMessage}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isPasswordConfigured || isSubmitting}
          >
            {isSubmitting ? t('login.checking') : t('login.unlock')}
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
