const needle = require('needle');
const fs = require('fs')

const data = JSON.parse(fs.readFileSync('./bd.json', 'utf8'));
console.log(data);