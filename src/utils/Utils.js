import React from 'react';

export const formatText = (text = '') => 
    text.split(/(\\\\|\*\*.*?\*\*)/g).map((part, index) => {
        if (part === '\\\\') {
            return <br key={index} />;
        }
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return part;
    });

