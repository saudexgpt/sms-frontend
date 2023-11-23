<template>
  <div>
    <div v-if="cant_view === false">
      <el-card
        class="no-print"
      >
        <div
          slot="header"
        >
          <b-row>
            <b-col
              cols="6"
            >
              <h4>
                Check Result
              </h4>
            </b-col>
            <b-col
              cols="6"
            >
              <span class="pull-right">
                <b-button
                  v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                  variant="gradient-primary"
                  @click="modalShow = true; show_table = false"
                >
                  <feather-icon
                    icon="FilePlusIcon"
                    class="mr-50"
                  />
                  <span class="align-middle">Set Preferences</span>
                </b-button>
              </span>
            </b-col>
          </b-row>
        </div>

      </el-card>
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
        class="no-print"
      >
        <template
          #default="{ hide }"
        >
          <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
            <h5 class="mb-0">
              Set Preferences for Result
            </h5>
            <div>
              <b-button
                variant="gradient-danger"
                class="btn-icon"
                @click="hide"
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
              <label>Select Class</label>
              <el-select
                v-model="form.class_teacher_id"
                placeholder="Select Class"
                class="span"
              >
                <el-option
                  v-for="(my_class, index) in my_classes"
                  :key="index"
                  :value="my_class.class_teacher_id"
                  :label="my_class.class_teacher.c_class.name"
                />

              </el-select>
            </b-form-group>
            <b-form-group>
              <label>Session</label>
              <el-select
                v-model="form.sess_id"
                placeholder="Select Session"
                class="span"
              >
                <el-option
                  v-for="(session, index) in sessions"
                  :key="index"
                  :value="session.id"
                  :label="session.name"
                />

              </el-select>
            </b-form-group>
            <b-form-group>
              <label>Term</label>
              <el-select
                v-model="form.term_id"
                placeholder="Select Term"
                class="span"
              >
                <el-option
                  v-for="(term, index) in terms"
                  :key="index"
                  :value="term.id"
                  :label="term.name"
                />

              </el-select>
            </b-form-group>
            <b-form-group>
              <label>Sub Term</label>
              <el-select
                v-model="form.sub_term"
                placeholder="Select Sub-term"
                class="span"
              >
                <el-option
                  value="half"
                  label="Mid Term"
                />
                <el-option
                  value="full"
                  label="Full Term"
                />
              </el-select>
            </b-form-group>
            <b-form-group>
              <hr>
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                class="mr-1"
                @click="show_table = true; modalShow = false;"
              >
                Fetch Result
              </b-button>
            </b-form-group>
          </div>
        </template>
      </b-sidebar>
      <!--SIDEBAR MODAL-->
      <div v-if="show_table">
        <student-result-details
          :param="form"
          :is-sub-page="true"
          :student-id="form.student_id"
        />
      </div>
      <div
        v-else
        class="no-print"
      >
        <b-alert
          variant="danger"
          show
        >
          <div class="alert-body">
            <span><strong>Please set your preferences to view result</strong></span>
          </div>
        </b-alert>
      </div>
    </div>
    <div v-else>
      <div
        class="no-print"
      >
        <b-button
          variant="gradient-danger"
          class="btn-icon"
          @click="$router.go(-1)"
        >
          Back
        </b-button>
        <b-alert
          variant="danger"
          show
        >
          <div class="alert-body">
            <span><strong>You are not permitted to view this student's result</strong></span>
          </div>
        </b-alert>
      </div>
    </div>
  </div>
</template>
<script>
import {
  BSidebar, BButton, BFormGroup, BAlert, BRow, BCol,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkRole from '@/utils/role'
import Resource from '@/api/resource'
import StudentResultDetails from './StudentResultDetails.vue'

const selectionOptions = new Resource('result/student-selection-options')

export default {
  components: {
    BSidebar, BButton, BFormGroup, BAlert, BRow, BCol, StudentResultDetails,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      modalShow: true,
      studentData: {},
      recordedResultData: {},

      form: {
        sess_id: '',
        term_id: '',
        sub_term: '',
        class_teacher_id: '',
        student_id: '',

      },

      sessions: [],
      terms: [],
      level_key: '',
      my_classes: [],
      load: false,
      show_table: false,
      show_selection: true,
      display_label: '',
      cant_view: false,

    }
  },
  computed: {
    myWards() {
      return this.$store.getters.userData.my_wards_ids
    },
  },

  created() {
    this.setSelectionOptions()
  },
  methods: {
    checkRole,
    setSelectionOptions() {
      const app = this
      // eslint-disable-next-line radix
      const studentId = parseInt(app.$route.params.student_id)
      if (!app.myWards.includes(studentId) && app.checkRole(['parent'])) {
        app.cant_view = true
      } else {
        app.load = true
        app.cant_view = false
        const param = { student_id: studentId }
        selectionOptions.list(param)
          .then(response => {
            app.sessions = response.sessions
            app.terms = response.terms
            app.my_classes = response.my_classes
            app.form.student_id = response.student_id
            app.load = false
          })
          .catch(error => {
            app.load = false
            console.log(error)
          })
      }
    },

    // fetchRecordedResult() {
    //   const app = this

    //   // let param = app.form;
    //   // console.log(param);
    //   app.$router.push(
    //     {
    //       name: 'StudentResultDetails',
    //       params: {
    //         student_id: app.form.student_id,
    //         class_teacher_id: app.form.class_teacher_id,
    //         sess_id: app.form.sess_id,
    //         term_id: app.form.term_id,
    //         sub_term: app.form.sub_term, // 'full',
    //       },
    //     },
    //   )
    // },
    // fetchClassTeachers() {
    //   const app = this
    //   const index = app.level_key
    //   app.class_teachers = app.levels[index].class_teachers
    //   app.form.class_teacher_id = ''// app.class_teachers[0].id;
    //   // app.fetchSubjectTeachers();
    // },

  },
}
</script>
<style scoped>
.span {
  width: 100%;
}
</style>
