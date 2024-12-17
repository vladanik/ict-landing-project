import React from 'react';
import { formatText } from "../utils/Utils";
import {ABOUT_COMPET_ID, ABOUT_OFFER_ID} from "../utils/Constant";
import AboutOffers from "./AboutOffers";
import AboutCompetencies from "./AboutCompetencies";
import logoIcon from "../assets/logo-icon.png";
import multiLing from "../assets/multilingual.png";

function AboutSection({ data }) {
    const sectionId = data[0];
    const sectionData = data[1];
    const images = {
        logo: logoIcon,
        multilingual: multiLing,
    }

    return (
        <div id={sectionId} className='section'>
            <h4>{sectionData.title}</h4>
            {sectionData.img &&
                <div className='section-image'>
                    <img src={images[sectionData.img]} alt={sectionData.title} />
                </div>
            }
            <p dangerouslySetInnerHTML={formatText(sectionData.paragraph)} className='mb-1'></p>
            {sectionData.items && (
                <div className='mt-2'>
                    {sectionId === ABOUT_OFFER_ID ? (
                        <AboutOffers data={sectionData.items} />
                    ) : sectionId === ABOUT_COMPET_ID ? (
                        <AboutCompetencies data={sectionData.items} />
                    ) : (
                        <ul>
                            {sectionData.items.map((item, index) =>
                                <li key={index}>
                                    {item.title && <b>{item.title}: </b>}
                                    <span dangerouslySetInnerHTML={formatText(item.paragraph)}></span>
                                </li>
                            )}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default AboutSection;