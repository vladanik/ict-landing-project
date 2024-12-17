import React from 'react';
import img1 from '../assets/offers1.png';
import img2 from '../assets/offers2.png';
import img3 from '../assets/offers3.png';
import img4 from '../assets/offers4.png';
import img5 from '../assets/offers5.png';

function AboutOffers({ data }) {
    const images = {
        offers1: img1,
        offers2: img2,
        offers3: img3,
        offers4: img4,
        offers5: img5,
    }

    return (
        <div className='about-offers'>
            {data.map(offerItem => (
                <div key={offerItem.title} className='section about-offers-section'>
                    <h5>{offerItem.title}</h5>
                    <img src={images[offerItem.img]} alt={offerItem.title} />
                    <p>{offerItem.paragraph}</p>
                </div>
            ))}
        </div>
    );
}

export default AboutOffers;