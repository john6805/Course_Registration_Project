<template>
  <div class="home">
    <p> Create Registration Page Here</p>
    <p>{{ university_id }} </p>
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
        <tr>
          <td> Subject </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for='course in courses' :key='course.crn'>
          <td> {{course.subject}} {{course.course_number}} - {{course.section_number}}</td>
          <td> {{course.name}} </td>
          <td v-if="course.building.indexOf('No') < 0"> {{course.building}} </td>
          <td v-else>{{course.building.slice(0, course.building.indexOf('No'))}}</td>
          <td> {{course.room}} </td>
          <td> {{course.professors}} </td>
          <td> {{course.credits}} </td>
          <td> {{course.crn}} <td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// @ is an alias to src
//url for getting departments - http://localhost:8012/departments
import axios from 'axios';

export default {
  name: 'home',
  data: () => {
    return {
      departments: [],
      subjects: ['CISC'],
      course_number: '',
      crn: '',
      courses: []
    }
  },
  props: ['university_id', 'authenticated'],
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
      });
    }
  },
  beforeMount(){
    this.getDepartments();
  }
  
}
</script>

<style>
  #list-container label {
    display: block;
    padding-left: 15px;
    text-indent: -15px;
    list-style-type: none;
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
  .home {
    position: relative;
  }
</style>


