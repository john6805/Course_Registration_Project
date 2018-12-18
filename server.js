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

	subjects = request.body.subjects;
	course_number = request.body.course_number;
	crn = request.body.crn;

	let sql;
	if(crn != '')
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
					courses.description,
					sections.crn
				FROM 
					sections 
				INNER JOIN 
					courses 
				ON 
					sections.subject = courses.subject AND sections.course_number = courses.course_number 
				WHERE sections.crn = ?`;
				database.all(sql, [crn], (err, rows) => {
					if(err){
						return console.log(err.message);
					}
			
					response.send(rows);
				});
	}
	else if(course_number != '')
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
					courses.description,
					sections.crn 
				FROM 
					sections 
				INNER JOIN 
					courses 
				ON 
					sections.subject = courses.subject AND sections.course_number = courses.course_number
				WHERE sections.subject in (` + subjects.map(() => { return '?' }).join(',') + ` )
				AND sections.course_number = \'` + course_number + `\'\;`;
				database.all(sql, subjects, (err, rows) => {
					if(err){
						return console.log(err.message);
					}
			
					response.send(rows);
				});
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
					courses.description,
					sections.crn 
				FROM 
					sections 
				INNER JOIN 
					courses 
				ON 
					sections.subject = courses.subject AND sections.course_number = courses.course_number
				WHERE sections.subject in (` + subjects.map(() => { return '?' }).join(',') + ` )`;
				database.all(sql, subjects, (err, rows) => {
					if(err){
						return console.log(err.message);
					}
			
					response.send(rows);
				});
	}
});

app.post('/drop', (request, response) => {
	let university_id = request.body.university_id;
	let crn = request.body.crn;

	database.get(`SELECT registered FROM sections WHERE crn = ?`, [crn], (err, row) => {
		if(err)
		{
			return console.log(err.message);
		}
		let registered_list = row.registered.split(',');
		let registered;
		registered_list.splice(registered_list.indexOf(university_id), 1);
		registered = registered_list.toString();
		database.run(`UPDATE sections SET registered = ? WHERE crn = ?`, [registered, crn], (err, row)=>{
			if(err){
				return console.log(err.message);
			}
		});
		database.get(`SELECT registered_courses FROM people WHERE university_id = ?`, [university_id], (err, row) => {
			if(err)
			{
				console.log(err.message);
			}

			let input = row.registered_courses.split(',');
			input.splice(input.indexOf(crn), 1);
			input = input.toString();

			database.run(`UPDATE people SET registered_courses = ? WHERE university_id = ?`, [input, university_id], (err, row)=>{
				if(err){
					return console.log(err.message);
				}
				response.send({
					success: 'Class dropped'
				});
			});
		});
	});
})

app.post('/register', (request, response) => {
	let university_id = request.body.university_id;
	let crn = request.body.crn;
	let input = crn;
	let registered;
	let waitlisted = false;
	database.get(`SELECT capacity, registered FROM sections WHERE crn = ?`, [crn], (err, row) => {
		if(err)
		{
			return console.log(err.message);
		}
		if(row.registered.indexOf(university_id) >= 0)
		{
			response.send({
				err: "Student already registered"
			});
			return;
		}
		if(row.registered.split(',').length >= row.capacity)
		{
			input = 'W' + crn;
			waitlisted = true;
		}
		if(row.registered.length == 0)
		{
			registered = university_id;
		}
		else
		{
			registered = row.registered + ',' + university_id;
		}
		database.get(`SELECT registered_courses FROM people WHERE university_id = ?`, [university_id], (err, row) => {
			if(err)
			{
				console.log(err.message);
			}
			if(row.registered_courses != null && row.registered_courses.length != 0)
			{
				input = row.registered_courses + ',' + input;
			}
			database.run(`UPDATE people SET registered_courses = ? WHERE university_id = ?`, [input, university_id], (err, row)=>{
				if(err){
					return console.log(err.message);
				}
			});
		});
		database.run(`UPDATE sections SET registered = ? WHERE crn = ?`, [registered, crn], (err, row)=>{
			if(err){
				return console.log(err.message);
			}
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
				user_info: {
					first_name: row.first_name,
					last_name: row.last_name,
					position: row.position,
					registered_courses: row.registered_courses,
					university_id: row.university_id + ""
				}
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

app.get('/get_user_info', (request, response) => {
	let student_list = request.query.student_list.split(',');
	let sql = `SELECT university_id, first_name, last_name FROM people WHERE university_id in (` + student_list.map(() => { return '?' }).join(',') + ` )`;
	database.all(sql, student_list, (err, rows) => {
		if(err){
			return console.log(err.message);
		}
		response.send({
			students: rows
		});

	});
})

app.post('/create_user', (request, response) => {
	let university_id = request.body.university_id;
	let password = request.body.password;
	let position = request.body.position;
	let first_name = request.body.first_name;
	let last_name = request.body.last_name;

	let sql = `INSERT INTO people(university_id, password, position, first_name, last_name) VALUES(?, ?, ?, ?, ?)`;
	database.run(sql, [university_id, password, position, first_name, last_name], (err, row) => {
		if(err){
			console.log(err.message);
			response.send({
				status: 'failure'
			});
		}
		else
		{
			response.send({
				status: 'success'
			});
		}
	});
});
app.listen(port);
console.log('Now listening on port ' + port);
