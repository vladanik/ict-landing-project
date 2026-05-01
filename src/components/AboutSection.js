import React from 'react';
import PropTypes from 'prop-types';
import { formatText } from "../utils/Utils";
import {ABOUT_COMPET_ID, ABOUT_OFFER_ID} from "../utils/Constant";
import AboutOffers from "./AboutOffers";
import AboutCompetencies from "./AboutCompetencies";
import logoIcon from "../assets/ICT_cmpl_cloud.png";
import multiLing from "../assets/multilingual.png";

function AboutSection({ data }) {
    const sectionId = data[0];
    const sectionData = data[1];
    const images = {
        logo: logoIcon,
        multilingual: multiLing,
    }

    let itemsContent = null;
    if (sectionData.items) {
        if (sectionId === ABOUT_OFFER_ID) {
            itemsContent = <AboutOffers data={sectionData.items} />;
        } else if (sectionId === ABOUT_COMPET_ID) {
            itemsContent = <AboutCompetencies data={sectionData.items} />;
        } else {
            itemsContent = (
                <ul>
                    {sectionData.items.map((item, index) =>
                        <li key={item.title || index}>
                            {item.title && <b>{item.title}: </b>}
                            <span>{formatText(item.paragraph)}</span>
                        </li>
                    )}
                </ul>
            );
        }
    }

    return (
        <div id={sectionId} className='section'>
            <h2>{sectionData.title}</h2>
            {sectionData.img &&
                <div className='section-image'>
                    <img src={images[sectionData.img]} alt={sectionData.title} />
                </div>
            }
            <p className='mb-1'>{formatText(sectionData.paragraph)}</p>
            {sectionData.items && (
                <div className='mt-2'>
                    {itemsContent}
                </div>
            )}
        </div>
    );
}

AboutSection.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        img: PropTypes.string,
        paragraph: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string,
            img: PropTypes.string,
            paragraph: PropTypes.string.isRequired,
          })
        ),
      }),
    ])
  ).isRequired,
};

export default AboutSection;
