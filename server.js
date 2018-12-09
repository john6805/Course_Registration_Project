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
	let subjects;
	let course_number;
	let crn;
	if(!request.query.subject){
		//must provide at least one subject
		return;
	}
	subjects = request.query.subject.split(',');
	course_number = request.query.course_number;
	crn = request.query.crn;

	let sql;
	if(crn != null)
	{
		sql = 	`SELECT 
					sections.subject, 
					sections.course_number, 
					sections.section_number, 
					sections.building, 
					sections.room, 
					sections.professors, 
					sections.times, 
					sections.capacity, 
					sections.registered, 
					courses.credits, 
					courses.name, 
					courses.description 
				FROM 
					sections 
				INNER JOIN 
					courses 
				ON 
					sections.subject = courses.subject AND sections.course_number = courses.course_number 
				WHERE sections.crn = \'` + crn + `\'\;`;
	}
	else if(course_number != null)
	{
		sql = `SELECT * FROM courses WHERE subject in (` + subjects.map(() => { return '?' }).join(',') + ` )
				AND course_number = \'` + course_number + `\'\;`;
	}
	
	sql = `SELECT * FROM courses WHERE subject in (` + subjects.map(() => { return '?' }).join(',') + ` )`;
	database.all(sql, subjects, (err, rows) => {
		if(err){
			return console.log(err.message);
		}

		response.send(rows);
	});
});

// app.get('/courses', (request, response) => {
// 	subject = request.query.subject;
// 	full_name = request.query.full_name;
// 	response.json(
// 	{
// 		subject: subject,
// 		full_name: full_name
// 	});
// });

// app.get('/sections', (request, response) => {
// 	subject = request.query.subject;
// 	full_name = request.query.full_name;
// 	response.json(
// 	{
// 		subject: subject,
// 		full_name: full_name
// 	});
// });

app.post('/check_user', (request, response) => {
	university_id = request.body.university_id;
	password = request.body.password;

	let sql = `SELECT * FROM people WHERE university_id = ?` ;
	database.get(sql, [university_id], (err, row) => {
		if(err){
			return console.log(err.message);
		}

		if(row.password === password)
		{
			response.json({
				auth: true,
				user_info: row
			});
		}
		else 
		{
			response.json({
				auth:false
			});
		}
	});
});

app.post('/create_user', (request, response) => {
	university_id = request.body.university_id;
	password = request.body.password;
	position = request.body.position;
	first_name = request.body.first_name;
	last_name = request.body.last_name;

	let sql = `INSERT INTO people(university_id, password, position, first_name, last_name) VALUES(?, ?, ?, ?, ?)`;
	database.run(sql, [university_id, password, position, first_name, last_name], (err, row) => {
		if(err){
			return console.log(err.message);
		}
	});
});
app.listen(port);
console.log('Now listening on port ' + port);
