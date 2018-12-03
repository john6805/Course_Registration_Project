const express = require('express');
const path = require('path');
const app = express();

const port = 8012;
var public_dir = path.join(__dirname, 'client');

app.use(express.static(public_dir));


app.listen(port);
console.log('Now listening on port ' + port);
