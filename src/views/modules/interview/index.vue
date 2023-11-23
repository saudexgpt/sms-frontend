<template>
  <el-card>
    <div
      slot="header"
      class="no-print"
    >
      <b-row>
        <b-col
          cols="6"
        >
          <h4>My Tests</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              @click="modalShow = true; loadResult=false"
            >
              <feather-icon
                icon="FilePlusIcon"
                class="mr-50"
              />
              <span class="align-middle">Open Test</span>
            </b-button>
          </span>
        </b-col>
      </b-row>
    </div>
    <div v-if="loadResult">
      <student-compiles-quizzes :compiled-quizzes="[quiz_compilation]" />
    </div>
    <div v-else>
      <b-alert
        variant="danger"
        show
      >
        <div class="alert-body">
          <span><strong>Please enter your test credentials to start</strong></span>
        </div>
      </b-alert>
    </div>
    <!--SIDEBAR MODAL-->
    <b-sidebar
      v-model="modalShow"
      sidebar-subject="sidebar-lg"
      :visible="modalShow"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Fill the form below
          </h5>
          <div>
            <b-button
              variant="gradient-danger"
              class="btn-icon"
              @click="hide; loadResult=false; modalShow = false"
            >
              <feather-icon
                icon="XIcon"
              />
            </b-button>
          </div>
        </div>
        <div
          v-loading="load"
          class="justify-content-between align-items-center px-2 py-1"
        >
          <b-form-group>
            <label>Exam ID</label>
            <el-input
              v-model="form.exam_id"
              placeholder="Enter the Exam ID here"
            />
          </b-form-group>
          <b-form-group>
            <label>Exam CODE</label>
            <el-input
              v-model="form.exam_code"
              placeholder="Enter the Exam CODE here"
            />
          </b-form-group>
          <hr>
          <b-form-group>
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="success"
              class="mr-1"
              @click="fetchExam()"
            >
              Open
            </b-button>
          </b-form-group>
        </div>
      </template>
    </b-sidebar>
    <!--SIDEBAR MODAL-->
  </el-card>
</template>
<script>
import {
  BSidebar, BButton, BRow, BCol, BFormGroup, BAlert,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import StudentCompilesQuizzes from './StudentCompilesQuizzes.vue'

export default {
  components: {
    BRow, BCol, BSidebar, BButton, BFormGroup, BAlert, StudentCompilesQuizzes,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      // recordedResultData: {},
      modalShow: true,
      loadResult: false,
      form: {
        exam_id: '',
        exam_code: '',

      },

      show_table: false,
      show_selection: true,
      display_label: '',
      load: false,
      quiz_compilation: '',

    }
  },

  created() {
  },
  methods: {
    fetchRecordedResult() {
      const app = this
      app.loadResult = true
      app.modalShow = false
    },
    fetchExam() {
      const app = this
      app.load = true
      const fetchExamResource = new Resource('interview/staff-interviews')
      fetchExamResource.list(app.form)
        .then(response => {
          app.load = false
          app.quiz_compilation = response.quiz_compilation
          app.loadResult = true
          app.modalShow = false
        })
        .catch(error => {
          app.load = false
          app.$message(error.response.data.message)
        })
    },

  },
}
</script>
<style scoped>
.span {
  width: 100%;
}
</style>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
