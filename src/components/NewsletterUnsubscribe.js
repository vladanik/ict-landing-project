import React, {useEffect, useState} from 'react';
import Cookies from "js-cookie";
import LoadingSpinner from "./LoadingSpinner";

function NewsletterUnsubscribe() {
    const [message, setMessage] = useState('Please wait...');
    const [loading, setLoading] = useState(true);

    const unsubscribe = (token) => {
        fetch(
            `https://ict-backend.onrender.com/api/newsletter/unsubscribe?token=${token}`, {
                method: 'DELETE',
            }
        )
            .then((resp) => {
                if (resp && resp.ok) {
                    setMessage('Sorry to see you go. You have been unsubscribed from our newsletter.');
                    Cookies.remove('newsletterSeen');
                } else {
                    setMessage('An error occurred. Please contact support.');
                }
            })
            .catch((e) => {
                setMessage('An error occurred. Please contact support.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
            setMessage('No token found in URL. Please contact support.');
            setLoading(false);
            return;
        }
        unsubscribe(token);
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <main>
            <h1 className='page-header'>Unsubscribe</h1>
            <div className='unsubscribe-container section'>
                <span>{message}</span>
            </div>
        </main>
    );
}

export default NewsletterUnsubscribe;