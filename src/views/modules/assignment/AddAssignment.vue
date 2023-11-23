<template>
  <div v-loading="load">
    <el-row :gutter="10">
      <el-col
        :xs="24"
        :md="12"
      >
        <span class="demonstration">Select Subject</span>
        <el-select
          v-model="form.subject_teacher_id"
          style="width: 100%"
          placeholder="Select Subject"
        >
          <el-option
            v-for="(subject_teacher, index) in subject_teachers"
            :key="index"
            :label="subject_teacher.subject.name +' for ' + subject_teacher.class_teacher.c_class.name"
            :value="subject_teacher.id"
          /></el-select>
      </el-col>
      <el-col
        :xs="24"
        :md="12"
      >
        <span class="demonstration">Set Deadline</span>
        <el-date-picker
          v-model="form.deadline"
          type="datetime"
          placeholder="Select deadline"
          default-time="12:00:00"
          style="width: 100%"
        />
      </el-col>
      <el-col :xs="24">
        <span class="demonstration">Type Task</span>
        <quill-editor
          v-model="form.assignment_details"
        />
      </el-col>
      <el-col :xs="6">
        <span class="demonstration">&nbsp;</span>
        <br>
        <button
          class="btn btn-success"
          @click="submitAssignment()"
        >
          Submit
        </button>

        <br>
        <br>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// eslint-disable-next-line
import 'quill/dist/quill.core.css'
// eslint-disable-next-line
import 'quill/dist/quill.snow.css'
// eslint-disable-next-line
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import Resource from '@/api/resource'

export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      subject_teachers: [],
      load: false,
      form: {
        subject_teacher_id: '',
        deadline: '',
        assignment_details: '',
      },
      empty_form: {
        subject_teacher_id: '',
        deadline: '',
        assignment_details: '',
      },
      // editorOption: {
      //   modules: {
      //     toolbar: '#toolbar',
      //   },
      //   theme: 'bubble',
      // },
    }
  },
  created() {
    this.fetchSubjects()
  },
  methods: {
    fetchSubjects() {
      const app = this
      const fetchTeacherSubjectResource = new Resource('assignment/fetch-subjects')
      fetchTeacherSubjectResource.list().then(response => {
        app.subject_teachers = response.subject_teachers
      })
    },
    submitAssignment() {
      const app = this
      const saveAssignmentResource = new Resource('assignment/store')
      const param = app.form
      app.load = true
      saveAssignmentResource.store(param).then(response => {
        app.subject_teachers = response.subject_teachers
        app.$message('Assignment Saved Successfully')
        app.form = app.empty_form
        app.load = false
      })
    },
  },
}
</script>
