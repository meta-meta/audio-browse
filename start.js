const path = require('path');
const Max = require('max-api');

// This will be printed directly to the Max console
//Max.post(`Loaded the ${path.basename(__filename)} script`);


//Max.post('yo yo yo');

//Max.post(path.resolve('node_modules/react-scripts/scripts/start.js'));

process.env.BROWSER = 'none';

require(path.resolve('node_modules/react-scripts/scripts/start.js'));
