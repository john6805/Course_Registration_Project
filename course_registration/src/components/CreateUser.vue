<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <slot name="header">
          Create New User

          <button
            type="button"
            class="btn-close"
            @click="close"
          >
            x
          </button>
        </slot>
      </header>
      <section class="modal-body">
        <slot name="body">
          <input type="text" v-model="input.university_id" placeholder="University ID"/>
          <select v-model="input.position">
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
          </select>
          <input type="text" name="password" v-model="input.password" placeholder="password"/>
          <input type="text" name="password" v-model="input.confirm_password" placeholder="confirm password"/>
          <input type="text" v-model="input.first_name" placeholder="First Name"/>
          <input type="text" v-model="input.last_name" placeholder="Last Name"/>
        </slot>
       </section>
       <footer class="modal-footer">
          <slot name="footer">
            <button type="button" class="button-green" @click="createUser()">>
                Create
            </button>
            <button
              type="button"
              class="button-grey"
              @click="close()"
            >
              Cancel
          </button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script>
    import axios from 'axios'
    import md5 from 'md5'

    export default {
        name: 'modal',
        data: function() {
            return {
                input: {
                    university_id: '',
                    position: 'Student',
                    password: '',
                    confirm_password: '',
                    first_name: '',
                    last_name: ''
                }
            }
        },
        methods: {
            close() {
                this.$emit('close');
            },
            createUser() {
                let self = this;
                if(self.input.university_id == "" || self.input.password == "" || self.input.position == "" || self.input.first_name == "" || self.input.last_name == "")
                {
                    window.alert('Input fields missing!');
                    return;
                }
                if(self.input.password !== self.input.confirm_password)
                {
                    window.alert('Password must match!');
                    return;
                }
                axios.post('http://localhost:8012/create_user',
                {
                    university_id: self.input.university_id.trim(),
                    password: md5(self.input.password.trim()),
                    position: self.input.position.trim(),
                    first_name: self.input.first_name.trim(),
                    last_name: self.input.last_name.trim()
                }).then(() => {
                        //authentiated
                    self.$emit("university_id", self.input.university_id);
                    self.$emit("password", self.input.password);
                    self.close();
                });
            }
        },
    };
</script>

<style>
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

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
  }

  .btn-close {
    border: none;
    font-size: 20px;
    padding: 20px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }
</style>