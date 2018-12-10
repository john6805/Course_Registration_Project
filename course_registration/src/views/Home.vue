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
        <div style="width: 100%;">
          <tr style="width: 100%;">
            <th> Subject </th>
            <th> Name </th>
            <th> Building </th>
            <th> Room </th>
            <th> Professor </th>
            <th> Credits </th>
            <th> CRN </th>
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
            <td> {{course.crn}} <td>
            <td> {{course.numberOfRegistered}} <td>
            <td> {{course.numberOfWaitlisted}} <td>
          </tr>
          <tr v-show="course.expand">
            <td colspan="2">{{course.times}}</td>
            <td colspan="3">{{course.description}} </td>
            <td><button @click="register">Register</button></td>
          </tr>
        </div>
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
        self.courses.forEach((course => {
          self.$set(course, 'expand', false);
          var numWaitlisted = 0;
          //calculate registered and waitlisted
          if(course.registered != null){
            var numRegistered = course.registered;
            var registered = 0;
            numRegistered = numRegistered.split(",");
            for(var i=0; i<numRegistered.length; i++){
              if(numRegistered[i].charAt(0) != "W"){
                registered = registered + 1;
              }else{
                numWaitlisted = numWaitlisted + 1;
              }
            }
          }else{
            var numRegistered = course.registered;
            var registered = 0;
            numWaitlisted = 0;
          }
          console.log(numWaitlisted);
          self.$set(course, 'numberOfWaitlisted', numWaitlisted);
          self.$set(course, 'numberOfRegistered', registered);
        }));
      });
    },
    toggleShow(course)
    {
      course.expand = !course.expand;
    },
    register() {
      axios({
        method: 'post',
        url: 'http://localhost:8012/register',
        data: {
          subjects: self.university_id,
          crn: self.crn
        }
      }).then((response) => {
        window.alert(response.data.waitlisted);
      });
    }
  },
  beforeMount(){
    this.getDepartments();
  },
  mounted(){
    console.log(this.university_id);
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
</style>


