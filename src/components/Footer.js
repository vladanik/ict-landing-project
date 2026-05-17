import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import logo from '../assets/ICT_cmpl_black.png';

function Footer({ contact }) {
    const socialLinks = [
        { key: 'linkedin', label: 'LinkedIn' },
        { key: 'github', label: 'GitHub' },
    ].filter((item) => contact?.[item.key]?.link);

    return (
        <footer id='footer'>
            <div className='site-container footer-inner'>
                <div className='footer-brand'>
                    <Link to='/' className='footer-logo' aria-label='ICT Services home'>
                        <img src={logo} alt='ICT Services cloud logo' loading='lazy' />
                    </Link>
                    <p>
                        ICT Services provides Salesforce and Full-Stack development for maintainable business
                        applications, integrations and internal tools.
                    </p>
                </div>
                <nav className='footer-links' aria-label='Footer navigation'>
                    <Link to='/'>Home</Link>
                    <Link to='/services'>Services</Link>
                    <Link to='/about'>About</Link>
                    <Link to='/case-studies'>Case Studies</Link>
                    <Link to='/blog'>Blog</Link>
                    <Link to='/contact'>Contact</Link>
                    <Link to='/legal'>Legal Notices</Link>
                </nav>
                {socialLinks.length > 0 && (
                    <nav className='footer-social-links' aria-label='Social links'>
                        {socialLinks.map((item) => (
                            <a href={contact[item.key].link} target='_blank' rel='noreferrer' key={item.key}>
                                {item.label}
                            </a>
                        ))}
                    </nav>
                )}
                <p className='footer-copyright'>Copyright 2026 ICT Wladyslaw Danik</p>
            </div>
        </footer>
    );
}

Footer.propTypes = {
    contact: PropTypes.object,
};

Footer.defaultProps = {
    contact: {},
};

export default Footer;
