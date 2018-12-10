const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var sqlite = require('sqlite3').verbose();
var database = new sqlite.Database('ust_courses.sqlite3');
const app = express();

const port = 8012;
var public_dir = path.join(__dirname, 'course_registration/dist');

app.use(express.static(public_dir));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.post('/courses', (request, response) => {
	let subjects;
	let course_number;
	let crn;
	console.log(request.body);
	if(!request.body.subjects){
		//must provide at least one subject
		return;
	}
	subjects = request.body.subjects;
	course_number = request.body.course_number;
	crn = request.body.crn;

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
				WHERE sections.subject in (` + subjects.map(() => { return '?' }).join(',') + ` )
				AND sections.course_number = \'` + course_number + `\'\;`;
	}
	else
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
				WHERE sections.subject in (` + subjects.map(() => { return '?' }).join(',') + ` )`;
	}

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

app.post('/register', (request, response) => {
	let university_id = request.body.university_id;
	let crn = request.body.crn;
	let registered;
	let waitlisted = false;
	database.get(`SELECT capacity, registered FROM sections WHERE crn = ?`, [crn], (err, row) => {
		if(err)
		{
			return console.log(err.message);
		}
		if(row.registered.split(',').length >= row.capacity)
		{
			registered = row.registered + ',W' + university_id;
			waitlisted = true;
		}
		else if(row.registered.split(',').length == 0)
		{
			registered = university_id;
		}
		else
		{
			registered = row.registered + ',' + university_id;
		}

		database.run(`UPDATE sections SET registered = ? WHERE crn = ?`, [registered, crn], (err, row)=>{
			if(err){
				return console.log(err.message);
			}
			console.log(`crn: ` + crn + `\nregistered list: ` + registered);
			response.send({
				waitlisted: waitlisted
			});
		});
	});
});

app.post('/check_user', (request, response) => {
	let university_id = request.body.university_id;
	let password = request.body.password;

	let sql = `SELECT * FROM people WHERE university_id = ?` ;
	database.get(sql, [university_id], (err, row) => {
		if(err){
			return console.log(err.message);
		}
		if(row !== undefined && row.password === password)
		{
			response.send({
				auth: true,
				user_info: row
			});
		}
		else 
		{
			response.send({
				auth:false
			});
		}
	});
});

app.post('/create_user', (request, response) => {
	let university_id = request.body.university_id;
	let password = request.body.password;
	let position = request.body.position;
	let first_name = request.body.first_name;
	let last_name = request.body.last_name;

	let sql = `INSERT INTO people(university_id, password, position, first_name, last_name) VALUES(?, ?, ?, ?, ?)`;
	database.run(sql, [university_id, password, position, first_name, last_name], (err, row) => {
		if(err){
			return console.log(err.message);
		}
		response.send({
			status: 'success'
		});
	});
});
app.listen(port);
console.log('Now listening on port ' + port);
