//this file is just for testing database stuff
var sqlite = require('sqlite3').verbose();
var database = new sqlite.Database('ust_courses.sqlite3');
database.serialize(() => {
    //Create Tables
    database.run('CREATE TABLE departments(subject TEXT PRIMARY KEY, full_name TEXT);');
    database.run('CREATE TABLE courses(subject TEXT, course_number TEXT, credits INT, name TEXT, description TEXT, PRIMARY KEY(subject, course_number));');
    database.run('CREATE TABLE sections(crn INT PRIMARY KEY, subject TEXT, course_number TEXT, section_number TEXT, building TEXT, room TEXT, professors TEXT, times TEXT, capacity INT, registered TEXT);');
    database.run('CREATE TABLE people(university_id INT PRIMARY KEY, position TEXT, password TEXT, first_name TEXT, last_name TEXT, registered_courses TEXT);');
});