const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(filepath, 'utf-8');
let data = '';
stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log('End', data));