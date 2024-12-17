import React from 'react';
import '../Home.css';

function HomePage () {
    return (
        <main>
            <div className='home-container'>
                <div className="slogan">
                    <div className="depicting-quality">
                        <h2>DEP</h2>
                        <h2 className="ict-txt-diff">ICT</h2>
                        <h2>ING_QUALITY</h2>
                    </div>
                    <div className="delivering-results">
                        <h2>DELIVERING_RESULTS</h2>
                    </div>
                </div>
                <p><a href="/about">Who we are</a></p>
            </div>
        </main>
    );
}
 
export default HomePage;