<template>
  <div
    v-if="studentData"
    class="box"
  >
    <header class="box-header">
      <h4 class="box-title">
        <div v-if="(studentData.active_assessment == 'half' && (studentData.edit_midterm)) || (studentData.active_assessment == 'full' && (studentData.edit_exam))">
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="gradient-success"
            @click="submitModalShow = true;"
          >
            <feather-icon
              icon="SaveIcon"
              class="mr-50"
            />
            <span class="align-middle">Submit</span>
          </b-button>
        </div>
        <div
          v-else
          class="alert alert-primary"
          align="center"
        >
          Result Status: {{ (studentData.active_assessment == 'half') ? studentData.result_action_array[2].toUpperCase() : studentData.result_action_array[3].toUpperCase() }}
        </div>
      </h4>

    </header>
    <div class="box-body">
      <el-row :gutter="5">
        <el-col
          :xs="24"
          :sm="18"
          :md="18"
        >

          <p align="center">
            {{ toUpperCase(studentData.active_assessment) }} Term Report Entry for {{ studentData.class.name }} {{ studentData.subject_teacher.subject.name }} {{ studentData.term.name + ' term, ' + studentData.session.name + ' session' }}
          </p>
        </el-col>
        <el-col
          :xs="24"
          :sm="6"
          :md="4"
        >

          <router-link :to="{name: 'SubjectStudents', params: {id: studentData.subject_teacher_id}}">
            <el-button
              type="warning"
            >
              <span class="align-middle">Manage Elective Students</span>
            </el-button>
          </router-link>
        </el-col>
      </el-row>

      <!--Modal-->
      <div
        id="confirm-submit"
        class="modal fade in"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button
                id="close"
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">X</span></button>
              <h4 class="modal-title">
                SUBMIT ENTRY?
              </h4>
            </div>
            <div class="modal-body">
              <p>Once you submit, you will not be allowed to alter this entry.</p><p>Click CONFIRM to submit</p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-danger pull-left"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-success"
                @click="resultAction(studentData.active_assessment, 'submitted', studentData.subject_teacher_id)"
              >
                Confirm
              </button>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
      </div>
      <b-modal
        v-model="submitModalShow"
        title="Confirm Submission"
        ok-title="Yes"
        ok-only
        @ok="resultAction(studentData.active_assessment, 'submitted', studentData.subject_teacher_id)"
      >
        <p>Once you submit, you will not be allowed to alter this entry</p>
        <p>Click YES to submit</p>
      </b-modal>
      <el-tabs
        style="margin-top:15px;"
        type="border-card"
      >
        <el-tab-pane label="Single Entry">
          <single-entry
            :student-data="studentData"
            :form="form"
          />
        </el-tab-pane>

        <!-- <el-tab-pane label="Bulk Entry">
          <div v-if="(studentData.active_assessment == 'half' && (studentData.edit_ca1 || studentData.edit_ca2) ) || (studentData.active_assessment == 'full' && (studentData.edit_ca3 || studentData.edit_exam))">

            <bulk-entry
              :student-data="studentData"
              :selection-form="form"
            />
          </div>
          <div v-else>
            <div class="callout callout-success">
              <h4>Result already submitted!!!</h4>

            </div>
          </div>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>
<script>
import {
  BModal, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import SingleEntry from './single/SingleResultUpload.vue'
// import BulkEntry from './bulk/BulkResultUpload.vue'

const saveResultAction = new Resource('result/result-action')
export default {
  components: {
    BModal, BButton, SingleEntry,
    // BulkEntry,
  },
  directives: {
    Ripple,
  },
  props: {
    studentData: {
      type: Object,
      default: () => ({}),
    },
    form: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      submitModalShow: false,
      result_action_array: [],
    }
  },
  mounted() {
    this.result_action_array = this.studentData.result_action_array
  },
  methods: {
    resultAction(assessment, action, subjectTeacherId) {
      const app = this
      const { term_id } = app.studentData
      const { sess_id } = app.studentData
      const params = {
        id: subjectTeacherId, assessment, action, term_id, sess_id,
      }

      saveResultAction.store(params)
        .then(response => {
          app.closeModal()
          app.studentData.result_action_array = response.result_action_array
          app.studentData.edit_midterm = response.edit_midterm
          app.studentData.edit_ca1 = response.edit_ca1
          app.studentData.edit_ca2 = response.edit_ca2
          app.studentData.edit_ca3 = response.edit_ca3
          app.studentData.edit_ca4 = response.edit_ca4
          app.studentData.edit_ca5 = response.edit_ca5
          app.studentData.edit_exam = response.edit_exam
          this.$message('Result submission successful!!!')
        })
        .catch(error => {
          console.log(error)
        })
    },
    closeModal() {
      this.submitModalShow = false
    },
    toUpperCase(str) {
      if (str === 'half') {
        // eslint-disable-next-line no-param-reassign
        str = 'mid'
      }
      return str.toUpperCase()
    },

  },

}
</script>
