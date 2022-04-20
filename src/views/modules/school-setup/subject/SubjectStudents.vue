<template>
  <div>
    <el-card v-loading="load">
      <div
        slot="header"
        class="clearfix"
      >
        <span>{{ subject_name }} for {{ class_name }}</span>

        <span class="pull-right">
          <span>
            <a
              class="btn btn-danger"
              @click="$router.go(-1)"
            >Back</a>
          </span>
          <!--<span><a @click="dialogTableVisible = true" class="btn btn-info"><i class="fa fa-check"></i> Mark Attendance</a></span>
          <span><a @click="class_name" class="btn btn-danger"><i class="fa fa-pencil"></i> Record Result</a></span>-->
        </span>
      </div>
      <div class="box-body">
        <p>Click on the Students to Add/Remove from the lists respectively and then click on <button
          class="btn btn-success"
          @click="registerAll()"
        >
          Submit Subject Student List
        </button></p>
        <el-row
          :gutter="20"
        >
          <el-col
            :xs="24"
            :sm="24"
            :md="24"
          >
            <dnd-list
              :unmarked="form.unregistered_class_students"
              :marked="form.registered_class_students"
              :all-students="all_students"
              :unmarked-title="'List of Students Not Offering ' + subject_name"
              :marked-title="'List of Students Offering ' + subject_name"
            />
          </el-col>
        </el-row>

      </div>
    </el-card>
  </div>
</template>
<script>
import DndList from '@/views/modules/attendance/partials/DndList.vue'
import Resource from '@/api/resource'

const subjectStudents = new Resource('school-setup/my-subject-students')
const manageStudents = new Resource('school-setup/manage-subject-students')

export default {
  components: { DndList },
  data() {
    return {
      // dialogTableVisible: false,
      load: false,
      subject_teacher: '',
      all_students: [],
      subject_name: '',
      class_name: '',
      form: {
        registered_class_students: [],
        unregistered_class_students: [],
        subject_teacher_id: '',
      },

    }
  },
  mounted() {
    this.fetchSubjectStudents()
  },
  methods: {
    fetchSubjectStudents() {
      const app = this
      const subjectTeacherId = app.$route.params.id
      const param = { subject_teacher_id: subjectTeacherId }
      app.load = true
      subjectStudents.list(param)
        .then(response => {
          app.all_students = response.all_students
          app.form.registered_class_students = response.registered_class_students
          app.form.unregistered_class_students = response.unregistered_class_students
          app.form.subject_teacher_id = response.subject_teacher.id
          app.subject_name = response.subject_teacher.subject.name
          app.class_name = response.subject_teacher.class_teacher.c_class.name
          app.load = false
        })
    },
    registerAll() {
      const app = this
      app.form.action = 'add'
      const param = app.form
      app.load = true
      manageStudents.store(param)
        .then(() => {
          app.load = false
          app.$message('Subject List updated')
        })
    },
  },

}

</script>
