<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <slot name="header">
          Roster

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
          <ul>
						<h3>Roster</h3>
						<div v-if="registered_list && registered_list.length == 0">No Students Registered</div>
              <li v-for="student in registered_list" :key="student.university_id">
                  {{student.university_id}}: {{student.first_name}} {{student.last_name}}
              </li>
          </ul>
          <ul>
						<h3 v-show="waitlist && waitlist.length > 0">Waitlist</h3>
              <li v-for="student in waitlist" :key="student.university_id">
                  {{student.university_id}}: {{student.first_name}} {{student.last_name}}
              </li>
          </ul>
        </slot>
       </section>
       <footer class="modal-footer">
          <slot name="footer">
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
    export default {
        name: 'roster',
        props: ['registered_list', 'waitlist'],
        methods: {
            close() {
                this.$emit('close');
            }
        }
    };
</script>

<style>
	ul {
		display: inline-block;
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

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-y: auto;
    display: flex;
    flex-direction:column;
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
		display: flex;
		flex-direction: row;
		align-items: flex-start;
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