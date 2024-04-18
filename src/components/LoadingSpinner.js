import React, { Component } from 'react';

class LoadingSpinner extends Component {
    state = {  } 
    render() { 
        return (
            <div className='loading-container'>
                <div class="spinner-border" role="status" id='loadingSpinner'>
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            
        );
    }
}
 
export default LoadingSpinner;