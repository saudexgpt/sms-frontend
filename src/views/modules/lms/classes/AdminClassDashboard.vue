<!-- eslint-disable vue/no-v-html -->
<template>
  <el-card v-loading="load">
    <div slot="header">
      <div class="box-title">
        Created Classrooms
      </div>

    </div>
    <div class="box-body">
      <div v-if="!go_online">
        <span class="pull-right">
          <a
            class="btn btn-primary"
            @click="fetchData('yes')"
          >All Classrooms</a>
          <a
            class="btn btn-primary"
            @click="fetchData('no')"
          >Today's Classrooms</a>
        </span>
        <v-client-table
          :data="daily_classrooms"
          :columns="columns"
          :options="options"
        >

          <template
            slot="subject"
            slot-scope="props"
          >
            <span v-html="props.row.subject_teacher.subject.name" />
          </template>
          <template
            slot="teacher"
            slot-scope="props"
          >
            {{ props.row.subject_teacher.staff.user.first_name }}
            {{ props.row.subject_teacher.staff.user.last_name }}
          </template>

          <template
            slot="action"
            slot-scope="props"
          >
            <a
              class="btn btn-primary btn-sm"
              @click="viewStudents(props.row)"
            ><i class="fa fa-users" /> View Class</a>
          </template>

        </v-client-table>
      </div>

      <div v-if="go_online">
        <a
          class="btn btn-danger"
          @click="go_online = false"
        > Go Back</a>
        <view-online-students
          :daily-classroom="daily_classroom"
          :query-string="query_string"
        />
      </div>
    </div>

  </el-card>
</template>
<script>
import Resource from '@/api/resource'
import ViewOnlineStudents from './partials/ViewOnlineStudents.vue'

export default {
  components: { ViewOnlineStudents },
  data() {
    return {
      daily_classrooms: [],
      columns: ['subject', 'topic', 'start', 'end', 'teacher', 'date', 'action'],
      options: {
        headings: {
          subject: 'Subject',
          topic: 'Topic',
          duration: 'Duration (minutes)',
          teacher: 'Subject Teacher',
          date: 'Date',
          action: 'Action',
        },
        sortable: ['subject', 'class'],
        filterable: ['subject', 'class'],
      },

      daily_classroom: { materials: [] },
      go_online: false,
      view_all: 'no',
      query_string: '',
      load: false,
    }
  },
  mounted() {
    this.fetchData('no')
  },
  methods: {
    fetchData(viewAll) {
      const app = this
      const onlineClassroomsResource = new Resource('lms/created-online-classrooms')
      app.load = true
      onlineClassroomsResource.list({ option: viewAll }) // back end route from web.php

        .then(response => {
          app.load = false
          app.daily_classrooms = response.daily_classrooms
        })
    },

    viewStudents(dailyClassroom) {
      const app = this
      app.daily_classroom = dailyClassroom
      const name = 'Proprietor'
      app.query_string = `?open=false&sessionid=${dailyClassroom.subject_teacher_id}&publicRoomIdentifier=dashboard&userFullName=${name}`
      app.go_online = true
    },
  },
}
</script>
