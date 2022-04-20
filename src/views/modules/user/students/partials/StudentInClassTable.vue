<template>
  <div v-if="filteredStudents.length > 0">
    <div v-if="selectedStudent === null">
      <el-tabs>
        <el-tab-pane
          label="Active"
        >

          <v-client-table
            v-model="activefilteredStudents"
            v-loading="loading"
            :columns="columns"
            :options="options"
          >
            <template
              slot="student.registration_no"
              slot-scope="props"
            >
              <el-tooltip
                class="item"
                effect="dark"
                content="Click to change photo"
                placement="bottom-start"
              >
                <div
                  align="center"
                  @click="changePhoto(props.index, props.row.student.user)"
                >
                  <img
                    align="center"
                    :src="baseServerUrl +'storage/'+ props.row.student.user.photo"
                    alt="Photo"
                    width="70"
                  >
                  <p>{{ props.row.student.registration_no }}</p>
                </div>
              </el-tooltip>
            </template>
            <div
              slot="studentship_status"
              slot-scope="props"
            >
              <el-select
                v-if="checkPermission(['can manage student'])"
                v-model="props.row.student.studentship_status"
                style="width: 100%"
                @input="toggleStudentshipStatus($event, props.row.student_id, props.index)"
              >
                <el-option
                  v-for="(status, index) in statuses"
                  :key="index"
                  :label="status.label"
                  :value="status.value"
                />
              </el-select>
              <span v-else>
                {{ (props.row.student.studentship_status === 'left') ? 'WITHDRAWN' : props.row.student.studentship_status.toUpperCase() }}</span>
            </div>
            <div
              slot="parent_name"
              slot-scope="{row}"
            >
              <div v-if="row.student.student_guardian !== null">
                {{ (row.student.student_guardian.guardian.user) ? row.student.student_guardian.guardian.user.first_name + ' ' + row.student.student_guardian.guardian.user.last_name : '' }}
              </div>
            </div>
            <div
              slot="parent_phone"
              slot-scope="{row}"
            >
              <div v-if="row.student.student_guardian !== null">
                {{ (row.student.student_guardian.guardian.user) ? row.student.student_guardian.guardian.user.phone1 + ', ' + row.student.student_guardian.guardian.user.phone2 : '' }}
              </div>
            </div>
            <div
              slot="parent_email"
              slot-scope="{row}"
            >
              <div v-if="row.student.student_guardian !== null">
                {{ (row.student.student_guardian.guardian.user) ? row.student.student_guardian.guardian.user.email : '' }}
              </div>
            </div>
            <div
              slot="action"
              slot-scope="props"
            >
              <span>
                <b-button
                  v-b-tooltip.hover.right="'View Details'"
                  variant="primary"
                  class="btn-icon rounded-circle"
                >

                  <router-link
                    :to="{name: 'studentDetails', params: {id: props.row.student.id}}"
                    style="color: #fff;"
                  ><feather-icon icon="EyeIcon" /></router-link>
                </b-button>
              </span>
              <span v-if="checkPermission(['can manage student'])">
                <b-button
                  v-b-tooltip.hover.right="'Edit ' + props.row.student.user.first_name +' data'"
                  variant="info"
                  class="btn-icon rounded-circle"
                  @click="editStudent(props.row)"
                ><feather-icon icon="Edit2Icon" />
                </b-button>
              </span>
              <span
                v-if="checkPermission(['can manage student'])"
              >
                <b-button
                  v-b-tooltip.hover.right="'Reset Password'"
                  variant="warning"
                  class="btn-icon rounded-circle"
                  @click="resetPassword(props.row.student.user)"
                >
                  <feather-icon icon="UnlockIcon" />
                </b-button>
              </span>
              <span
                v-if="checkPermission(['can manage student'])"
              >
                <b-button
                  v-b-tooltip.hover.right="'Login as ' + props.row.student.user.first_name"
                  variant="dark"
                  class="btn-icon rounded-circle"
                  @click="loginAsUser(props.row.student.user)"
                >
                  <feather-icon icon="KeyIcon" />
                </b-button>
              </span>
            </div>
          </v-client-table>
        </el-tab-pane>
        <el-tab-pane
          label="Suspended"
        >
          <v-client-table
            v-model="suspendedfilteredStudents"
            v-loading="loading"
            :columns="columns"
            :options="options"
          >
            <template
              slot="student.registration_no"
              slot-scope="props"
            >
              <el-tooltip
                class="item"
                effect="dark"
                content="Click to change photo"
                placement="bottom-start"
              >
                <div
                  align="center"
                  @click="changePhoto(props.index, props.row.student.user)"
                >
                  <img
                    align="center"
                    :src="baseServerUrl +'storage/'+ props.row.student.user.photo"
                    alt="Photo"
                    width="70"
                  >
                  <p>{{ props.row.student.registration_no }}</p>
                </div>
              </el-tooltip>
            </template>
            <div
              slot="studentship_status"
              slot-scope="props"
            >
              <el-select
                v-if="checkPermission(['can manage student'])"
                v-model="props.row.student.studentship_status"
                style="width: 100%"
                @input="toggleStudentshipStatus($event, props.row.student_id, props.index)"
              >
                <el-option
                  v-for="(status, index) in statuses"
                  :key="index"
                  :label="status.label"
                  :value="status.value"
                />
              </el-select>
              <span v-else>
                {{ (props.row.student.studentship_status === 'left') ? 'WITHDRAWN' : props.row.student.studentship_status.toUpperCase() }}</span>
            </div>
            <div
              slot="parent_name"
              slot-scope="{row}"
            >
              <div v-if="row.student.student_guardian !== null">
                {{ (row.student.student_guardian.guardian.user) ? row.student.student_guardian.guardian.user.first_name + ' ' + row.student.student_guardian.guardian.user.last_name : '' }}
              </div>
            </div>
            <div
              slot="parent_phone"
              slot-scope="{row}"
            >
              <div v-if="row.student.student_guardian !== null">
                {{ (row.student.student_guardian.guardian.user) ? row.student.student_guardian.guardian.user.phone1 + ', ' + row.student.student_guardian.guardian.user.phone2 : '' }}
              </div>
            </div>
            <div
              slot="parent_email"
              slot-scope="{row}"
            >
              <div v-if="row.student.student_guardian !== null">
                {{ (row.student.student_guardian.guardian.user) ? row.student.student_guardian.guardian.user.email : '' }}
              </div>
            </div>
            <div
              slot="action"
              slot-scope="props"
            >
              <span>
                <b-button
                  v-b-tooltip.hover.right="'View Details'"
                  variant="primary"
                  class="btn-icon rounded-circle"
                >

                  <router-link
                    :to="{name: 'studentDetails', params: {id: props.row.student.id}}"
                    style="color: #fff;"
                  ><feather-icon icon="EyeIcon" /></router-link>
                </b-button>
              </span>
              <span v-if="checkPermission(['can manage student'])">
                <b-button
                  v-b-tooltip.hover.right="'Edit ' + props.row.student.user.first_name +' data'"
                  variant="info"
                  class="btn-icon rounded-circle"
                  @click="editStudent(props.row)"
                ><feather-icon icon="Edit2Icon" />
                </b-button>
              </span>
              <span
                v-if="checkPermission(['can manage student'])"
              >
                <b-button
                  v-b-tooltip.hover.right="'Reset Password'"
                  variant="warning"
                  class="btn-icon rounded-circle"
                  @click="resetPassword(props.row.student.user)"
                >
                  <feather-icon icon="UnlockIcon" />
                </b-button>
              </span>
              <span
                v-if="checkPermission(['can manage student'])"
              >
                <b-button
                  v-b-tooltip.hover.right="'Login as ' + props.row.student.user.first_name"
                  variant="dark"
                  class="btn-icon rounded-circle"
                  @click="loginAsUser(props.row.student.user)"
                >
                  <feather-icon icon="KeyIcon" />
                </b-button>
              </span>
            </div>
          </v-client-table>
        </el-tab-pane>
        <el-tab-pane
          label="Withdrawn"
        >
          <v-client-table
            v-model="withdrawnfilteredStudents"
            v-loading="loading"
            :columns="columns"
            :options="options"
          >
            <template
              slot="student.registration_no"
              slot-scope="props"
            >
              <el-tooltip
                class="item"
                effect="dark"
                content="Click to change photo"
                placement="bottom-start"
              >
                <div
                  align="center"
                  @click="changePhoto(props.index, props.row.student.user)"
                >
                  <img
                    align="center"
                    :src="baseServerUrl +'storage/'+ props.row.student.user.photo"
                    alt="Photo"
                    width="70"
                  >
                  <p>{{ props.row.student.registration_no }}</p>
                </div>
              </el-tooltip>
            </template>
            <div
              slot="studentship_status"
              slot-scope="props"
            >
              <el-select
                v-if="checkPermission(['can manage student'])"
                v-model="props.row.student.studentship_status"
                style="width: 100%"
                @input="toggleStudentshipStatus($event, props.row.student_id, props.index)"
              >
                <el-option
                  v-for="(status, index) in statuses"
                  :key="index"
                  :label="status.label"
                  :value="status.value"
                />
              </el-select>
              <span v-else>
                {{ (props.row.student.studentship_status === 'left') ? 'WITHDRAWN' : props.row.student.studentship_status.toUpperCase() }}</span>
            </div>
            <div
              slot="parent_name"
              slot-scope="{row}"
            >
              <div v-if="row.student.student_guardian !== null">
                {{ (row.student.student_guardian.guardian.user) ? row.student.student_guardian.guardian.user.first_name + ' ' + row.student.student_guardian.guardian.user.last_name : '' }}
              </div>
            </div>
            <div
              slot="parent_phone"
              slot-scope="{row}"
            >
              <div v-if="row.student.student_guardian !== null">
                {{ (row.student.student_guardian.guardian.user) ? row.student.student_guardian.guardian.user.phone1 + ', ' + row.student.student_guardian.guardian.user.phone2 : '' }}
              </div>
            </div>
            <div
              slot="parent_email"
              slot-scope="{row}"
            >
              <div v-if="row.student.student_guardian !== null">
                {{ (row.student.student_guardian.guardian.user) ? row.student.student_guardian.guardian.user.email : '' }}
              </div>
            </div>
            <div
              slot="action"
              slot-scope="props"
            >
              <span>
                <b-button
                  v-b-tooltip.hover.right="'View Details'"
                  variant="primary"
                  class="btn-icon rounded-circle"
                >

                  <router-link
                    :to="{name: 'studentDetails', params: {id: props.row.student.id}}"
                    style="color: #fff;"
                  ><feather-icon icon="EyeIcon" /></router-link>
                </b-button>
              </span>
              <span v-if="checkPermission(['can manage student'])">
                <b-button
                  v-b-tooltip.hover.right="'Edit ' + props.row.student.user.first_name +' data'"
                  variant="info"
                  class="btn-icon rounded-circle"
                  @click="editStudent(props.row)"
                ><feather-icon icon="Edit2Icon" />
                </b-button>
              </span>
              <span
                v-if="checkPermission(['can manage student'])"
              >
                <b-button
                  v-b-tooltip.hover.right="'Reset Password'"
                  variant="warning"
                  class="btn-icon rounded-circle"
                  @click="resetPassword(props.row.student.user)"
                >
                  <feather-icon icon="UnlockIcon" />
                </b-button>
              </span>
              <span
                v-if="checkPermission(['can manage student'])"
              >
                <b-button
                  v-b-tooltip.hover.right="'Login as ' + props.row.student.user.first_name"
                  variant="dark"
                  class="btn-icon rounded-circle"
                  @click="loginAsUser(props.row.student.user)"
                >
                  <feather-icon icon="KeyIcon" />
                </b-button>
              </span>
            </div>
          </v-client-table>
        </el-tab-pane>
      </el-tabs>
      <upload-photo
        v-if="isUploadPhotoSidebarActive"
        v-model="isUploadPhotoSidebarActive"
        :user="selectedUser"
        @save="updatePhoto"
      />
    </div>
    <div v-else>
      <el-button
        type="danger"
        @click="selectedStudent = null"
      >
        Go Back
      </el-button>
      <edit-student
        v-if="level"
        :student-in-class="selectedStudent"
        :selected-level="level"
        @update="reloadTable()"
      />
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
import EditStudent from './EditStudent.vue'
import UploadPhoto from '@/views/modules/user/UploadPhoto.vue'

