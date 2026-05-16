import React from 'react';
import PropTypes from 'prop-types';

function LoadingSpinner({ fullPage }) {
    let containerClass = 'loading-container';
    if (fullPage) {
        containerClass += ' loading-container-full-page';
    }

    return (
        <div className={containerClass}>
            <div className="spinner-border" role="status" id='loadingSpinner'>
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

LoadingSpinner.propTypes = {
    fullPage: PropTypes.bool,
};

LoadingSpinner.defaultProps = {
    fullPage: false,
};

export default LoadingSpinner;
