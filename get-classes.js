var cheerio = require('cheerio');
var axios = require('axios');
var bodyStart;
var bodyEnd;
var body;
var $;
var courses = [];
var sections = [];
var subjects = ['ACCT','ACSC','ACST','AERO','AMBA','ARAB','ARHS','ARTH','BCHM','BCOM','BETH','BIOL','BLAW','BUSN','CATH','CHDC','CHEM','CHIN','CIED','CISC','CJUS','CLAS','COAC','COJO','COMM','CPSY','CSIS','CSMA','CTED','DRSW','DSCI','DVDM','DVDT','DVHS','DVLS','DVMT','DVPH','DVPM','DVPT','DVSP','DVSS','DVST','ECMP','ECON','EDCE','EDLD','EDUA','EDUC','EGED','ENGL','ENGR','ENTR','ENVR','ESCI','ETLS','EXSC','FAST','FILM','FINC','FREN','GBEC','GENG','GEOG','GEOL','GERM','GIFT','GMUS','GRED','GREK','GRPE','GRSW','GSPA','HIST','HLTH','HONR','HRDO','IBUS','IDSC','IDSW','IDTH','INAC','INCH','INEC','INEG','INFC','INFR','INGR','INHR','INID','INIM','INJP','INLW','INMC','INMG','INMK','INOP','INPS','INRS','INSP','INST','INTR','IRGA','ITAL','JAPN','JOUR','JPST','LATN','LAWS','LEAD','LGST','LHDT','MATH','MBAC','MBEC','MBEN','MBEX','MBFC','MBFR','MBFS','MBGC','MBGM','MBHC','MBHR','MBIF','MBIM','MBIS','MBLW','MBMG','MBMK','MBNP','MBOP','MBQM','MBSK','MBSP','MBST','MBUN','MBVE','MFGS','MGMP','MGMT','MKTG','MMUS','MSQS','MSRA','MUSC','MUSN','MUSP','MUSR','MUSW','NSCI','ODOC','OPMT','PHED','PHIL','PHYS','PLLD','POLS','PSYC','PUBH','QMCS','READ','REAL','RECE','REDP','RUSS','SABC','SABD','SACS','SAED','SAIM','SAIN','SALS','SAMB','SASE','SASW','SEAM','SEIS','SMEE','SOCI','SOWK','SPAN','SPED','SPGT','SPUG','STAT','STEM','TEGR','THEO','THTR','WMST']
var days = {
    0: 'M',
    1: 'T',
    2: 'W',
    3: 'Th',
    4: 'F',
    5: 'Sa',
    6: 'Su'
}
// axios.get('https://classes.aws.stthomas.edu/json/getSubjectList.json?year=2019&term=20&schoolCode=ALL&levelCode=ALL')
// .then(result => {
//     console.log(result.data);
// })
// .catch(error => {
//     console.log(error);
// });

axios.get('https://classes.aws.stthomas.edu/index.htm?year=2019&term=20&schoolCode=ALL&levelCode=ALL&selectedSubjects=CISC')
.then(result => {
    bodyStart = result.data.search('<body>');
    bodyEnd = result.data.search('</body>');
    body = result.data.substring(bodyStart, bodyEnd);
    $ = cheerio.load(body);
    body = $(body);

    $('div[class=course]').each(function(i, element){
        var course = {
            subject: 'CISC',
            course_number: '',
            credits: 0,
            name: '',
            description: ''
        }
        var section = {
            crn: 0,
            subject: 'CISC',
            course_number: '',
            section_number: '',
            building: '',
            room: '',
            professors: 'TBD',
            times: '',
            capacity: 0,
            registered: ''
        }
        //course.subject = $(element).find('div[class=columns,small-6,medium-4,large-4]').text();
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

        var courseInfo = $(element).find('div[class="columns hide"]').text();
        section.crn = parseInt(courseInfo.substring(courseInfo.indexOf('CRN') + 4, courseInfo.indexOf('CRN') + 9));
        course.credits = parseInt(courseInfo.charAt(courseInfo.indexOf('Cr') - 2));

        var courseHighlight = $(element).find('p[class="courseInfoHighlight"]');
        section.building = courseHighlight[2].children[0].data.trim();
        section.building = section.building.substring(0, section.building.length - 4);
        section.room = $(element).find('span[class="locationHover"]').text().trim();

        course.name = $(element).find('div[class="columns small-6 medium-4 large-4"]').text().trim();

        course.description = $(element).find('p[class="courseInfo"]').text().trim();

        section.professors = $(element).find('a[class="icon-dark-purple-light-purple c2-icon-1-7"]').text().trim();
        section.professors = (section.professors === '') ? 'TBD' : section.professors;

        var schedule = $(element).find('table[class="courseCalendar"]').find('tr');
        schedule.each((function(j, row){
            if(j == 2)
            {
                $(row).find($('td')).each((k, cell) => {
                    if($(cell).hasClass('time'))
                    {
                        if(section.times.length != 0)
                        {
                            section.times = section.times + ',';
                        }
                        var timeRange = $(cell).text();
                        var amIndex = timeRange.indexOf('am');
                        var pmIndex = timeRange.indexOf('pm');
                        if(amIndex != -1)
                        {
                            timeRange = timeRange.slice(0, amIndex + 2) + '-' + timeRange.slice(amIndex + 2);
                        }
                        else
                        {
                            timeRange = timeRange.slice(0, pmIndex + 2) + '-' + timeRange.slice(pmIndex + 2);
                        }
                        section.times = section.times + days[k] + ' ' + timeRange;
                    }
                })    
            }
        }));
        //console.log(schedule);

        sections.push(section);
        courses.push(course);
    });
    //var courses = body.find('div[class=course]')[0];
    //var section = body.find('span[class=courseOpen]')[0];

    console.log(sections[0]);
    // for(var i = 0; i < sections.length; i++)
    // {
    //     console.log(sections[i]);
    // }
})
.catch(error => {
    console.log(error);
})

//cheerio documentation
//https://github.com/cheeriojs/cheerio

//URL for getting subjects
//https://classes.aws.stthomas.edu/json/getSubjectList.json?year=2019&term=20&schoolCode=ALL&levelCode=ALL
