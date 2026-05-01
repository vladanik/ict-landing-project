import React from 'react';

function LoadingSpinner() {
    return (
        <div className='loading-container'>
            <div className="spinner-border" role="status" id='loadingSpinner'>
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

export default LoadingSpinner;
