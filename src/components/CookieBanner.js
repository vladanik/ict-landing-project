import React from 'react';
import {COOKIE_BANNER_CLOSE, COOKIE_BANNER_MESSAGE} from "../utils/Constant";
import {formatText} from "../utils/Utils";

function CookieBanner({ show, close }) {
    return (
        <div className='cookie-banner-container banner-container'>
            {show && (
                <div className='cookie-banner section'>
                    <p dangerouslySetInnerHTML={formatText(COOKIE_BANNER_MESSAGE)}></p>
                    <button className='btn btn-success' onClick={close}>{COOKIE_BANNER_CLOSE}</button>
                </div>
                )}
        </div>
    );
}

export default CookieBanner;