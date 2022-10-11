<template>
  <div v-loading="load">
    <div
      v-if="!show_upload_form && create_new && !view_students"
      class="box primary"
    >
      <div class="box-header bg-blue">
        <h4 class="box-title">
          Set Online Classroom on {{ subjectTeacher.subject.name }} ({{
            subjectTeacher.class_teacher.c_class.name
          }}) for {{ dayInWords }}
        </h4>

        <span
          class="pull-right"
        ><a
          class="btn btn-warning fa fa-eye"
          @click="create_new = false"
        >
          View All Classes</a></span>
      </div>
      <div class="box-body">
        <form @submit.prevent="saveClass()">
          <div class="col-md-12">
            <label for="">Topic for this class</label>
            <input
              v-model="form.topic"
              type="text"
              class="form-control"
              placeholder="Example: Introduction of Computer"
              required
            >
          </div>
          <div class="col-md-12">
            <label for="">Brief description of topic</label>
            <textarea
              v-model="form.description"
              placeholder="Example: Computer is an electronic machine that accepts data...and so on"
              cols="30"
              rows="3"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-12">
            <label for="">Date of class</label>
            <el-date-picker
              v-model="form.date"
              :picker-options="pickerOptions"
              type="date"
              format="yyyy/MM/dd"
              value-format="yyyy-MM-dd"
              placeholder="Pick a day"
            />
            <!-- <input
              v-model="form.date"
              type="date"
              class="form-control"
              required
            > -->
          </div>

          <div class="col-md-6">
            <p />
            <button
              type="submit"
              class="btn btn-success"
            >
              <i class="fa fa-save" /> Create E-Classroom
            </button>
          </div>
        </form>
      </div>
    </div>
    <div
      v-if="!show_upload_form && !create_new && !view_students"
      class="box primary"
    >
      <div class="box-header">
        <h4 class="box-title">
          Created Online Classes on {{ subjectTeacher.subject.name }} ({{
            subjectTeacher.class_teacher.c_class.name
          }})
        </h4>
        <span
          class="pull-right"
        ><a
          class="btn btn-success fa fa-plus"
          @click="create_new = true"
        >
          New Online Class</a></span>
      </div>
      <div class="box-body">
        <v-client-table
          :data="subjectTeacher.daily_classrooms"
          :columns="columns"
          :options="options"
        >
          <template
            slot="action"
            slot-scope="props"
          >
            <a
              class="btn btn-primary"
              @click="uploadResources(props.row)"
            ><i class="fa fa-upload" /> Upload Resources</a>
            <a
              class="btn btn-success"
              @click="viewStudents(props.row)"
            ><i class="fa fa-users" /> Join Online Class</a>
            <a
              class="btn btn-danger"
              @click="deleteClass(props.index, props.row.id)"
            ><i class="fa fa-trash" /> Delete</a>
          </template>
        </v-client-table>
      </div>
    </div>
    <div v-if="show_upload_form && !view_students">
      <a
        class="btn btn-default pull-right"
        @click="show_upload_form = false"
      >
        Cancel</a>
      <upload-learning-resources
        :daily-classroom="daily_classroom"
        :showform="true"
      />
    </div>

    <div v-if="view_students">
      <div class="col-md-12">
        <a
          class="btn btn-default pull-right"
          @click="view_students = false"
        >
          Cancel</a>
      </div>
      <view-online-students
        :daily-classroom="daily_classroom"
        :query-string="query_string"
      />
    </div>
  </div>
</template>
<script>
import UploadLearningResources from './UploadLearningResources-new.vue'
import ViewOnlineStudents from './ViewOnlineStudents.vue'
import Resource from '@/api/resource'

export default {
  components: { UploadLearningResources, ViewOnlineStudents },
  props: {
    subjectTeacher: {
      type: Object,
      default: () => ({}),
    },
    day: {
      type: String,
      default: () => (''),
    },
    dayInWords: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < (Date.now() - 3600 * 1000 * 24)
        },
      },
      columns: ['topic', 'date', 'duration', 'start', 'end', 'action'],
      options: {
        headings: {
          topic: 'Topic',
          duration: 'Duration (in minutes)',

          date: 'Date of Class',
          action: 'Action',
        },
        sortable: ['topic', 'date'],
        filterable: ['topic', 'date'],
      },
      form: {
        topic: '',
        description: '',
        date: '',
        subject_teacher_id: this.subjectTeacher.id,
        class_teacher_id: this.subjectTeacher.class_teacher_id,
        day: this.day,
      },
      empty_form: {
        topic: '',
        description: '',
        date: '',
        subject_teacher_id: this.subjectTeacher.id,
        class_teacher_id: this.subjectTeacher.class_teacher_id,
        day: this.day,
      },
      daily_classroom: '',
      show_upload_form: false,
      create_new: false,
      view_students: false,
      query_string: '',
      load: false,
    }
  },
  methods: {
    saveClass() {
      const app = this
      const param = app.form
      const createOnlineClassResource = new Resource('lms/create-online-class')
      app.load = true
      createOnlineClassResource
        .store(param) // back end route from web.php
        .then(response => {
          app.load = false
          app.$message('Class Created')
          app.subjectTeacher.daily_classrooms.push(
            response.daily_classroom,
          )
          app.form = app.empty_form
          app.create_new = false
        })
    },
    uploadResources(dailyClassroom) {
      const app = this
      app.daily_classroom = dailyClassroom
      app.show_upload_form = true
    },
    viewStudents(dailyClassroom) {
      const app = this
      app.daily_classroom = dailyClassroom
      const name = 'Teacher'
      app.query_string = `?open=true&sessionid=${
        dailyClassroom.subject_teacher_id
      }&publicRoomIdentifier=dashboard&userFullName=${
        name}`
      app.view_students = true
    },

    deleteClass(index, id) {
      const message = 'Are you sure you want to delete this class?'

      // eslint-disable-next-line no-alert
      if (window.confirm(message)) {
        const app = this
        app.load = true
        const deleteOnlineClassResource = new Resource('lms/delete-onlineclass')
        deleteOnlineClassResource
          .destroy(id) // back end route from web.php
          .then(() => {
            app.load = false
            app.subjectTeacher.daily_classrooms.splice(index - 1, 1)
            app.$message('Class Deleted Successfully')
          })
      }
    },
  },
}
</script>
