<template>
  <div>
    <div v-if="students_in_class.length > 0">
      <h3>List of duplicate students in different classes. Delete the incorrect entry</h3>
      <v-client-table
        v-model="students_in_class"
        v-loading="loading"
        :columns="columns"
        :options="options"
      >
        <template
          slot="student.registration_no"
          slot-scope="props"
        >
          <div
            align="center"
          >
            <img
              align="center"
              :src="baseServerUrl +'storage/'+ props.row.student.user.photo"
              alt="Photo"
              width="70"
            >
            <p>{{ props.row.student.registration_no }}</p>
          </div>
        </template>
        <div
          slot="action"
          slot-scope="props"
        >
          <span
            v-if="checkPermission(['can manage student'])"
          >
            <b-button
              v-b-tooltip.hover.right="'Remove Duplicate Entry'"
              variant="danger"
              class="btn-icon rounded-circle"
              @click="removeDuplicateStudent(props.row)"
            >
              <feather-icon icon="TrashIcon" />
            </b-button>
          </span>
        </div>
      </v-client-table>
    </div>
    <div v-else>
      <h3>No Duplicate Student Exists</h3>
    </div>
  </div>
</template>
<script>
import {
  BButton, VBTooltip,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkPermission from '@/utils/permission'
import Resource from '@/api/resource'

export default {
  components: {
    BButton,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  data() {
    return {
      students_in_class: [],
      loading: false,
      columns: [
        'action',
        'student.registration_no',
        'student.user.last_name',
        'student.user.first_name',
        'student.user.gender',
        'student.user.dob',
        'class_teacher.c_class.name',
        'student.admission_year',
      ],

      options: {
        headings: {
          'student.registration_no': 'Admission No',
          'student.user.last_name': 'Surname',
          'student.user.first_name': 'Other Names',
          'student.user.gender': 'Gender',
          'student.user.dob': 'DOB',
          'class_teacher.c_class.name': 'Class',
          'student.admission_year': 'Admission Year',
          action: '',

          // id: 'S/N',
        },

        rowAttributesCallback(row) {
          if (row.student.studentship_status === 'left') {
            return { style: 'background: #d83b3beb; color: #000000' }
          }
          if (row.student.studentship_status === 'suspended') {
            return { style: 'background: #dfbe5d; color: #000000' }
          }
          // if (row.student.studentship_status === 'graduated') {
          //   return { style: 'background: #6610f2; color: #ffffff' }
          // }
          return { style: 'background: #36c15ecf; color: #000000' }
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        // filterByColumn: true,
        sortable: [
          'student.registration_no',
          'student.user.last_name',
          'student.user.first_name',
          'student.user.gender',
          'student.user.dob',
          'class_teacher.c_class.name',
          'student.admission_year',
        ],
        // filterable: false,
        filterable: [
          'student.registration_no',
          'student.user.last_name',
          'student.user.first_name',
          'student.user.gender',
          'student.user.dob',
          'class_teacher.c_class.name',
          'student.admission_year',
        ],
      },
      selectedStudent: null,
      selectedUser: '',
      isUploadPhotoSidebarActive: false,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchDuplicateStudents()
  },
  methods: {
    fetchDuplicateStudents() {
      const app = this
      const fetchStudentResource = new Resource('user-setup/duplicate-students')
      fetchStudentResource.list()
        .then(response => {
          app.students_in_class = response.duplicate_students_in_class
        })
    },
    checkPermission,
    removeDuplicateStudent(data) {
      const app = this
      app.$confirm(`This will remove ${data.student.user.username} from ${data.class_teacher.c_class.name} and all records tied to this entry. Do you want to continue?`, 'Confirm Action', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        app.loading = true
        const removeDuplicateResource = new Resource('user-setup/remove-duplicate-student')
        removeDuplicateResource.destroy(data.id)
          .then(() => {
            app.$message('Action Successfull')
            app.fetchDuplicateStudents()
            app.loading = false
          })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: 'Delete canceled',
        // })
      })
    },
  },
}
</script>
