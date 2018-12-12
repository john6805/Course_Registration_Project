var cheerio = require('cheerio');
var axios = require('axios');
var sqlite = require('sqlite3').verbose();
var database = new sqlite.Database('ust_courses.sqlite3');
var bodyStart;
var bodyEnd;
var body;
var $;
var courses = [];
var sections = [];
var promises = [];
var subjects = ['ACCT','ACSC','ACST','AERO','AMBA','ARAB','ARHS','ARTH','BCHM','BCOM','BETH','BIOL','BLAW','BUSN','CATH','CHDC','CHEM','CHIN','CIED','CISC','CJUS','CLAS','COAC','COJO','COMM','CPSY','CSIS','CSMA','CTED','DRSW','DSCI','DVDM','DVDT','DVHS','DVLS','DVMT','DVPH','DVPM','DVPT','DVSP','DVSS','DVST','ECMP','ECON','EDCE','EDLD','EDUA','EDUC','EGED','ENGL','ENGR','ENTR','ENVR','ESCI','ETLS','EXSC','FAST','FILM','FINC','FREN','GBEC','GENG','GEOG','GEOL','GERM','GIFT','GMUS','GRED','GREK','GRPE','GRSW','GSPA','HIST','HLTH','HONR','HRDO','IBUS','IDSC','IDSW','IDTH','INAC','INCH','INEC','INEG','INFC','INFR','INGR','INHR','INID','INIM','INJP','INLW','INMC','INMG','INMK','INOP','INPS','INRS','INSP','INST','INTR','IRGA','ITAL','JAPN','JOUR','JPST','LATN','LAWS','LEAD','LGST','LHDT','MATH','MBAC','MBEC','MBEN','MBEX','MBFC','MBFR','MBFS','MBGC','MBGM','MBHC','MBHR','MBIF','MBIM','MBIS','MBLW','MBMG','MBMK','MBNP','MBOP','MBQM','MBSK','MBSP','MBST','MBUN','MBVE','MFGS','MGMP','MGMT','MKTG','MMUS','MSQS','MSRA','MUSC','MUSN','MUSP','MUSR','MUSW','NSCI','ODOC','OPMT','PHED','PHIL','PHYS','PLLD','POLS','PSYC','PUBH','QMCS','READ','REAL','RECE','REDP','RUSS','SABC','SABD','SACS','SAED','SAIM','SAIN','SALS','SAMB','SASE','SASW','SEAM','SEIS','SMEE','SOCI','SOWK','SPAN','SPED','SPGT','SPUG','STAT','STEM','TEGR','THEO','THTR','WMST'];
var days = {
    0: 'M',
    1: 'T',
    2: 'W',
    3: 'Th',
    4: 'F',
    5: 'Sa',
    6: 'Su'
}
//Create database
database.serialize(() => {
    //Create Tables
    database.run('CREATE TABLE IF NOT EXISTS departments(subject TEXT PRIMARY KEY, full_name TEXT);');
    database.run('CREATE TABLE IF NOT EXISTS courses(subject TEXT, course_number TEXT, credits INT, name TEXT, description TEXT, PRIMARY KEY(subject, course_number));');
    database.run('CREATE TABLE IF NOT EXISTS sections(crn INT PRIMARY KEY, subject TEXT, course_number TEXT, section_number TEXT, building TEXT, room TEXT, professors TEXT, times TEXT, capacity INT, registered TEXT);');
    database.run('CREATE TABLE IF NOT EXISTS people(university_id INT PRIMARY KEY, position TEXT, password TEXT, first_name TEXT, last_name TEXT, registered_courses TEXT);');
});



//this code will be used for inserting into the departments table, returns a json with all subjects and their abbreviations
axios.get('https://classes.aws.stthomas.edu/json/getSubjectList.json?year=2019&term=20&schoolCode=ALL&levelCode=ALL')
.then(result => {
    //insert results into departments table
    result.data.forEach((item) => {
        if(item.subjectCode == 'STEM')
        {
            database.serialize(() => {
                database.run('INSERT OR IGNORE INTO departments(subject, full_name) VALUES (?, ?)',
                [item.subjectCode, item.subjectDescription]);
            });  
        }
        else
        {
            database.serialize(() => {
                database.run('INSERT OR IGNORE INTO departments(subject, full_name) VALUES (?, ?)',
                [item.subjectCode, item.subjectDescription.substring(6)]);
            });  
        }
    });
})
.catch(error => {
    console.log("error1\n");
    console.log(error);
});

