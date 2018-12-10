<template>
  <div class="home">
    <p> Create Registration Page Here</p>
    <p>{{university_id}} </p>
    <ul id='department-list'>
      <li v-for='department in departments' :key='department.subject'>{{department.subject}} {{department.full_name}}</li>
    </ul>
    <!-- input text for course number -->
    <!-- input text for crn -->
    <!-- search button -->
    <table>
      <thead>
        <tr>
          <td> Subject </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for='course in courses' :key='course.crn'>
          <td> {{course.subject}} {{course.course_number}}</td>
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
      course_number: null,
      crn: null,
      courses: []
    }
  },
  props: ['authenticated', 'university_id'],
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
    this.getCourses();
  }
  
}
</script>

<style>
  #department-list {
    background-color: aqua;
  }
</style>


