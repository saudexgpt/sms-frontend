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
          <h4>Manage Result</h4>
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
              <span class="align-middle">Set Preferences</span>
            </b-button>
          </span>
        </b-col>
      </b-row>
    </div>
    <div v-if="loadResult">

      <manage-term-result :params="form" />
    </div>
    <div v-else>
      <b-alert
        variant="danger"
        show
      >
        <div class="alert-body">
          <span><strong>Please set your preferences to manage result</strong></span>
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
            Set Preferences for Result
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
          <b-form-group v-if="levels.length > 0">
            <label>Level</label>
            <el-select
              v-model="level_key"
              placeholder="Select Level"
              class="span"
              filterable
              @change="fetchClassTeachers"
            >
              <el-option
                v-for="(level, index) in levels"
                :key="index"
                :value="index"
                :label="level.level"
              />

            </el-select>
          </b-form-group>
          <b-form-group>
            <label>Class</label>
            <el-select
              v-model="form.class_teacher_id"
              placeholder="Select Class"
              class="span"
            >
              <el-option
                v-for="(class_teacher, index) in class_teachers"
                :key="index"
                :value="class_teacher.id"
                :label="class_teacher.c_class.name"
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
              @click="fetchRecordedResult()"
            >
              Submit Preferences
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
import ManageTermResult from './partials/ManageTermResult.vue'

const selectionOptions = new Resource('result/set-selection-options')
// const recordedResult = new Resource('result/get-recorded-result');

export default {
  components: {
    BRow, BCol, BSidebar, BButton, ManageTermResult, BFormGroup, BAlert,
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
        sess_id: '',
        term_id: '',
        sub_term: '',
        class_teacher_id: '',

      },

      sessions: [],
      terms: [],
      levels: [],
      level_key: '',
      class_teachers: [],

      show_table: false,
      show_selection: true,
      display_label: '',
      load: false,

    }
  },

  created() {
    this.setSelectionOptions()
  },
  methods: {
    setSelectionOptions() {
      const app = this
      app.load = true
      selectionOptions.list()
        .then(response => {
          app.load = false
          app.sessions = response.sessions
          app.terms = response.terms
          app.levels = response.levels
          app.class_teachers = response.class_teachers
        })
        .catch(error => {
          app.load = false
          console.log(error)
        })
    },
    fetchRecordedResult() {
      const app = this
      app.loadResult = true
      app.modalShow = false
    },
    // fetchRecordedResult()
    // {
    //   let app= this;

    //   //let param = app.form;
    //   //console.log(param);
    //   app.$router.push(
    //     {
    //       name: 'ManageTermResult',
    //       params: {
    //         class_teacher_id: app.form.class_teacher_id,
    //         sess_id: app.form.sess_id,
    //         term_id: app.form.term_id,
    //         sub_term: app.form.sub_term,//'full',
    //       }
    //     }
    //   )

    // },
    fetchClassTeachers() {
      const app = this
      const index = app.level_key
      app.class_teachers = app.levels[index].class_teachers
      app.form.class_teacher_id = ''// app.class_teachers[0].id;
      // app.fetchSubjectTeachers();
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
