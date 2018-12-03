const express = require('express');
const path = require('path');
const app = express();

const port = 8012;
var public_dir = path.join(__dirname, 'client/html');

app.get('/', (request, response) => {
    response.sendFile(path.join(public_dir, '/index.html'));
    console.log(public_dir);
});

app.get('/index.html', (request, response) => {
    response.sendFile(path.join(public_dir, '/index.html'));
    console.log(public_dir);
});

app.listen(port);
console.log('Now listening on port ' + port);
