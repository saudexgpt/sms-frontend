<template>
  <div>
    <div
      v-if="recordedResultData.subject_teachers"
    >
      <div slot="header">
        <legend>
          Result List for {{ recordedResultData.class_details.c_class.name }} ({{ recordedResultData.sub_term.toUpperCase() }} Term)
        </legend>

        <!-- <span v-if="recordedResultData.cant_approve == 0"> -->
        <span>
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="gradient-primary"
            @click="showPublishModal = true;"
          >
            <feather-icon
              icon="FilePlusIcon"
              class="mr-50"
            />
            <span class="align-middle">Publish Results</span>
          </b-button>
        </span>
        <!-- <span
          v-else
        >
          <b-alert
            variant="danger"
            show
          >
            <div class="alert-body">
              <span><strong>You can't publish until all results are submitted by each teacher</strong></span>
            </div>
          </b-alert>
        </span> -->
        <b-modal
          v-model="showPublishModal"
          title="Confirm Result Publishing"
          ok-title="Yes"
          ok-only
          @ok="publishResult()"
        >
          Publish {{ recordedResultData.class_details.c_class.name }} {{ recordedResultData.sub_term.toUpperCase() }}-Term Results? <br>
          <p>Parents and students can view when this is done.</p>
          <p>Click YES to confirm</p>
        </b-modal>
        <b-modal
          v-model="showApprovalModal"
          title="Confirm Action"
          :ok-title="action.toUpperCase()"
          ok-only
          @ok="resultAction(selectedSubTerm, action, selectedSubjectTeacher.id)"
        >
          Do you want to change {{ selectedSubjectTeacher.subject.name }} Result status to {{ action }} ?<br>
          <p>Click {{ action.toUpperCase() }} to confirm</p>
        </b-modal>
      </div>
      <el-collapse
        accordion
        type="margin"
      >

        <el-collapse-item
          v-for="(subject_teacher, index) in recordedResultData.subject_teachers"
          :key="index"
          :title="(subject_teacher.staff !== null) ? subject_teacher.subject.name + ' by ' + subject_teacher.staff.user.first_name+' '+subject_teacher.staff.user.last_name : subject_teacher.subject.name"
        >
          <template slot="title">
            <div>
              <strong>{{ (subject_teacher.staff !== null) ? subject_teacher.subject.name + ' by ' + subject_teacher.staff.user.first_name+' '+subject_teacher.staff.user.last_name : subject_teacher.subject.name }}</strong>
            </div>
            <div>
              <div
                v-if="recordedResultData.sub_term === 'half'"
              >
                <strong
                  v-if="subject_teacher.result_action_array[2] === 'approved' || subject_teacher.result_action_array[2] === 'published'"
                  :id="'half_status_'+subject_teacher.id"
                  class="alert alert-success"
                >&nbsp; Status: {{ subject_teacher.result_action_array[2].toUpperCase() }}</strong>
                <strong
                  v-else-if="subject_teacher.result_action_array[2] === 'submitted'"
                  :id="'half_status_'+subject_teacher.id"
                  class="alert alert-primary"
                >&nbsp; Status: {{ subject_teacher.result_action_array[2].toUpperCase() }}</strong>
                <strong
                  v-else
                  :id="'half_status_'+subject_teacher.id"
                  class="alert alert-danger"
                >&nbsp; Status: {{ subject_teacher.result_action_array[2].toUpperCase() }}</strong>
              </div>
              <div
                v-if="recordedResultData.sub_term === 'full'"
              >
                <strong
                  v-if="subject_teacher.result_action_array[3] === 'approved' || subject_teacher.result_action_array[3] === 'published'"
                  :id="'full_status_'+subject_teacher.id"
                  class="alert alert-success"
                >&nbsp; Status: {{ subject_teacher.result_action_array[3].toUpperCase() }}</strong>
                <strong
                  v-else-if="subject_teacher.result_action_array[3] === 'submitted'"
                  :id="'full_status_'+subject_teacher.id"
                  class="alert alert-primary"
                >&nbsp; Status: {{ subject_teacher.result_action_array[3].toUpperCase() }}</strong>
                <strong
                  v-else
                  :id="'full_status_'+subject_teacher.id"
                  class="alert alert-danger"
                >&nbsp; Status: {{ subject_teacher.result_action_array[3].toUpperCase() }}</strong>
              </div>
            </div>
          </template>
          <div>
            <div v-if="subject_teacher.students ">
              <!--
                  subject_teacher.result_action_array[0] == view_half
                  subject_teacher.result_action_array[1] == view_full
                    subject_teacher.result_action_array[2] == status_half
                  subject_teacher.result_action_array[3] == status_full
                -->
              <!--Approve Buttons-->
              <!-- <div
                v-if="(subject_teacher.result_action_array[0]==='true' && subject_teacher.result_action_array[2] !== 'published') || (subject_teacher.result_action_array[1]==='true' && subject_teacher.result_action_array[3] !== 'published')"
                class="demo-inline-spacing"
              > -->
              <div
                class="demo-inline-spacing"
              >
                <b-button
                  v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                  variant="gradient-success"
                  @click="confirmApproval(index,subject_teacher, recordedResultData.sub_term, 'approved');"
                >
                  <feather-icon
                    icon="CheckIcon"
                    class="mr-50"
                  />
                  <span class="align-middle">Approve</span>
                </b-button>
                <b-button
                  v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                  variant="gradient-danger"
                  @click="confirmApproval(index,subject_teacher, recordedResultData.sub_term, 'rejected');"
                >
                  <feather-icon
                    icon="XIcon"
                    class="mr-50"
                  />
                  <span class="align-middle">Reject</span>
                </b-button>
              </div>
              <!--Approve Buttons-->

              <br><br>
              <div v-if="recordedResultData.sub_term == 'half'">
                <approve-half
                  :students="subject_teacher.students"
                  :result-settings="recordedResultData.result_settings"
                />

              </div>
              <div v-if="recordedResultData.sub_term == 'full'">
                <approve-full
                  :students="subject_teacher.students"
                  :result-settings="recordedResultData.result_settings"
                />

              </div>
            </div>
            <div v-else>
              <div class="callout callout-danger">
                No Entry for this subject
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

    </div>
  </div>
