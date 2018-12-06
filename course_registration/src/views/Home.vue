<template>
  <div class="home">
    <p> Create Registration Page Here</p>
    <ul>
      <li v-for='department in departments' :key='department.subject'>{{department.subject}} {{department.full_name}}</li>
    </ul>
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
      departments: []
    }
  },
  methods: {
    getDepartments: function() {
      let self = this;
      axios.get('http://localhost:8012/departments')
        .then((response) => {
          self.departments = response.data;
          window.alert(response.data);
        });
    }
  },
  beforeMount(){
    this.getDepartments();
  }
}
</script>

