# Course_Registration_Project

#RUNNING INSTRUCTIONS
first: open a terminal and navigate to the directory 'course_registration'
next: enter the command 'npm run build' (if you do not have all of the dependencies installed,
        run the command 'npm install' first)

The code should build successfully, errors will be shown in the terminal

next: navigate to the Course_Registration_Project directory
next: enter the command 'node server.js' to kick off the server (if you do not have all of the dependencies installed, run the command 'npm install' first)

next: open chrome and navigate to http://localhost:8012 to view the application. If you are running on dean the url is http://cisc-dean.stthomas.edu:/8012

***NOTE***
    THERE ARE TWO FOLDERS FOR NODE_MODULES. I DO NOT KNOW FOR SURE IF BOTH ARE NECESSARY, SO PRIOR TO RUNNING ANYTHING I WOULD RECOMMEND DOING A NPM INSTALL IN BOTH THE 'course_registration' DIRECTORY AND THE 'Course_Registration_Project' DIRECTORIES. WE SHOULD PROBABLY CHANGE THE DIRECTORY NAME FOR THE FRONT END FILES TO SOMETHING MORE CLEAR BUT I JUST GOT A SIMPLE REQUEST RESPONSE WORKING THROUGH THE FULL STACK.

**THINGS TO DO**
[x]Create a home page that serves as a login page<br />
[x]Use university_id as the username<br />
[x]Passwords should be hashed in the client before uploading to the server<br />
[x]Position should have a dropdown to select Student / Faculty<br />
[x]Have 2 buttons - "create new user" and "log in"<br />
[x]Create a search page - accessed once users log in<br />
[x]Checkbox list of department subject (4 letter code) and department full_name - similar to class finder<br />
[x]Require at least one checked<br />
[x]Text box for course_number<br />
[x]Text box for section crn<br />
[x]Course Section Table (need to format)<br />
[x]Course subject (4 letter department code)<br />
[x]Course number<br />
[x]Course section<br />
[x]Course name<br />
[x]Building and room<br />
[x]Section professors<br />
[x]Course credits<br />
[x]Section crn<br />
[x]Section number registered / capacity<br />
[x]Section waitlist count<br />
[x]Table should be ordered (subject in alphabetical order, for each subject - course number in ascending order, for each course number - section in ascending order<br />
[x]If the user clicks on any row, that section should expand to show the following (similar to class finder)<br />
[]Table of section class days/times (need table)<br />
[x]Course description<br />
[x]Register button (Only if user has position Student)<br />
[x]Send POST request (again using XMLHttpRequest) to register / add to the waitlist<br />
[x]Update registered/waitlist count in table when student registers<br />
[x]Should result in error if student already registered for that class<br />
[x]View Roster button (Only if user has position Faculty)<br />
[x]Show list of registered / waitlisted students (university_id, first name, last name)<br />
[x]Clicking the row again should re-collapse that section<br />
<br />
"About the Project" page<br />
[x]Short bio about each team member (including a photo)<br />
[x]Description of the tools (frameworks, APIs, etc.) you used to create the application<br />
[]Video demo of the application (2 - 4 minutes)<br />
<br />
5 additional points for each item completed on the list below<br />

[x]Provide loading animation while results are being fetched from the server<br />
[]Color code rows in course listings<br />
<br />
Example: <br />
Background light gray if not registered<br />
Background yellow if waitlisted<br />
Background green if registered<br />
<br />
[x]Replace "register" button with "drop" button for Students in sections they are currently registered (or waitlisted for) Should update the database accordingly<br />
[]Automatically move the first person on a waitlist to registered if a registered student drops<br />
[]Prevent students from "double registering" - registering for two separate classes that have a time conflict<br />
[x]Allow students to view schedule - Table with dates/times of all courses currently registered for - Can drop from this view too<br />
[]Create a pre-registration system for students<br />
<br />Allow students to "pre-register" for a course (i.e. save it to a wishlist)
Students can view their wishlist and click to "register for all"
Successfully register if openings available
Put on waitlist if section is full
<br />
<br />
*New Stuff* <br /> <br/>
[]Create a WebSocket server and have each browser client connect to it<br />
[]Whenever a student registers or drops a course, all other clients should be notified, and the registration counts on their pages immediately updated accordingly<br />
[]Also update faculty roster<br />
[]If some student drops and the logged in student is first on the waitlist for that course, then display a notice stating that they have moved from the waitlist to registered<br />
[]Also update background color to indicate registered<br />
[]10 additional points for completing a Journey Map of current registration process<br />

[]Download StudentUG_RegisterForCourses.docx from Canvas and fill in form as a group<br />
[]5 additional points for adding a page to your website for what your registration system does better than the current one (Include text and images highlighting differences)<br />

