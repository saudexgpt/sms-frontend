<template>
  <el-card v-loading="load">
    <div slot="header">
      <h4>My Subjects</h4>
      <small>Click to manage elective students (if necessary)</small>
    </div>
    <el-row
      :gutter="10"
    >
      <el-col
        v-for="(subject_teacher, index) in subject_teachers"
        :key="index"
        :xs="12"
        :sm="8"
        :md="6"
        :lg="4"
        :xl="2"
      >
        <!-- <router-link :to="{ name: 'RecordResult' }"> -->
        <b-card
          class="text-center"
          style="cursor: pointer"
        >
          <router-link :to="{name: 'SubjectStudents', params: {id: subject_teacher.id}}">
            <b-avatar
              class="mb-1"
              :variant="randomColor()"
              size="45"
            >
              <feather-icon
                size="21"
                icon="BookOpenIcon"
              />
            </b-avatar>
            <div class="truncate">
              <h4 class="mb-25 font-weight-bolder">
                {{ subject_teacher.subject.code }}
              </h4>
              <span>{{ subject_teacher.class_teacher.c_class.name }}</span>
            </div>
          </router-link>
        </b-card>
        <!-- </router-link> -->
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import { BCard, BAvatar } from 'bootstrap-vue'
import Resource from '@/api/resource'

const teacherSubjectsResource = new Resource('school-setup/subject-teacher-subject')

export default {
  components: {
    BCard,
    BAvatar,
  },
  data() {
    return {
      subject_teachers: [],
      load: false,
      teacher: '',
      page: 'subject_list',
    }
  },
  created() {
    this.fetchTeacherSubjects()
  },
  methods: {
    fetchTeacherSubjects() {
      const app = this
      app.load = true
      teacherSubjectsResource.list()
        .then(response => {
          app.subject_teachers = response.subject_teachers
          app.teacher = response.teacher
          app.load = false
        })
    },
    randomColor() {
      const randomArray = ['primary', 'success', 'warning', 'dark', 'danger']
      return randomArray[Math.floor((Math.random() * randomArray.length))]
    },
  },
}
</script>
