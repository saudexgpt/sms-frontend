<template>
  <div
    v-loading="load"
    class=""
  >
    <aside>
      <legend>Make Selection</legend>
      <el-row
        :gutter="10"
        class=""
      >
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
        >
          <el-select
            v-model="form.subject_teacher_id"
            placeholder="Select Subject"
            class="span"
            style="width: 100%;"
            filterable
          >
            <el-option
              v-for="(subject_teacher, index) in subject_teachers"
              :key="index"
              :value="subject_teacher.id"
              :label="subject_teacher.subject.code + ' ('+ subject_teacher.class_teacher.c_class.name + ')'"
            />
          </el-select>

        </el-col>
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
        >
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="Pick a date"
            style="width: 100%;"
            :picker-options="datePickerOptions"
            value-format="yyyy-MM-dd"
          />

        </el-col>
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
        >
          <button
            class="btn btn-primary"
            @click="createAttendance()"
          >
            Fetch Attendance List
          </button>

        </el-col>
      </el-row>
    </aside>
    <el-tabs
      v-if="show"
      style="margin-top:15px;"
      type="border-card"
    >
      <el-tab-pane
        v-if="checkPermission(['can view subject attendance']) && can_create"
        label="Take Attendance"
      >
        <legend>{{ date_in_words }}</legend>
        <div v-if="day_of_week == 'Saturday' || day_of_week == 'Sunday'">
          <div class="callout callout-danger">
            Sorry!!! Weekend attendance is not permitted
          </div>
        </div>
        <div
          v-else
          class="editor-container"
        >
          <p>Click on each student to mark as Present/Absent and then SUBMIT</p>
          <!-- <el-row :gutter="5" class="">
            <el-col :xs="24" :sm="20" :md="12" class="el-col-sm-offset-2 el-col-md-offset-6">
              <button class="btn btn-success" @click="storeAttendance()">Submit</button>

            </el-col>
          </el-row> -->
          <div style="height: 400px; overflow: auto">
            <dnd-list
              :unmarked="attendance.absent_students"
              :marked="attendance.present_students"
              :all-students="students"
              unmarked-title="Absent"
              marked-title="Present"
            />
          </div>
          <el-row
            :gutter="20"
            class="demo-inline-spacing"
          >
            <el-col
              :xs="24"
              :sm="20"
              :md="12"
            >
              <button
                class="btn btn-success"
                @click="storeAttendance()"
              >
                Submit Subject Attendance
              </button>

            </el-col>
          </el-row>

        </div>

      </el-tab-pane>
      <el-tab-pane label="View Attendance">
        <legend>{{ month_and_year }}</legend>
        <div class="table-responsive">
          <table
            class="attendance-table table-bordered"
          >
            <thead>
              <tr>
                <th>Date <feather-icon icon="ArrowRightIcon" /><br><feather-icon icon="ArrowDownIcon" />Students </th>

                <th
                  v-for="(date, index) in array_of_date"
                  :key="index"
                  :style="(date === selected_day) ? 'background: #f0f0f0' : ''"
                >
                  {{ date }}
                </th>

              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(student, index) in students"
                :key="index"
              >
                <td align="center">
                  <img
                    :src="baseServerUrl+'storage/'+student.user.photo"
                    alt="..."
                    class="img-circle "
                    width="20"
                  >
                  <p>{{ student.user.first_name+' '+student.user.last_name }}</p>
                </td>
                <td
                  v-for="(date, date_index) in array_of_date"
                  :key="date_index"
                  :style="(date === selected_day) ? 'background: #f0f0f0' : ''"
                >
                  <div v-if="marked_student_array[date]">
                    <feather-icon
                      v-if="checkPresent(student.id, marked_student_array[date])"
                      icon="CheckIcon"
                      style="color: green"
                    />
                    <feather-icon
                      v-else
                      icon="XIcon"
                      style="color: red"
                    />
                  </div>

                </td>

              </tr>

            </tbody>
          </table>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
// import vMultiselectListbox from 'vue-multiselect-listbox'
// import 'vue-multiselect-listbox/dist/vue-multi-select-listbox.css'
import Resource from '@/api/resource'
import DndList from './partials/DndList.vue'
import checkPermission from '@/utils/permission'

const teacherSubjects = new Resource('attendance/subjects')
const attendanceCreate = new Resource('attendance/create/subject')
const attendanceStore = new Resource('attendance/store/subject')
export default {
  components: { DndList },
  data() {
    return {
      load: false,
      subject_teachers: [],
      form: {
        subject_teacher_id: '',
        date: '',
      },
      datePickerOptions: {

        // eslint-disable-next-line consistent-return
        disabledDate(date) {
          if (date > new Date()) {
            return true
          }
        },
      },
      attendance: {
        present_students: [],
        absent_students: [],
      },
      students: [],
      attendance_id: null,
      show: false,
      no_of_days_in_month: 0,
      array_of_date: [],
      marked_student_array: {},
      selected_day: 0,
      day_of_week: '',
      date_in_words: '',
      month_and_year: '',
      can_create: false,

    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchTeacherSubjects()
  },
  methods: {
    checkPermission,
    fetchTeacherSubjects() {
      const app = this
      teacherSubjects.list()
        .then(response => {
          app.subject_teachers = response.subject_teachers
        })
    },
    createAttendance() {
      const app = this
      const param = app.form
      app.load = true
      attendanceCreate.list(param)
        .then(response => {
          app.students = response.students
          app.attendance.absent_students = response.absent_students
          app.attendance.present_students = response.present_students
          app.attendance_id = response.attendance_id
          app.can_create = response.can_create
          app.show = true
          app.no_of_days_in_month = response.no_of_days_in_month
          app.selected_day = response.day
          app.marked_student_array = response.marked_student_array
          app.day_of_week = response.day_of_week
          app.date_in_words = response.date_in_words
          app.month_and_year = response.month_and_year
          app.setUpAttendanceTable()
          app.load = false
        })
    },
    setUpAttendanceTable() {
      const app = this
      app.array_of_date = []
      // eslint-disable-next-line no-plusplus
      for (let index = 1; index <= app.no_of_days_in_month; index++) {
        app.array_of_date.push(index)
      }
    },
    checkPresent(studentId, presentStudentArray) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < presentStudentArray.length; i++) {
        // eslint-disable-next-line radix
        if (parseInt(presentStudentArray[i]) === studentId) {
          return true
        }
      }
      return false
    },
    storeAttendance() {
      const app = this
      const param = app.attendance
      param.subject_teacher_id = app.form.subject_teacher_id
      param.date = app.form.date
      param.attendance_id = app.attendance_id
      app.load = true
      attendanceStore.store(param)
        .then(() => {
          this.$message('Attendance Taken Successfully!!!')
          app.createAttendance()
          app.load = false
        })
    },
  },
}
</script>
<style scoped>
.attendance-table thead th {
  padding: 5px;
}
.attendance-table tbody td {
  padding: 5px;
}
</style>
