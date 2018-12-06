const express = require('express');
const path = require('path');
var sqlite = require('sqlite3').verbose();
var database = new sqlite.Database('ust_courses.sqlite3');
const app = express();

const port = 8012;
var public_dir = path.join(__dirname, 'course_registration/dist');

app.use(express.static(public_dir));

app.get('/departments', (request, response) => {
	let subjects;
	if(!request.query.subject){
		database.all('SELECT * FROM departments', (err, rows) => {
			response.send(rows);
		});
		return;
	}
	subjects = request.query.subject.split(',');
	let sql = `SELECT * FROM departments WHERE subject in (` + subjects.map(() => { return '?' }).join(',') + ` )`;
	database.all(sql, subjects, (err, rows) => {
		if(err){
			return console.log(err.message);
		}

		response.send(rows);
	});
});

app.get('/courses', (request, response) => {
	subject = request.query.subject;
	full_name = request.query.full_name;
	response.json(
	{
		subject: subject,
		full_name: full_name
	});
});

app.get('/sections', (request, response) => {
	subject = request.query.subject;
	full_name = request.query.full_name;
	response.json(
	{
		subject: subject,
		full_name: full_name
	});
});

app.get('/people', (request, response) => {
	university_id = request.query.university_id;
	// position = request.query.position;
	// password = request.query.password;
	// first_name = request.query.first_name;
	// last_name = request.query.last_name;
	// registered_courses = request.query.registered_courses;
	response.json(
	{
		subject: subject,
		full_name: full_name
	});
});

app.listen(port);
console.log('Now listening on port ' + port);
