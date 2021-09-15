<template>
  <div class="app-container">
    <div class="box">
      <div class="box-header">
        <h4 class="box-title">
          Make selections to view result
        </h4>

        <div class="pull-right">
          <span v-if="!show_selection"><a
            class="btn btn-default"
            @click="show_selection=true"
          >Show Selection</a></span>
          <span v-if="show_selection"><a
            class="btn btn-danger"
            @click="show_selection=false"
          >Hide Selection</a></span>
        </div>
      </div>
      <div
        v-if="show_selection"
        class="box-body"
      >
        <el-form
          ref="form"
          :model="form"
          label-width="60px"
        >
          <el-row
            :gutter="5"
            class="padded"
          >

            <el-col
              :xs="24"
              :sm="20"
              :md="12"
              class="el-col-sm-offset-2 el-col-md-offset-6"
            >
              <el-form-item label="Class">
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
              </el-form-item>

            </el-col>
            <el-col
              :xs="24"
              :sm="20"
              :md="12"
              class="el-col-sm-offset-2 el-col-md-offset-6"
            >
              <el-form-item label="Session">
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
              </el-form-item>

            </el-col>

            <el-col
              :xs="24"
              :sm="20"
              :md="12"
              class="el-col-sm-offset-2 el-col-md-offset-6"
            >
              <el-form-item label="Term">
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
              </el-form-item>

            </el-col>
            <el-col
              :xs="24"
              :sm="20"
              :md="12"
              class="el-col-sm-offset-2 el-col-md-offset-6"
            >
              <el-form-item label="Mode">
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
              </el-form-item>

            </el-col>

            <el-col
              :xs="24"
              :sm="20"
              :md="12"
              class="el-col-sm-offset-2 el-col-md-offset-6"
            >
              <el-form-item label="">
                <el-button
                  type="primary"
                  @click="fetchRecordedResult"
                >
                  Fetch Results
                </el-button>
              </el-form-item>

            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <!--<div v-if="show_table">

      <view-recorded-result :recordedResultData="recordedResultData"/>
    </div>-->
  </div>
</template>
<script>
import Resource from '@/api/resource'
// import ViewRecordedResult from './partials/approval/ViewRecordedResult.vue'

const selectionOptions = new Resource('result/student-selection-options')
// const recordedResult = new Resource('result/get-recorded-result')

export default {
  // components: { ViewRecordedResult },
  data() {
    return {
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

      show_table: false,
      show_selection: true,
      display_label: '',

    }
  },

  created() {
    this.setSelectionOptions()
  },
  methods: {
    setSelectionOptions() {
      const app = this
      selectionOptions.list()
        .then(response => {
          app.sessions = response.sessions
          app.terms = response.terms
          app.my_classes = response.my_classes
          app.form.student_id = response.student_id
        })
        .catch(error => {
          console.log(error)
        })
    },

    fetchRecordedResult() {
      const app = this

      // let param = app.form;
      // console.log(param);
      app.$router.push(
        {
          name: 'StudentResultDetails',
          params: {
            student_id: app.form.student_id,
            class_teacher_id: app.form.class_teacher_id,
            sess_id: app.form.sess_id,
            term_id: app.form.term_id,
            sub_term: app.form.sub_term, // 'full',
          },
        },
      )
    },
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
