import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'bootstrap';
import logoWhite from '../assets/ICT_cmpl_white.png';
import LanguageSwitcher from './LanguageSwitcher';

function Header() {
  const { t } = useTranslation('common');
  const navItems = [
    { to: '/blog', labelKey: 'navigation.blog' },
    { to: '/about', labelKey: 'navigation.about' },
    { to: '/case-studies', labelKey: 'navigation.caseStudies' },
    { to: '/services', labelKey: 'navigation.services' },
    { to: '/contact', labelKey: 'navigation.contact' },
  ];

  const closeMobileNavigation = () => {
    const collapseElement = document.getElementById('navbarSupportedContent');
    if (collapseElement?.classList.contains('show')) {
      window.bootstrap?.Collapse.getOrCreateInstance(collapseElement).hide();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" id="header">
      <div className="container site-container header-container">
        <Link className="navbar-brand" to="/" aria-label={t('brand.homeAria')}>
          <img src={logoWhite} alt={t('brand.logoAlt')} />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label={t('navigation.toggle')}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-lg-auto">
            {navItems.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to={item.to}
                >
                  {t(item.labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>
          <LanguageSwitcher onLanguageSelected={closeMobileNavigation} />
        </div>
      </div>
    </nav>
  );
}

export default Header;
