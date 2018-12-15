<template>
  <div class="home">
    <h1>Course Registration</h1>
    <h4>Select a Department</h4>
    <div id="list-container">
      <ul id='department-list'>
        <li v-for='department in departments' :key='department.subject'>
          <label><input type='checkbox' v-bind:value='department.subject' v-model="subjects">{{department.subject}}: {{department.full_name}}</label>
        </li>
      </ul>
    </div>
    <span>Course number: </span>
    <input type="text" v-model="course_number" placeholder="course number">
    <br>
    <span>CRN: </span>
    <input type="text" v-model="crn" placeholder="crn">
    <br>
    <button v-on:click="getCourses">Search</button>
    <table>
      <thead>
        <div style="width: 100%;">
          <tr style="width: 100%;">
            <th> Subject </th>
            <th> Name </th>
            <th> Building </th>
            <th> Room </th>
            <th> Professor </th>
            <th> Credits </th>
            <th> CRN </th>
            <th> Capacity </th>
            <th> Registered </th>
            <th> Waitlisted </th>
          </tr>
        </div>
      </thead>
      <tbody>
        <div v-for='course in courses' :key='course.crn'>
          <tr class="accordion-header" @click="toggleShow(course)">
            <td> {{course.subject}} {{course.course_number}} - {{course.section_number}}</td>
            <td> {{course.name}} </td>
            <td v-if="course.building.indexOf('No') < 0"> {{course.building}} </td>
            <td v-else>{{course.building.slice(0, course.building.indexOf('No'))}}</td>
            <td> {{course.room}} </td>
            <td> {{course.professors}} </td>
            <td> {{course.credits}} </td>
            <td> {{course.crn}} </td>
            <td> {{course.capacity}} </td>
            <td> {{course.registered_count}} </td>
            <td> {{course.waitlist_count}} </td>
          </tr>
          <tr v-show="course.expand">
            <td colspan="2">{{course.times}}</td>
            <td colspan="3">{{course.description}} </td>
            <td>
              <button v-if="user.position == 'Student'" v-show="course.registered.indexOf(user.university_id) < 0" @click="register(course)">Register</button>
              <button v-if="user.position == 'Student'" v-show="course.registered.indexOf(user.university_id) >= 0" @click="drop(course)">Drop</button>
              <button v-if="user.position == 'Faculty'" @click="openRoster(course)">Roster</button>
            </td>
          </tr>
        </div>
      </tbody>
    </table>
    <roster v-show="open_roster" @close="closeRoster()" :registered_list="registered_list" :waitlist="waitlist" />
    <div v-show="isLoading" class="modal-backdrop">
      <ring-loader id="loader"></ring-loader>
    </div>
  </div>
</template>

<script>
// @ is an alias to src
//url for getting departments - http://localhost:8012/departments
import axios from 'axios';
import roster from '../components/Roster.vue'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import { setTimeout } from 'timers';

