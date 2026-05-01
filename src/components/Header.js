import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import 'bootstrap';
import logoWhite from '../assets/ICT_cmpl_white.png';

function Header() {
    const navItems = [
        { to: '/about', label: 'About' },
        { to: '/projects', label: 'Projects' },
        { to: '/services', label: 'Services' },
        { to: '/contact', label: 'Contact' },
    ];

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" id='header'>
            <div className="container site-container header-container">
                <Link className="navbar-brand" to="/" aria-label="ICT Wladyslaw Danik home">
                    <img src={logoWhite} alt="ICT Wladyslaw Danik logo" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-lg-auto">
                        {navItems.map(item => (
                            <li className="nav-item" key={item.to}>
                                <NavLink
                                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                                    to={item.to}
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
 
export default Header;