export default {
  components: {
    BButton, EditStudent, UploadPhoto,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  props: {
    studentsInClass: {
      type: Array,
      default: () => [],
    },
    level: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      filteredStudents: [],
      activefilteredStudents: [],
      suspendedfilteredStudents: [],
      withdrawnfilteredStudents: [],
      statuses: [
        { label: 'ACTIVE', value: 'active' },
        { label: 'SUSPENDED', value: 'suspended' },
        { label: 'WITHDRAWN', value: 'left' },
      ],
      loading: false,
      columns: [
        'action',
        'studentship_status',
        'student.registration_no',
        'student.user.last_name',
        'student.user.first_name',
        'student.user.gender',
        'student.user.dob',
        'class_teacher.c_class.name',
        'student.admission_year',
        'parent_name',
        'parent_phone',
        'parent_email',
      ],

      options: {
        headings: {
          studentship_status: 'Studentship Status',
          'student.registration_no': 'Admission No',
          'student.user.last_name': 'Surname',
          'student.user.first_name': 'Other Names',
          'student.user.gender': 'Gender',
          'student.user.dob': 'DOB',
          'class_teacher.c_class.name': 'Class',
          'student.admission_year': 'Admission Year',
          parent_name: 'Parent Name',
          parent_phone: 'Parent Phone',
          parent_email: 'Parent Email',
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
          'parent_name',
          'parent_email',
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
          'parent_name',
          'parent_phone',
          'parent_email',
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
    this.filterActiveStudents()
  },
  methods: {
    filterActiveStudents() {
      const app = this
      app.filteredStudents = []
      app.withdrawnfilteredStudents = []
      app.suspendedfilteredStudents = []
      app.activefilteredStudents = []
      app.studentsInClass.forEach(element => {
        if (element.student !== null) {
          app.filteredStudents.push(element)
          if (element.student.studentship_status === 'left') {
            app.withdrawnfilteredStudents.push(element)
          }
          if (element.student.studentship_status === 'suspended') {
            app.suspendedfilteredStudents.push(element)
          }
          if (element.student.studentship_status === 'active') {
            app.activefilteredStudents.push(element)
          }
        }
      })
    },
    checkPermission,
    resetPassword(user) {
      const app = this
      const param = {
        user_id: user.id,
      }
      app.$confirm(`This will change the password for ${user.username}. Do you want to continue?`, 'Confirm Action', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        app.loading = true
        const resetPasswordResource = new Resource('user-setup/admin-reset/password')
        resetPasswordResource.list(param)
          .then(() => {
            app.$alert(`Password for ${user.username} has been reset to: password `, 'Password Reset', {
              confirmButtonText: 'OK',
            })
            app.loading = false
          })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: 'Delete canceled',
        // })
      })
    },
    async loginAsUser(user) {
      await this.$store.dispatch('user/loginAsUser', { user_id: user.id })
      // this.$router.push('/login').catch(() => {})
      window.location = '/'
    },
    editStudent(value) {
      // console.log(props)
      const app = this
      app.selectedStudent = value
      app.isEditClassSidebarActive = true
    },
    reloadTable() {
      this.selectedStudent = null
      this.$emit('reload')
    },
    updatePhoto(photo) {
      const app = this
      app.filteredStudents[app.selected_index - 1].student.user.photo = photo
    },
    changePhoto(index, user) {
      const app = this
      app.selected_index = index
      app.selectedUser = user
      app.isUploadPhotoSidebarActive = true
    },
    toggleStudentshipStatus(event, studentId, index) {
      console.log(index)
      const param = { status: event }
      const changeStudentStatus = new Resource('user-setup/toggle-studentship-status')
      changeStudentStatus.update(studentId, param).then(response => {
        this.$emit('reload', response)
      })
    },
  },
}
</script>
