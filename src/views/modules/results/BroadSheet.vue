<template>
  <div class="app-container">

    <div class="box">
      <div class="box-header">
        <h4 class="box-title">
          Make selections for Result BroadSheet
        </h4>

        <!--<div class="pull-right">
          <span v-if="!show_selection"><a @click="show_selection=true" class="btn btn-default">Show Selection</a></span>
          <span v-if="show_selection"><a @click="show_selection=false" class="btn btn-danger">Hide Selection</a></span>
        </div>-->
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
              <el-form-item label="Level">
                <el-select
                  v-model="level_key"
                  placeholder="Select Level"
                  class="span"
                  @change="fetchClassTeachers"
                >
                  <el-option
                    v-for="(level, index) in levels"
                    :key="index"
                    :value="index"
                    :label="level.level"
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
              <el-form-item label="Class">
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
                  @click="fetchBroadSheet"
                >
                  Fetch Result BroadSheet
                </el-button>
              </el-form-item>

            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

  </div>
</template>
<script>

import Resource from '@/api/resource'

const selectionOptions = new Resource('result/set-selection-options')

export default {

  data() {
    return {
      broadSheetData: {},

      form: {
        class_teacher_id: '',
        sess_id: '',
        term_id: '',
        sub_term: 'full',

      },

      sessions: [],
      terms: [],
      levels: [],
      level_key: '',
      class_teachers: [],

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
          app.levels = response.levels
        })
        .catch(error => {
          console.log(error)
        })
    },

    fetchBroadSheet() {
      const app = this

      // let param = app.form;
      // console.log(param);
      app.$router.push(
        {
          name: 'BroadSheetTable',
          params: {
            class_teacher_id: app.form.class_teacher_id,
            sess_id: app.form.sess_id,
            term_id: app.form.term_id,
            sub_term: app.form.sub_term, // 'full',
          },
        },
      )

      /* getResultBroadSheet.list(param)
      .then(response => {
        app.broadSheetData = response;
        app.show_table = true;
        app.show_selection = false;
      })
      .catch(error => {
        console.log(error);
      }); */
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
