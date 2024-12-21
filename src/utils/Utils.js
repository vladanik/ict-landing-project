export const formatText = (text) => ({
    __html: text
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\\\\/g, '<br />')
});
