import React, { useState } from 'react';
import emailjs from "emailjs-com";
import LoadingSpinner from "./LoadingSpinner";

function NewsletterBanner({ show, close }) {
    const [email, setEmail] = useState('');
    const [showLoading, setShowLoading] = useState(false);
    const [bannerState, setBannerState] = useState('init');
    const [errorLog, setErrorLog] = useState('');
    const [showErrorLog, setShowErrorLog] = useState(false);

    const handleNewsletterAccept = async (e) => {
        setShowLoading(true);
        e.preventDefault();

        try {
            const response = await fetch('https://ict-backend.onrender.com/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to subscribe');
            }

            const data = await response.json();
            if (!data.alreadySubscribed) {
                const token = data.unsubscribeToken;

                const templateParams = {
                    to_email: email,
                    unsubscribe_link: `https://ict-udanik.vercel.app/unsubscribe?token=${token}`,
                };

                await emailjs.send('service_p1k0wj6', 'template_56i8rp2', templateParams, 'Y5iCY22lD0Of2r2Hx');
                setBannerState('new');
            } else {
                setBannerState('exist');
            }
            setShowLoading(false);
            setTimeout(() => {
                handleNewsletterClose(bannerState);
            }, 7500);
        } catch (error) {
            setBannerState('error');
            setShowLoading(false);
            setErrorLog(JSON.stringify(error));
        }
    }

    const handleNewsletterClose = (state) => {
        setEmail('');
        close(state);
    }

    const handleNewsletterRetry = () => {
        setBannerState('init');
    }

    const initialContent = (
        <>
            <h5>Don’t Miss Out!</h5>
            <span>
                Stay in the loop about our latest updates, upcoming events, and special offers. We promise not to spam you — just relevant news you’ll actually want to read.
            </span>
            <form onSubmit={handleNewsletterAccept}>
                <label className='newsletter-email'>
                    <span>Your Email:</span>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@mail.com"
                        required
                    />
                </label>
                <div className='newsletter-buttons'>
                    <button type="submit" className='btn btn-primary'>Subscribe</button>
                    <button onClick={() => handleNewsletterClose('declined')} className='btn btn-danger'>No, thanks</button>
                </div>
            </form>
        </>
    );

    const errorContent = (
        <>
            <h5>:(</h5>
            <h5>Oops! Something Went Wrong</h5>
            <p>We couldn’t process your subscription right now. Double-check that your email address is valid and try again.</p>
            <p>If the issue persists, please contact our support team at <a href="mailto:udanik@proton.me">udanik@proton.me</a></p>
            <div className='newsletter-buttons'>
                <button onClick={handleNewsletterRetry} className='btn btn-dark'>Try Again</button>
                <button onClick={() => handleNewsletterClose('error')} className='btn btn-danger'>Close</button>
                {!showErrorLog && <button onClick={() => setShowErrorLog(true)} className='btn btn-warning'>Error log</button>}
                {showErrorLog && <span>{errorLog}</span>}
            </div>
        </>
    );

    const existContent = (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#00e613"
                 className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            <h5>You’re Already on Our List</h5>
            <p>It looks like you’re already subscribed to our mailing list. No action is required—we’ll keep you updated on everything that’s new and exciting.</p>
            <button onClick={() => handleNewsletterClose('exist')} className='btn btn-dark'>Close</button>
        </>
    );

    const newContent = (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#00e613"
                 className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            <h5>Success! You’re Subscribed</h5>
            <p>Thanks for joining our community! Keep an eye on your inbox for the latest news, product updates, and special offers.</p>
            <p>We’re glad to have you with us.</p>
            <button onClick={() => handleNewsletterClose('new')} className='btn btn-dark'>Close</button>
        </>
    );

    const getBannerState = () => {
        switch (bannerState) {
            case 'init':
                return initialContent;
            case 'error':
                return errorContent;
            case 'exist':
                return existContent;
            case 'new':
                return newContent;
            default:
                return initialContent;
        }
    }

    return (
        <div className='newsletter-banner-container banner-container'>
            {show && (
                <div className='newsletter-banner section'>
                    {getBannerState()}
                    {showLoading && <LoadingSpinner />}
                </div>
            )}
        </div>
    );
}

export default NewsletterBanner;