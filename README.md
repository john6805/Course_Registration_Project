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
[x]Create a home page that serves as a login page
[x]Use university_id as the username
[x]Passwords should be hashed in the client before uploading to the server
[x]Position should have a dropdown to select Student / Faculty
[x]Have 2 buttons - "create new user" and "log in"
[x]Create a search page - accessed once users log in
[x]Checkbox list of department subject (4 letter code) and department full_name - similar to class finder
[x]Require at least one checked
[x]Text box for course_number
[x]Text box for section crn
[]Course Section Table (need to format)
[x]Course subject (4 letter department code)
[x]Course number
[x]Course section
[x]Course name
[x]Building and room
[x]Section professors
[x]Course credits
[x]Section crn
[x]Section number registered / capacity
[x]Section waitlist count
[]Table should be ordered (subject in alphabetical order, for each subject - course number in ascending order, for each course number - section in ascending order
[x]If the user clicks on any row, that section should expand to show the following (similar to class finder)
[]Table of section class days/times (need table)
[x]Course description
[x]Register button (Only if user has position Student)
[x]Send POST request (again using XMLHttpRequest) to register / add to the waitlist
[]Update registered/waitlist count in table when student registers
[x]Should result in error if student already registered for that class
[x]View Roster button (Only if user has position Faculty)
[x]Show list of registered / waitlisted students (university_id, first name, last name)
[x]Clicking the row again should re-collapse that section

"About the Project" page
[x]Short bio about each team member (including a photo)
[x]Description of the tools (frameworks, APIs, etc.) you used to create the application
[]Video demo of the application (2 - 4 minutes)

5 additional points for each item completed on the list below

[]Provide loading animation while results are being fetched from the server
[]Color code rows in course listings

Example: 
Background light gray if not registered
Background yellow if waitlisted
Background green if registered

[]Replace "register" button with "drop" button for Students in sections they are currently registered (or waitlisted for) Should update the database accordingly
[]Automatically move the first person on a waitlist to registered if a registered student drops
[]Prevent students from "double registering" - registering for two separate classes that have a time conflict
[]Allow students to view schedule - Table with dates/times of all courses currently registered for - Can drop from this view too
[]Create a pre-registration system for students
Allow students to "pre-register" for a course (i.e. save it to a wishlist)
Students can view their wishlist and click to "register for all"
Successfully register if openings available
Put on waitlist if section is full