</template>
<script>
import {
  BModal, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
// import AppCollapse from '@core/components/el-collapse/AppCollapse.vue'
// import AppCollapseItem from '@core/components/el-collapse/AppCollapseItem.vue'
import Resource from '@/api/resource'
import ApproveHalf from './ApproveHalf.vue'
import ApproveFull from './ApproveFull.vue'

const saveResultAction = new Resource('result/result-action')
const recordedResult = new Resource('result/get-recorded-result')
// const publishClassResult = new Resource('result/get-recorded-result');
export default {
  components: {
    BModal, BButton, /* AppCollapse, AppCollapseItem, */ ApproveHalf, ApproveFull,
  },
  directives: {
    Ripple,
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
    recordedResultData: {
      type: Object,
      default: () => ({
        cant_approve: 0,
      }),
    },
  },

  data() {
    return {
      showPublishModal: false,
      showApprovalModal: false,
      modalMessage: '',
      selectedSubjectTeacher: {
        id: '',
        subject: {
          name: '',
        },
      },
      action: '',
      selectedSubTerm: '',
      selected_index: '',
      load: false,
    }
  },
  // created() {
  //   const app = this
  //   app.fetchRecordedResult()
  // },
  methods: {

    resultAction(assessment, action, subjectTeacherId) {
      const app = this
      const { term_id } = app.recordedResultData
      const sessId = app.recordedResultData.session.id
      const params = {
        id: subjectTeacherId, assessment, action, term_id, sess_id: sessId,
      }

      saveResultAction.store(params)
        .then(response => {
          app.showApprovalModal = false
          app.recordedResultData.subject_teachers[app.selected_index - 1].result_action_array = response.result_action_array
          app.recordedResultData.edit_ca1 = response.edit_ca1
          app.recordedResultData.edit_ca2 = response.edit_ca2
          app.recordedResultData.edit_ca3 = response.edit_ca3
          app.recordedResultData.edit_ca4 = response.edit_ca4
          app.recordedResultData.edit_ca5 = response.edit_ca5
          app.recordedResultData.edit_exam = response.edit_exam
          document.getElementById(`${assessment}_status_${subjectTeacherId}`).innerHTML = ` Status: ${action.toUpperCase()}`

          this.$message(`Result ${action} successfully!`)
        })
        .catch(error => {
          console.log(error)
        })
    },

    formatStatus(status) {
      if (status === 'approve') {
        return `${status}d`
      }
      return `${status}ed`
    },
    publishResult() {
      const app = this
      const { term_id } = app.recordedResultData
      const sessId = app.recordedResultData.session.id
      const publishResult = '1'
      const { sub_term } = app.recordedResultData
      const classTeacherId = app.recordedResultData.class_details.id
      const params = {
        class_teacher_id: classTeacherId,
        sub_term,
        term_id,
        sess_id: sessId,
        publish_result: publishResult,

      }
      const action = 'published'
      recordedResult.list(params)
        .then(() => {
          app.$emit('published')

          app.$message(`${sub_term.toUpperCase()}-Term Result ${action} successfully!`)
          app.showPublishModal = false
        })
        .catch(error => {
          app.$alert(error.response.data.message)
          app.showPublishModal = false
        })
    },
    confirmApproval(index, subjectTeacher, selectedSubTerm, action) {
      const app = this
      app.showApprovalModal = true
      app.selectedSubjectTeacher = subjectTeacher
      app.action = action
      app.selectedSubTerm = selectedSubTerm
      app.selected_index = index
    },
  },

}
</script>
