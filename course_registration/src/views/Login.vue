<template>
    <div id="login">
        <h1>Login</h1>
        <input type="text" name="university_id" v-model="input.university_id" placeholder="University_id" />
        <input type="password" name="password" v-model="input.password" placeholder="Password" />
        <button type="button" v-on:click="login()">Login</button>
        <button type="button" v-on:click="createNewUser()">Create New User</button>
        <modal v-show="createUser" @close="closeModal()" />
    </div>
</template>

<script>
//Found at https://www.thepolyglotdeveloper.com/2018/04/simple-user-login-vuejs-web-application/
    import axios from 'axios';
    import md5 from 'md5';
    import modal from '../components/CreateUser.vue';

    export default {
        name: 'Login',
        data() {
            return {
                input: {
                    university_id: "",
                    password: ""
                },
                createUser: false
            }
        },
        components: {
            modal
        },
        methods: {
            login() {
                const self = this;

                if(this.input.university_id == "" || this.input.password == "")
                {
                    window.alert('Must enter a user id and password!');
                }
                else
                {
                    axios.post('http://localhost:8012/check_user',
                    {
                        university_id: self.input.university_id,
                        password: md5(self.input.password)
                    }).then((response) => {
                        if(response.data.auth)
                        {
                            //authentiated
                            self.$emit("authenticated", true);
                            self.$emit("user_info", response.data.user_info);
                            self.$router.replace({ 
                                path: "/home", 
                                params: {
                                    user_info: response.data.user_info
                                }
                            });
                        }
                        else
                        {
                            //not authenticated
                            window.alert('Invalid ID or Password');
                        }
                    });
                }
            },
            createNewUser() {
                this.createUser = true;
            },
            closeModal() {
                this.createUser = false;
            }
        }
    }
</script>
