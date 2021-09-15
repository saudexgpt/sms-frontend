<template>
  <b-card
    v-if="student"
    no-body
    class="border-primary"
  >
    <b-card-header class="d-flex justify-content-between align-items-center pt-75 pb-25">
      <strong class="mb-1">
        Current Academic Details
      </strong>
      <!-- <b-badge variant="light-primary">
        Basic
      </b-badge>
      <small class="text-muted w-100">July 22, 2021</small> -->
    </b-card-header>
    <b-card-body>
      <table>
        <tr>

          <td>Level: <strong>{{ (student.current_student_level) ? student.current_student_level.level : 'Not Set' }}</strong></td>
        </tr>
        <tr>
          <td>Class: <strong>{{ (student.my_classes.length > 0 ) ? student.my_classes[0].class_teacher.c_class.name : 'Not Set' }}</strong></td>
        </tr>
        <tr>
          <td>Class Teacher: <br><strong>{{ (student.my_classes.length > 0 ) ? student.my_classes[0].class_teacher.staff.user.first_name+' '+student.my_classes[0].class_teacher.staff.user.last_name : 'Not Set' }}</strong></td>
        </tr>
      </table>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardBody,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  directives: {
    Ripple,
  },
  components: {
    BCard,
    BCardHeader,
    BCardBody,
    // BBadge,
    // BButton,
  },
  props: {
    student: {
      type: Object,
      required: true,
      default: () => (null),
    },
  },
}
</script>

<style>

</style>