//loop through each subject and get it's courses/sections
for(var iterator = 0; iterator < subjects.length; iterator++)
{
    var currentSubject = subjects[iterator];
    promises.push(axios.get('https://classes.aws.stthomas.edu/index.htm?year=2019&term=20&schoolCode=ALL&levelCode=ALL&selectedSubjects=' + currentSubject));
}
axios.all(promises)
.then(function(results){
    results.forEach((result) =>{
        //strip the body out of the html
        bodyStart = result.data.search('<body>');
        bodyEnd = result.data.search('</body>');
        body = result.data.substring(bodyStart, bodyEnd);
        $ = cheerio.load(body);
        body = $(body);

        //for each course
        $('div[class=course]').each(function(i, element){
            var course = {
                subject: result.request.path.slice(-4),
                course_number: '',
                credits: 0,
                name: '',
                description: ''
            }
            var section = {
                crn: 0,
                subject: result.request.path.slice(-4),
                course_number: '',
                section_number: '',
                building: '',
                room: '',
                professors: 'TBD',
                times: '',
                capacity: 0,
                registered: ''
            }

            //grab course number from html
            courseNumber = $(element).find('span[class=courseOpen]').text().split('-');
            if(courseNumber[0] == '')
            {
                courseNumber = $(element).find('span[class=courseWaitlist]').text().split('-');
            }
            if(courseNumber[0] == '')
            {
                courseNumber = $(element).find('span[class=courseClosed]').text().split('-');
            }
            course.course_number = courseNumber[0];
            section.course_number = courseNumber[0];
            section.section_number = courseNumber[1];

            //grab crn and credits from html
            var courseInfo = $(element).find('div[class="columns hide"]').text();
            section.crn = parseInt(courseInfo.substring(courseInfo.indexOf('CRN') + 4, courseInfo.indexOf('CRN') + 9));
            course.credits = parseInt(courseInfo.charAt(courseInfo.indexOf('Cr') - 2));

            //grab building and room number from html
            section.room = $(element).find('span[class="locationHover"]').text().trim();
            var courseHighlight = $(element).find('p[class="courseInfoHighlight"]');
            if(section.room == 'Online')
            {
                section.building = 'Online';
                section.room = null;
            }
            else
            {
                section.building = courseHighlight[2].children[0].data.trim();
                section.building = section.building.substring(0, section.building.length - 4);
            }
            

            course.name = $(element).find('div[class="columns small-6 medium-4 large-4"]').text().trim();

            course.description = $(element).find('p[class="courseInfo"]').text().trim();

            //grab professor, if no professor set to TBD
            section.professors = $(element).find('a[class="icon-dark-purple-light-purple c2-icon-1-7"]').text().trim();
            section.professors = (section.professors === '') ? 'TBD' : section.professors;

            //parse table containing class days and times
            var schedule = $(element).find('table[class="courseCalendar"]').find('tr');
            schedule.each((function(j, row){
                if(j >= 1)
                {
                    $(row).find($('td')).each((k, cell) => {
                        if($(cell).hasClass('time'))
                        {
                            if(section.times.length != 0)
                            {
                                section.times = section.times + ',';
                            }
                            var timeRange = $(cell).text().trim();
                            var amIndex = timeRange.indexOf('am');
                            var pmIndex = timeRange.indexOf('pm');
                            var slashIndex = timeRange.indexOf('/');
                            
                            //place hyphen between the times
                            if(amIndex != -1)
                            {
                                //a few listings have specific dates where class is held, therefore must be sliced a bit differently
                                if(slashIndex > -1)
                                {
                                    timeRange = timeRange.slice(slashIndex + 4, amIndex + 2) + '-' + timeRange.slice(amIndex + 2, timeRange.indexOf('/', slashIndex + 1) - 2);   
                                }
                                else
                                {
                                    timeRange = timeRange.slice(0, amIndex + 2) + '-' + timeRange.slice(amIndex + 2);
                                }
                            }
                            else
                            {
                                if(slashIndex > -1)
                                {
                                    timeRange = timeRange.slice(slashIndex + 4, pmIndex + 2) + '-' + timeRange.slice(pmIndex + 2, timeRange.indexOf('/', slashIndex + 1) - 2);   
                                }
                                else
                                {
                                    timeRange = timeRange.slice(0, pmIndex + 2) + '-' + timeRange.slice(pmIndex + 2);
                                }
                            }

                            section.times = section.times + days[k] + ' ' + timeRange;
                        }
                    });
                }
            }));
            
            section.capacity = parseInt($(element).find('div[class="columns small-2"]').text().trim().slice(5));

            sections.push(section);
            courses.push(course);
        });
    })
})
.then(()=>{
    //this block is where the insert into the table should occur

    //Loop over 'sections' and 'courses'
    //only insert into courses if the current course isn't present
    courses.forEach((course) => {
        database.serialize(() => {
            database.run('INSERT OR IGNORE INTO courses(subject, course_number, credits, name, description) VALUES (?, ?, ?, ?, ?)',
            [course.subject, course.course_number, course.credits, course.name, course.description]);
        });
    });
    sections.forEach((section) => {
        database.serialize(() => {
            database.run('INSERT OR IGNORE INTO sections(crn, subject, course_number, section_number, building, room, professors, times, capacity, registered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [section.crn, section.subject, section.course_number, section.section_number, section.building, section.room, section.professors, section.times, section.capacity, section.registered]);
        });
    });

    database.close();
}).catch((error) =>{
    console.log("error2\n");
});

//}


//cheerio documentation
//https://github.com/cheeriojs/cheerio

//URL for getting subjects
//https://classes.aws.stthomas.edu/json/getSubjectList.json?year=2019&term=20&schoolCode=ALL&levelCode=ALL
