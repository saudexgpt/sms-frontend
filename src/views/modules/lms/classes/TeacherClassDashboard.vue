<!-- eslint-disable vue/no-v-html -->
<template>
  <el-card v-loading="load">
    <div class="box-header">
      <div class="box-title">
        My Subjects
      </div>
    </div>
    <div class="box-body">
      <div v-if="!set_online_class">
        <v-client-table
          :data="subject_teachers"
          :columns="columns"
          :options="options"
        >

          <template
            slot="subject"
            slot-scope="props"
          >
            <span v-html="props.row.subject.name" />
          </template>
          <template
            slot="class"
            slot-scope="props"
          >
            <span v-html="props.row.class_teacher.c_class.name" />
          </template>

          <template
            slot="days"
            slot-scope="props"
          >
            <span
              v-for="(routine , routine_index) in props.row.routines"
              :key="routine_index"
            >

              <a
                class="btn btn-primary btn-sm"
                @click="setOnlineClass(days[routine.day-1],routine.day, props.row)"
              ><i class="fa fa-users" /> {{ days[routine.day-1] }}</a>

            </span>
          </template>

        </v-client-table>
      </div>
      <div v-if="set_online_class">
        <a
          class="btn btn-danger"
          @click="set_online_class = false"
        > Go Back</a>
        <set-online-class
          :day="day"
          :day-in-words="day_in_words"
          :subject-teacher="subject_teacher"
        />
      </div>

    </div>

  </el-card>
</template>
<script>
import Resource from '@/api/resource'
import SetOnlineClass from './partials/SetOnlineClass.vue'

export default {
  components: { SetOnlineClass },
  data() {
    return {
      subject_teachers: [],
      columns: ['subject', 'class', 'days'],
      options: {
        headings: {
          subject: 'Subject',
          class: 'Class',

          days: 'Days (Click to setup online class for each day)',
        },
        sortable: ['subject', 'class'],
        filterable: ['subject', 'class'],
      },
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      set_online_class: false,

      subject_teacher: '',
      day: '',
      day_in_words: '',
      load: false,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const app = this
      app.load = true
      const teacherRoutineResource = new Resource('lms/teacher-routine')
      teacherRoutineResource.list() // back end route from web.php

        .then(response => {
          app.subject_teachers = response.subject_teachers
          app.load = false
        })
    },
    setOnlineClass(dayInWords, day, subjectTeacher) {
      const app = this
      app.day_in_words = dayInWords
      app.day = day
      app.subject_teacher = subjectTeacher
      app.set_online_class = true
    },
  },
}
</script>
