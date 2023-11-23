<template>
  <b-tabs
    v-loading="load"
    type="border-card"
  >
    <b-tab
      v-if="checkPermission(['can manage results'])"
      lazy
    >
      <template
        #title
      >
        <div class="no-print">
          <feather-icon icon="CheckIcon" />
          <span>Approve Result</span>
        </div>
      </template>
      <approve-result
        v-if="recordedResultData"
        :recorded-result-data="recordedResultData"
        :params="params"
        @published="fetchRecordedResult"
      />
    </b-tab>

    <b-tab
      v-if="checkPermission(['can manage results']) || checkRole(['teacher'])"
      lazy
      @click="fetchBroadSheet"
    >
      <template
        #title
      >
        <div class="no-print">
          <feather-icon icon="BookOpenIcon" />
          <span>Class Broad Sheet</span>
        </div>
      </template>
      <broad-sheet
        v-if="broadSheetData"
        :broad-sheet-data="broadSheetData"
        :params="params"
      />

    </b-tab>
    <b-tab
      v-if="checkPermission(['can manage results']) || checkRole(['teacher'])"
      lazy
    >
      <template
        #title
      >
        <div class="no-print">
          <feather-icon icon="MessageCircleIcon" />
          <span>Class Teacher Remark</span>
        </div>
      </template>
      <class-teacher-remark
        v-if="broadSheetData"
        :broad-sheet-data="broadSheetData"
        :params="params"
      />
    </b-tab>
    <b-tab
      v-if="checkPermission(['can manage results'])"
      lazy
    >
      <template
        #title
      >
        <div class="no-print">
          <feather-icon icon="MessageCircleIcon" />
          <span>Principal/Head Teacher Remark</span>
        </div>
      </template>
      <principal-remark
        v-if="broadSheetData"
        :broad-sheet-data="broadSheetData"
        :params="params"
      />
    </b-tab>
    <b-tab
      v-if="checkPermission(['can manage results']) || checkRole(['teacher'])"
      lazy
    >
      <template
        #title
      >
        <div class="no-print">
          <feather-icon icon="PrinterIcon" />
          <span>Print Bulk</span>
        </div>
      </template>
      <print-bulk-result
        :broad-sheet-data="broadSheetData"
        :params="params"
      />
    </b-tab>
  </b-tabs>
</template>
<script>
import {
  BTab, BTabs,
} from 'bootstrap-vue'
import Resource from '@/api/resource'
import checkRole from '@/utils/role'
import checkPermission from '@/utils/permission'
import ApproveResult from './approval/ViewRecordedResult.vue'
import BroadSheet from './BroadSheetTable.vue'
import ClassTeacherRemark from './ClassTeacherRemark.vue'
import PrincipalRemark from './PrincipalRemark.vue'
import PrintBulkResult from './PrintBulkResult.vue'

const getResultBroadSheet = new Resource('result/class-broadsheet')

const recordedResult = new Resource('result/get-recorded-result')
export default {
  components: {
    ApproveResult,
    BroadSheet,
    ClassTeacherRemark,
    PrincipalRemark,
    PrintBulkResult,
    BTab,
    BTabs,
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      broadSheetData: null,
      recordedResultData: null,
      load: false,
    }
  },
  created() {
    const app = this
    app.fetchRecordedResult()
    app.fetchBroadSheet()
  },
  methods: {
    checkPermission,
    checkRole,
    fetchRecordedResult() {
      const app = this
      const param = app.params

      // let param = {

      //   sess_id: app.$route.params.sess_id,
      //   term_id: app.$route.params.term_id,
      //   sub_term: app.$route.params.sub_term,
      //   class_teacher_id: app.$route.params.class_teacher_id,
      // };
      app.load = true
      recordedResult.list(param, false)
        .then(response => {
          app.recordedResultData = response
          app.load = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    fetchBroadSheet() {
      const app = this
      const param = app.params
      // app.loader = true
      // let param = {

      //   sess_id: app.$route.params.sess_id,
      //   term_id: app.$route.params.term_id,
      //   sub_term: app.$route.params.sub_term,
      //   class_teacher_id: app.$route.params.class_teacher_id,
      // };

      getResultBroadSheet.list(param)
        .then(response => {
          app.broadSheetData = response
          app.loader = false
          // setTimeout(() => { app.setDataTable() }, 0)// delay for zero seconds
        })
        .catch(error => {
          console.log(error)
        })
    },
    // fetchBroadSheet() {
    //   const app = this
    //   const param = app.params

    //   // let param = {

    //   //   sess_id: app.$route.params.sess_id,
    //   //   term_id: app.$route.params.term_id,
    //   //   sub_term: app.$route.params.sub_term,
    //   //   class_teacher_id: app.$route.params.class_teacher_id,
    //   // };

    //   getResultBroadSheet.list(param)
    //     .then(response => {
    //       app.broadSheetData = response

    //       setTimeout(() => { app.setDataTable() }, 0)// delay for zero seconds
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
    // },
    setDataTable() {
      const app = this
      // app.order_column = Object.keys(app.broadSheetData.result_subjects).length + 3;
      if (app.broadSheetData) {
        // const oTable = $('.datatable').DataTable('refresh')
      }
    },
  },
}
</script>
