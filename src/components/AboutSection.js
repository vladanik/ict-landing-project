import React from 'react';
import { formatText} from "../utils/Utils";

function AboutSection({ data }) {
    const sectionId = data[0];
    const sectionData = data[1];
    return (
        <div id={sectionId} className='section'>
            <h4>{sectionData.title}</h4>
            <p dangerouslySetInnerHTML={formatText(sectionData.paragraph)}></p>
            {sectionData.items && (
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
    );
}

export default AboutSection;