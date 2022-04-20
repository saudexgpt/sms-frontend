<!-- eslint-disable vue/no-v-html -->
<template>
  <el-card class="box">
    <div class="box-header">
      <h3 class="box-title">
        Online Classrooms
      </h3>

    </div>
    <div class="box-body">
      <div v-if="!go_online">
        <span class="pull-right demo-inline-spacing">
          <button
            class="btn btn-primary"
            @click="fetchData('no')"
          >Today's Classes</button>
          <button
            class="btn btn-primary"
            @click="fetchData('yes')"
          >All Classes</button>
        </span>
        <v-client-table
          v-loading="load"
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
              @click="attendClass(props.row)"
            ><i class="fa fa-users" /> Attend Class</a>
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
import ViewOnlineStudents from './partials/ViewOnlineStudents.vue'
import Resource from '@/api/resource'

export default {
  components: { ViewOnlineStudents },
  data() {
    return {
      daily_classrooms: [],
      columns: ['subject', 'topic', 'start', 'end', 'duration', 'teacher', 'date', 'action'],
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
      const studentRoutineResource = new Resource('lms/student-routine')
      const param = { option: viewAll }
      app.load = true
      studentRoutineResource.list(param) // back end route from web.php

        .then(response => {
          app.load = false
          app.daily_classrooms = response.daily_classrooms
        })
    },
    setOnlineClass(dayInWords, day, subjectTeacher) {
      const app = this
      app.day_in_words = dayInWords
      app.day = day
      app.subject_teacher = subjectTeacher
      app.set_online_class = true
    },
    attendClass(dailyClassroom) {
      const app = this
      //   const l = app.$message.loading({
      //     message: '...loading. This might take some time',
      //     align: 'center',

      //   })
      const comeOnlineResource = new Resource('lms/come-online')
      comeOnlineResource.get(dailyClassroom.id) // back end route from web.php

        .then(response => {
          // l.close()
          app.daily_classroom = dailyClassroom
          const name = `${response.user.first_name} ${response.user.last_name}`
          app.query_string = `?open=false&sessionid=${dailyClassroom.subject_teacher_id}&publicRoomIdentifier=dashboard&userFullName=${name}`
          app.go_online = true
        })
    },
  },
}
</script>
