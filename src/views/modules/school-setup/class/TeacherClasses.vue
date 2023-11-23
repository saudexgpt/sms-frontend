<template>
  <el-card v-loading="load">
    <div slot="header">
      <h4>My Classes</h4>
    </div>
    <el-row
      :gutter="10"
    >
      <el-col
        v-for="(class_teacher, index) in class_teachers"
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

          @click="fetchClassStudents(class_teacher.id)"
        >
          <b-avatar
            class="mb-1"
            :variant="randomColor()"
            size="45"
          >
            <feather-icon
              size="21"
              icon="UsersIcon"
            />
          </b-avatar>
          <div class="truncate">
            <h4 class="mb-25 font-weight-bolder">
              {{ class_teacher.c_class.name }}
            </h4>
          </div>
        </b-card>
        <!-- </router-link> -->
      </el-col>
    </el-row>
    <el-row v-if="students_in_class.length > 0">
      <el-tabs type="border-card">
        <el-tab-pane label="Student Details">

          <student-in-class-table :students-in-class="students_in_class" />
        </el-tab-pane>
        <el-tab-pane label="Behavior/Skill Ratings">
          <behavior-skill-settings :students-in-class="students_in_class" />
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </el-card>
</template>
<script>
import { BCard, BAvatar } from 'bootstrap-vue'
import Resource from '@/api/resource'
import StudentInClassTable from '@/views/modules/user/students/partials/StudentInClassTable.vue'
import BehaviorSkillSettings from './BehaviorSkillSettings.vue'

const teacherClassesResource = new Resource('school-setup/class-teacher-class')
const classStudentsResource = new Resource('school-setup/get-class-students')

export default {
  components: {
    BCard,
    BAvatar,
    StudentInClassTable,
    BehaviorSkillSettings,
  },
  data() {
    return {
      class_teachers: [],
      students_in_class: [],
      load: false,
      teacher: '',
    }
  },
  created() {
    this.fetchTeacherClasses()
  },
  methods: {
    fetchTeacherClasses() {
      const app = this
      app.load = true
      teacherClassesResource.list()
        .then(response => {
          app.class_teachers = response.class_teachers
          app.teacher = response.teacher
          app.load = false
        })
    },
    fetchClassStudents(classTeacherId) {
      const app = this
      app.load = true
      classStudentsResource.list({ class_teacher_id: classTeacherId })
        .then(response => {
          app.students_in_class = response.students_in_class
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
