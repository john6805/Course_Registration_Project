const express = require('express');
const path = require('path');
const app = express();

const port = 8012;
var public_dir = path.join(__dirname, 'course_registration/dist');

app.use(express.static(public_dir));

app.get('/departments', (request, response) => {
	subject = request.query.subject;
	full_name = request.query.full_name;
	response.json(
	{
		subject: subject,
		full_name: full_name
	});
});

app.listen(port);
console.log('Now listening on port ' + port);
