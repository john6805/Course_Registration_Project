var HTMLParser = require('node-html-parser');
var axios = require('axios');
var cisc_html = axios.get('https://classes.aws.stthomas.edu/index.htm?year=2019&term=20&schoolCode=ALL&levelCode=ALL&selectedSubjects=CISC')
.then(result => {
    var root = HTMLParser.parse(result);
    console.log(root.firstChild);
})
.catch(error => {
    console.log(error);
});