export default {
  name: 'home',
  props: ['user_info', 'authenticated'],
  data: () => {
    return {
      departments: [],
      subjects: ['CISC'],
      course_number: '',
      crn: '',
      courses: [],
      user: {},
      open_roster: false,
      registered_list: [],
      waitlist: [],
      isLoading: false
    }
  },
  components: {
    roster,
    RingLoader
  },
  methods: {
    getDepartments: function() {
      let self = this;
      axios.get('http://localhost:8012/departments')
        .then((response) => {
          self.departments = response.data;
        });
    },
    getCourses: function() {
      let self = this;
      if(this.subjects.length == 0)
      {
        window.alert('Please select a subject');
        return;
      }
      self.isLoading = true;
      setTimeout(() => {
        axios({
          method: 'post',
          url: 'http://localhost:8012/courses',
          data: {
            subjects: self.subjects,
            course_number: self.course_number,
            crn: self.crn
          }
        }).then((response) => {
          self.courses = response.data;

          self.courses.sort(self.compare);

          self.courses.forEach((course => {
            self.$set(course, 'expand', false);
            
            let registered_count = 0;
            let waitlist_count = 0;
            
            if(course.registered.length != 0)
            {
              if(course.registered.split(',').length > course.capacity)
              {
                waitlist_count = course.registered.split(',').length - course.capacity;
              }
              registered_count = course.registered.split(',').length - waitlist_count;
            }
            self.$set(course, 'waitlist_count', waitlist_count);
            self.$set(course, 'registered_count', registered_count);
          }));
          self.isLoading = false;
        });
      }, 500)
    },
    toggleShow(course)
    {
      course.expand = !course.expand;
    },
    register(course) {
      let self = this;
      self.isLoading = true;
      setTimeout(() => {
        axios({
          method: 'post',
          url: 'http://localhost:8012/register',
          data: {
            university_id: self.user.university_id,
            crn: course.crn
          }
        }).then((response) => {
          if(response.data.err)
          {
            self.isLoading = false;
            window.alert(response.data.err);
            return;
          }
          let crn = course.crn;

          //update course registered list with university id
          if(course.registered.length == 0)
          {
            course.registered = self.user.university_id;
          }
          else
          {
            course.registered = course.registered.split(',').push(self.user.university_id).toString();
          }

          //update user registered list with crn, prepended with a 'W' if on waitlist
          if(course.registered.split(',').length > course.capacity)
          {
            crn = 'W' + course.crn;
            course.waitlist_count++;
          }
          else
          {
            course.registered_count++;
          }
          if(self.user.registered_courses.length == 0)
          {
            self.user.registered_courses = crn;
          }
          else
          {
            self.user.registered_courses = self.user.registered_courses.split(',').push(crn).toString();
          }
          self.isLoading = false;
        });
      }, 500)
    },
    drop(course)
    {
      let self = this;
      self.isLoading = true;
      setTimeout(() => {
        axios({
          method: 'post',
          url: 'http://localhost:8012/drop',
          data: {
            university_id: self.user.university_id,
            crn: course.crn
          }
        }).then((response) => {
          if(response.data.err)
          {
            self.isLoading = false;
            window.alert(response.data.err);
            return;
          }

          //update course registered list with university id
          let registered = course.registered.split(',');
          console.log(registered);
          course.registered = registered.splice(registered.indexOf(self.user.university_id), 1).toString();

          //update user registered list with crn
          let registered_courses = self.user.registered_courses.split(',');
          console.log(registered_courses);
          if(registered_courses.indexOf('W' + course.crn) >= 0)
          {
            self.user.registered_courses = registered_courses.splice(registered_courses.indexOf('W' + course.crn), 1).toString();
            course.waitlist_count--;
          }
          else
          {
            self.user.registered_courses = registered_courses.splice(registered_courses.indexOf(course.crn), 1).toString();
            course.registered_count--;
          }

          console.log(self.user.registered_courses);
          console.log(course.registered);
          self.isLoading = false;
        });
      }, 500)
    },
    openRoster(course) {
      let self = this;

      if(course.registered.length == 0)
      {
        self.registered_list = [];
        self.waitlist = [];
        self.open_roster = true;
        return;
      }
      self.isLoading = true;
      setTimeout(() => {
        axios.get('http://localhost:8012/get_user_info',{
          params: {
            student_list: course.registered
          }
        }).then((response) => {
          let registered_list = [];
          let waitlist = [];

          if(response.data.students.length > course.capacity){
            registered_list = response.data.students.slice(0, course.capacity);
            waitlist = response.data.students.slice(course.capacity, response.data.students.length);
          }
          else {
            registered_list = response.data.students;
          }
          self.registered_list = registered_list;
          self.waitlist = waitlist;
          self.open_roster = true;
          self.isLoading = false;
        });
      }, 500)
    }, 
    closeRoster() {
      this.open_roster = false;
    },
    compare(course1, course2) {
      const subject1 = course1.subject;
      const subject2 = course2.subject;
      const course_number1 = course1.course_number;
      const course_number2 = course2.course_number;
      const section_number1 = course1.section_number;
      const section_number2 = course2.section_number;

      let comparison;
      if(subject1 < subject2){
        comparison = 1;
      }
      else if(subject1 > subject2){
        comparison = -1;
      }
      else if(course_number1 > course_number2){
        comparison = 1;
      }
      else if(course_number1 < course_number2){
        comparison = -1;
      }
      else if(section_number1 > section_number2){
        comparison = 1;
      }
      else if(section_number1 < section_number2){
        comparison = -1;
      }
      else{
        comparison = 0;
      }
      
      return comparison;
    }
  },
  beforeMount(){
    this.getDepartments();
  },
  mounted(){
    this.user = this.user_info;
  }
}
</script>

<style>
  #list-container label{
    display: block;
    padding-left: 15px;
    text-indent: -15px;
  }
  #list-container input[type="checkbox"] {
    width: 13px;
    height: 13px;
    padding: 0;
    margin:0;
    vertical-align: bottom;
    position: relative;
    top: -1px;
    *overflow: hidden;
  }
  #department-list {
    height: 850px;
    -webkit-column-count: 4;
    -moz-column-count: 4;
    column-count: 4;
    list-style-type: none;
  }
  th {
    width:15%
  }
  .home {
    position: relative;
  }

  .accordion {
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
}

.accordion-header {
    cursor: pointer;
    background-color: lightgray;
}

.accordion-body   {
    padding: 0;
    max-height: 15em;
    overflow:scroll;
    transition: 0.3s ease all;
}

.body-content {
    padding: 20px;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>


