const fs = require('fs');
const { generateAllHTML } = require('./generate-ideas-html.js');

const data = JSON.parse(fs.readFileSync('data/reddit-ideas-2026-02-13.json', 'utf8'));

console.log('Testing generateAllHTML...');
console.log('Data length:', data.length);

try {
    const result = generateAllHTML(data, 'ideas');
    console.log('Result type:', typeof result);
    console.log('Result keys:', Object.keys(result));
    console.log('Result:', result);
    console.log('Success!');
} catch(e) {
    console.error('Error:', e.message);
    console.error('Stack:', e.stack);
}
