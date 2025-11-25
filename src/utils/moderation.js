const BAD_WORDS = [
    'abuse', 'idiot', 'stupid', 'scam', 'spam', 'fake', // Add more as needed
    // Note: In a real production app, use a comprehensive library or API
];

export const filterProfanity = (text) => {
    if (!text) return text;
    let cleanText = text;
    const regex = new RegExp(`\\b(${BAD_WORDS.join('|')})\\b`, 'gi');
    cleanText = cleanText.replace(regex, (match) => '*'.repeat(match.length));
    return cleanText;
};

export const containsProfanity = (text) => {
    if (!text) return false;
    const regex = new RegExp(`\\b(${BAD_WORDS.join('|')})\\b`, 'gi');
    return regex.test(text);
};
