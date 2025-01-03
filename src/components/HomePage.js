import React, {useEffect, useState} from 'react';
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

        <CookieBanner show={showCookieBanner} close={() => acceptCookies()} />
    </>);
}
 
export default HomePage;