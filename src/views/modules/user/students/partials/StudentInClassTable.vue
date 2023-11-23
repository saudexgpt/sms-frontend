<template>
  <div>
    <div v-if="selectedStudent === null">
      <b-tabs
        pills
        nav-class="nav-pill-danger"
      >
        <b-tab
          :title="`Active (${activefilteredStudents.length})`"
        >
          <span class="pull-right">
            <el-button
              v-if="activefilteredStudents.length > 0"
              :loading="downloadLoading"
              style="margin:0 0 20px 20px;"
              type="primary"
              icon="document"
              @click="handleDownload('List of Active Students', activefilteredStudents)"
            >Export Excel</el-button>
          </span>

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
                    onerror="this.src='/images/profile-image.png'"
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
              <b-dropdown
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                class="mx-1"
                right
                text="Action"
                variant="primary"
              >
                <b-dropdown-item>
                  <router-link
                    :to="{name: 'studentDetails', params: {id: props.row.student.id}}"
                  >
                    <span><feather-icon icon="EyeIcon" /> View Details</span>
                  </router-link>
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="checkPermission(['can manage student'])"
                  @click="editStudent(props.row)"
                >
                  <span><feather-icon icon="Edit2Icon" /> Edit</span>
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="checkPermission(['can manage student'])"
                  @click="resetPassword(props.row.student.user)"
                >
                  <span><feather-icon icon="UnlockIcon" /> Reset Password</span>
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="checkPermission(['can manage student'])"
                  @click="loginAsUser(props.row.student.user)"
                >
                  <span v-b-tooltip.hover.right="'Login as ' + props.row.student.user.first_name"><feather-icon icon="KeyIcon" /> Login</span>
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </v-client-table>
        </b-tab>
        <b-tab
          :title="`Suspended (${suspendedfilteredStudents.length})`"
        >
          <span class="pull-right">
            <el-button
              v-if="suspendedfilteredStudents.length > 0"
              :loading="downloadLoading"
              style="margin:0 0 20px 20px;"
              type="primary"
              icon="document"
              @click="handleDownload('List of Suspended Students', suspendedfilteredStudents)"
            >Export Excel</el-button>
          </span>
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
                    onerror="this.src='/images/profile-image.png'"
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
            <!-- <div
              slot="action"
              slot-scope="props"
            >
              <b-dropdown
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                class="mx-1"
                right
                text="Action"
                variant="primary"
              >
                <b-dropdown-item>
                  <router-link
                    :to="{name: 'studentDetails', params: {id: props.row.student.id}}"
                  >
                    <span><feather-icon icon="EyeIcon" /> View Details</span>
                  </router-link>
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="checkPermission(['can manage student'])"
                  @click="editStudent(props.row)"
                >
                  <span><feather-icon icon="Edit2Icon" /> Edit</span>
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="checkPermission(['can manage student'])"
                  @click="resetPassword(props.row.student.user)"
                >
                  <span><feather-icon icon="UnlockIcon" /> Reset Password</span>
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="checkPermission(['can manage student'])"
                  @click="loginAsUser(props.row.student.user)"
                >
                  <span v-b-tooltip.hover.right="'Login as ' + props.row.student.user.first_name"><feather-icon icon="KeyIcon" /> Login</span>
                </b-dropdown-item>
                <b-dropdown-item @click="removeStaff(props.row)">
                  <span v-b-tooltip.hover.right="'Delete ' + props.row.user.first_name"><feather-icon icon="TrashIcon" /> Delete</span>
                </b-dropdown-item>
              </b-dropdown>
            </div> -->
          </v-client-table>
        </b-tab>
        <b-tab
          :title="`Withdrawn (${withdrawnfilteredStudents.length})`"
        >
          <span class="pull-right">
            <el-button
              v-if="withdrawnfilteredStudents.length > 0"
              :loading="downloadLoading"
              style="margin:0 0 20px 20px;"
              type="primary"
              icon="document"
              @click="handleDownload('List of Withdrawn Students', withdrawnfilteredStudents)"
            >Export Excel</el-button>
          </span>
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
                    onerror="this.src='/images/profile-image.png'"
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
            <!-- <div
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
            </div> -->
          </v-client-table>
        </b-tab>
        <b-tab
          :title="`Pending Activation (${unapprovedStudents.length})`"
        >
          <span class="pull-right">
            <el-button
              v-if="unapprovedStudents.length > 0"
              :loading="downloadLoading"
              style="margin:0 0 20px 20px;"
              type="primary"
              icon="document"
              @click="handleDownload('List of Registered Students awaiting activation', unapprovedStudents)"
            >Export Excel</el-button>
          </span>
          <v-client-table
            v-model="unapprovedStudents"
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
                    onerror="this.src='/images/profile-image.png'"
                  >
                  <p>{{ props.row.student.registration_no }}</p>
                </div>
              </el-tooltip>
            </template>
            <div
              slot="studentship_status"
            >
              <!-- <el-select
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
                {{ (props.row.student.studentship_status === 'left') ? 'WITHDRAWN' : props.row.student.studentship_status.toUpperCase() }}</span> -->
              Pending Activation
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
              <b-dropdown
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                class="mx-1"
                right
                text="Action"
                variant="primary"
              >
                <b-dropdown-item>
                  <router-link
                    :to="{name: 'studentDetails', params: {id: props.row.student.id}}"
                  >
                    <span><feather-icon icon="EyeIcon" /> View Details</span>
                  </router-link>
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="checkPermission(['can manage student'])"
                  @click="editStudent(props.row)"
                >
                  <span><feather-icon icon="Edit2Icon" /> Edit</span>
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="checkPermission(['can manage student'])"
                  @click="approve(props.row.student.user)"
                >
                  <span v-b-tooltip.hover.right="'Activate account for ' + props.row.student.user.first_name"><feather-icon icon="ThumbsUpIcon" /> Activate</span>
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </v-client-table>
        </b-tab>
      </b-tabs>
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
  VBTooltip, BDropdown, BDropdownItem, BTabs, BTab,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkPermission from '@/utils/permission'
