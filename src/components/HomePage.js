import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import '../Home.css';
import Cookies from "js-cookie";
import CookieBanner from "./CookieBanner";

function HomePage () {
    const [showCookieBanner, setShowCookieBanner] = useState(false);

    const checkCookieBanner = () => {
        const consent = Cookies.get('cookieBannerSeen');
        if (!consent) {
            setShowCookieBanner(true);
        }
    }

    const acceptCookies = () => {
        Cookies.set('cookieBannerSeen', true, { expires: 365 });
        setShowCookieBanner(false);
    }

    useEffect(() => {
        checkCookieBanner();
    }, []);

    return (<>
        <main>
            <section className='home-container site-container' aria-labelledby='home-slogan'>
                <div className="slogan" id='home-slogan'>
                    <div className="depicting-quality">
                        <h2>DEP</h2>
                        <h2 className="ict-txt-diff">ICT</h2>
                        <h2>ING_QUALITY</h2>
                    </div>
                    <div className="delivering-results">
                        <h2>DELIVERING_RESULTS</h2>
                    </div>
                </div>
                <p className='home-value-prop'>Salesforce, React and backend development for practical business solutions.</p>
                <div className='home-actions'>
                    <Link className='btn btn-primary' to='/services'>View Services</Link>
                    <Link className='btn btn-outline-light' to='/contact'>Contact Me</Link>
                </div>
                <Link className='home-secondary-link' to='/about'>Who we are</Link>
            </section>
        </main>

        <CookieBanner show={showCookieBanner} close={() => acceptCookies()} />
    </>);
}
 
export default HomePage;
