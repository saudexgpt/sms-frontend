<!-- eslint-disable vue/no-v-html -->
<template>
  <el-card v-loading="load">
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>My Scheduled Classes</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-if="!view_students && subject_teacher !== '' && subject_teacher.id !== 'upcoming'"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              @click="setOnlineClass()"
            >
              <feather-icon
                icon="FilePlusIcon"
                class="mr-50"
              />
              <span class="align-middle">Create</span>
            </b-button>
            <b-button
              v-if="view_students"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-danger"
              @click="view_students = false"
            >
              <feather-icon
                icon="ArrowLeftIcon"
                class="mr-50"
              />
              <span class="align-middle">Leave</span>
            </b-button>
          </span>
        </b-col>
      </b-row>
    </div>
    <div
      v-if="!view_students"
      class="box-body"
    >
      <b-row>
        <b-col lg="6">
          <el-select
            v-model="subject_teacher"
            value-key="id"
            style="width: 100%"
            placeholder="Select Subject"
            @input="fetchOnlineClassSchedule()"
          >
            <el-option
              label="All Upcoming Online Classes"
              :value="{id: 'upcoming'}"
            />
            <el-option
              v-for="(subjectTeacher, index) in subject_teachers"
              :key="index"
              :label="`${subjectTeacher.subject.name} (${subjectTeacher.class_teacher.c_class.name})`"
              :value="subjectTeacher"
            />
          </el-select>
        </b-col>

        <b-col lg="12">
          <!-- {{ today }} -->
          <v-client-table
            :data="daily_classrooms"
            :columns="columns"
            :options="options"
          >

            <template
              slot="action"
              slot-scope="props"
            >
              <span>
                <!-- <el-tooltip
                  content="Upload Resources"
                  placement="top"
                >
                  <b-button
                    variant="gradient-primary"
                    class="btn-icon rounded-circle"
                    @click="uploadResources(props.row)"
                  >
                    <feather-icon icon="UploadIcon" />
                  </b-button>
                </el-tooltip> -->
                <el-tooltip
                  content="Start Class"
                  placement="top"
                >
                  <b-button
                    variant="gradient-primary"
                    class="btn-icon rounded-circle"
                    @click="viewStudents(props.row)"
                  >
                    <feather-icon icon="VideoIcon" />
                  </b-button>
                </el-tooltip>
                <el-tooltip
                  content="Delete Class"
                  placement="bottom"
                >
                  <b-button
                    variant="gradient-danger"
                    class="btn-icon rounded-circle"
                    @click="deleteClass(props.index, props.row.id)"
                  >
                    <feather-icon icon="TrashIcon" />
                  </b-button>
                </el-tooltip>
              </span>
            </template>

          </v-client-table>
        </b-col>
      </b-row>
      <set-online-class
        v-if="isCreateClassSidebarActive"
        v-model="isCreateClassSidebarActive"
        :subject-teacher="subject_teacher"
        @save="updateTable"
      />
    </div>

    <div v-if="view_students">
      <view-online-students
        :daily-classroom="daily_classroom"
        :query-string="query_string"
        @updatelink="updateLink"
      />
    </div>
  </el-card>
</template>
<script>
import {
  BRow, BCol, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import SetOnlineClass from './partials/SetOnlineClass.vue'
import ViewOnlineStudents from './partials/ViewOnlineStudents.vue'

export default {
  components: {
    BRow, BCol, BButton, SetOnlineClass, ViewOnlineStudents,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      isCreateClassSidebarActive: false,
      daily_classroom: '',
      query_string: '',
      view_students: false,
      subject_teachers: [],
      daily_classrooms: [],
      columns: ['action', 'topic', 'date', 'duration', 'start', 'end'],
      options: {
        headings: {
          topic: 'Topic',
          duration: 'Duration (in minutes)',

          date: 'Date of Class',
          action: 'Action',
        },
        filterByColumn: true,
        sortable: ['topic', 'date'],
        filterable: ['topic', 'date'],
      },
      // days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      set_online_class: false,
      subject_teacher: '',
      form: {
        subject_teacher_id: '',
      },
      today: new Date(),
      // day_in_words: '',
      load: false,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    updateLink(link) {
      const app = this
      app.daily_classroom.subject_teacher.class_teacher.online_class_meeting_link = link
    },
    fetchData() {
      const app = this
      const teacherRoutineResource = new Resource('lms/teacher-routine')
      teacherRoutineResource.list() // back end route from web.php

        .then(response => {
          app.subject_teachers = response.subject_teachers
        })
    },
    fetchOnlineClassSchedule() {
      const app = this
      const param = app.form
      param.subject_teacher_id = app.subject_teacher.id
      app.load = true
      const scheduledClassResource = new Resource('lms/created-online-classrooms')
      scheduledClassResource.list(param) // back end route from web.php

        .then(response => {
          app.daily_classrooms = response.daily_classrooms
          app.load = false
        })
    },
    setOnlineClass() {
      const app = this
      app.isCreateClassSidebarActive = true
    },
    updateTable() {
      const app = this
      app.fetchOnlineClassSchedule()
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
