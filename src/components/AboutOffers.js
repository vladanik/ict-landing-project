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
                <article key={offerItem.title} className='about-offers-section'>
                    <h3>{offerItem.title}</h3>
                    <img src={images[offerItem.img]} alt={offerItem.title} />
                    <p>{offerItem.paragraph}</p>
                </article>
            ))}
        </div>
    );
}

export default AboutOffers;
