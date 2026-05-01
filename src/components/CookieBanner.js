import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {COOKIE_BANNER_CLOSE, COOKIE_BANNER_MESSAGE} from "../utils/Constant";

function CookieBanner({ show, close }) {
    return (
        <div className='cookie-banner-container'>
            {show && (
                <div className='cookie-banner'>
                    <p>{COOKIE_BANNER_MESSAGE} <Link to='/legal'>Cookie Policy</Link>.</p>
                    <button className='btn btn-success' onClick={close}>{COOKIE_BANNER_CLOSE}</button>
                </div>
                )}
        </div>
    );
}

CookieBanner.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
};

export default CookieBanner;
