import React, { Component, useEffect, useState } from 'react';
import '../Home.css' 

function HomePage () {
    const [typedText, setTypedText] = useState('');
    const text = 'I CT';
    const cursor = '_';

    useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            setTypedText(prevTypedText => prevTypedText + text[index]);
            index++;
            if (index === text.length - 1) {
                clearInterval(intervalId);
                setTimeout(() => {
                    setTypedText(prevTypedText => prevTypedText + '');
                }, 500);
            }
        }, 500);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <main>
            <div className='home-container'>
                <h1>Welcome to</h1>
                <h2>{typedText}<span className='cursor'>&#95;</span></h2>
                <p>
                    <span>Use the menu to get on the page you want.</span>
                    <a href='#contactForm'>Contact Form</a>
                </p>
            </div>
        </main>
    );
}
 
export default HomePage;