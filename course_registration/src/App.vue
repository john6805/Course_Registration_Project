<template>
  <div id="app">
    <div id="nav">
      <router-link v-if="authenticated" to="/home">Home</router-link> |
      <router-link v-if="authenticated" to="/about">About</router-link> |
      <router-link v-if="authenticated" to="/login" v-on:click.native="logout()" replace>Logout</router-link>
    </div>
    <router-view @authenticated="setAuthenticated" @university_id="setUniversityId" :authenticated="authenticated" :university_id="university_id" />
  </div>
</template>

<script>
  export default {
        name: 'App',
        data() {
            return {
                authenticated: false,
                university_id: ''
            }
        },
        mounted() {
            if(!this.authenticated) {
                this.$router.replace({ name: "login" });
            }
        },
        methods: {
            setAuthenticated(status) {
                this.authenticated = status;
            },
            setUniversityId(id)
            {
              this.university_id = id;
            },
            logout() {
                this.authenticated = false;
            }
        }
    }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
