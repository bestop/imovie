process.env.PATH = 'C:\\Program Files\\nodejs;' + process.env.PATH;

const nextBin = require('path').join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');
require(nextBin);
