import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/ICT_cmpl_black.png';

function Footer() {
    return (
        <footer id='footer'>
            <div className='site-container footer-inner'>
                <Link to='/' className='footer-logo' aria-label='ICT Wladyslaw Danik home'>
                    <img src={logo} alt='ICT Wladyslaw Danik logo' />
                </Link>
                <nav className='footer-links' aria-label='Footer navigation'>
                    <Link to='/'>ICT</Link>
                    <Link to='/legal'>Legal Notices</Link>
                </nav>
                <p>© 2026 ICT Władysław Danik</p>
            </div>
        </footer>
    );
}

export default Footer;