import Resource from '@/api/resource'
import UploadPhoto from '@/views/modules/user/UploadPhoto.vue'
import EditStudent from './EditStudent.vue'

export default {
  components: {
    EditStudent, UploadPhoto, BDropdown, BDropdownItem, BTabs, BTab,
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
      unapprovedStudents: [],
      statuses: [
        { label: 'ACTIVE', value: 'active' },
        { label: 'SUSPENDED', value: 'suspended' },
        { label: 'WITHDRAWN', value: 'left' },
      ],
      loading: false,
      downloadLoading: false,
      columns: [
        'studentship_status',
        'student.registration_no',
        'student.user.last_name',
        'student.user.first_name',
        'student.user.gender',
        // 'student.user.dob',
        'class_teacher.c_class.name',
        // 'student.admission_year',
        // 'parent_name',
        // 'parent_phone',
        // 'parent_email',
        'action',
      ],

      options: {
        headings: {
          studentship_status: 'Studentship Status',
          'student.registration_no': 'Admission No',
          'student.user.last_name': 'Surname',
          'student.user.first_name': 'Other Names',
          'student.user.gender': 'Gender',
          // 'student.user.dob': 'DOB',
          'class_teacher.c_class.name': 'Class',
          // 'student.admission_year': 'Admission Year',
          // parent_name: 'Parent Name',
          // parent_phone: 'Parent Phone',
          // parent_email: 'Parent Email',
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
      app.unapprovedStudents = []
      app.studentsInClass.forEach(element => {
        if (element.student !== null) {
          app.filteredStudents.push(element)
          if (element.student.user.is_confirmed === '0') {
            app.unapprovedStudents.push(element)
          }
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
    approve(user) {
      const app = this
      app.$confirm(`This will activate ${user.username}'s account. Do you want to continue?`, 'Confirm Activation', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        app.loading = true
        const resetPasswordResource = new Resource('user-setup/approve-user')
        resetPasswordResource.update(user.id)
          .then(() => {
            app.$alert('Account activation successful', 'Successful', {
              confirmButtonText: 'OK',
            })
            app.$emit('reload')
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
        this.$message(` ${event} action successful`)
        this.$emit('reload', response)
      })
    },
    handleDownload(tableTitle, studentList) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const multiHeader = [[tableTitle, '', '', '', '', '', '', '', '', '', '']]
        const tHeader = [
          // 'STUDENTSHIP STATUS',
          'ADMISSION NO',
          'SURNAME',
          'OTHER NAMES',
          'GENDER',
          'DOB',
          'CURRENT CLASS',
          'ADMISSION YR',
          'PARENT/GUARDIAN NAME',
          'PARENT/GUARDIAN PHONE',
          'PARENT/GUARDIAN EMAIL',
        ]
        const filterVal = [
          // 'studentship_status',
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
        ]
        const list = studentList
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          multiHeader,
          header: tHeader,
          data,
          filename: tableTitle,
          autoWidth: true,
          bookType: 'csv',
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        // if (j === 'studentship_status') {
        //   return (v.student.studentship_status === 'left') ? 'WITHDRAWN' : v.student.studentship_status.toUpperCase()
        // }
        if (j === 'student.registration_no') {
          return v.student.registration_no
        }
        if (j === 'student.user.last_name') {
          return v.student.user.last_name
        }
        if (j === 'student.user.first_name') {
          return v.student.user.first_name
        }
        if (j === 'student.user.gender') {
          return v.student.user.gender
        }
        if (j === 'student.user.dob') {
          return v.student.user.dob
        }
        if (j === 'class_teacher.c_class.name') {
          return v.class_teacher.c_class.name
        }
        if (j === 'student.admission_year') {
          return v.student.admission_year
        }
        if (j === 'parent_name') {
          return (v.student.student_guardian.guardian.user) ? `${v.student.student_guardian.guardian.user.first_name} ${v.student.student_guardian.guardian.user.last_name}` : ''
        }
        if (j === 'parent_phone') {
          return (v.student.student_guardian.guardian.user) ? `${v.student.student_guardian.guardian.user.phone1}, ${v.student.student_guardian.guardian.user.phone2}` : ''
        }
        if (j === 'parent_email') {
          return (v.student.student_guardian.guardian.user) ? `${v.student.student_guardian.guardian.user.email}` : ''
        }

        return v[j]
      }))
    },
  },
}
</script>
