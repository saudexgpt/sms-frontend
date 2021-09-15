<template>
  <div>
    <div
      class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
      style="background: #f0f0f0; color:#000000; padding: 10px;"
    >
      <strong>Kindly follow the steps below to record students results in bulk from csv file.</strong>
      <ol>
        <li>Click the <code>Download CSV Format</code> button to get the file format as previewed below</li>
        <li>Open with a spreadsheet package, example Microsoft Excel package</li>
        <li>Leave the Table Header Names the way they are and <span class="red">DO NOT MODIFY THEM</span></li>
        <li>Enter your scores accordingly for each student as guided by the header names</li>
        <li>When done with all entries, SAVE your file with .csv (Comma delimited) file extension. <strong class="red">For example student_result.csv</strong></li>
        <li>Use the form to select the file from where you saved it and click on UPLOAD</li>
        <li>CONGRATULATIONS!!! You are done.</li>
      </ol>
    </div>
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-horizontal">

      <form
        enctype="multipart/form-data"
        @submit.prevent="uploadBulkResult()"
      >

        <div class="col-sm-12">
          <legend align="center">
            Upload your saved result file here.
          </legend>
          <div class="col-sm-6">
            <div class="form-group ">
              <label>Click to select file</label>

              <input
                type="file"
                class="form-control"
                @change="onImageChange"
              >

            </div>
          </div>
          <div class="col-sm-6">
            <div class="form-group ">
              <p>&nbsp;</p>
              &nbsp;<button
                type="submit"
                class="btn btn-primary"
              >
                <i class="fa fa-cloud-upload" /> Upload
              </button>
            </div>
          </div>
        </div>
      </form>
      <div id="upload_status" />
    </div>
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <hr>
      <div align="center">
        <el-button
          class="filter-item"
          type="danger"
          icon="el-icon-download"
          @click="handleDownload"
        >
          Download CSV Format
        </el-button>
      </div>
      <v-client-table
        :data="studentData.students"
        :columns="columns"
        :options="options"
      >
        <template
          slot="name"
          slot-scope="props"
          aria-sort="ascending"
        >
          {{ props.row.name }}
        </template>
        <template
          slot="registration_no"
          slot-scope="props"
        >
          {{ props.row.registration_no }}
        </template>
        <template
          slot="ca1"
          slot-scope="props"
        >
          {{ props.row.result_detail.ca1 }}

        </template>
        <template
          slot="ca2"
          slot-scope="props"
        >
          {{ props.row.result_detail.ca2 }}
        </template>
        <template
          slot="ca3"
          slot-scope="props"
        >
          {{ props.row.result_detail.ca3 }}
        </template>
        <template
          slot="exam"
          slot-scope="props"
        >
          {{ props.row.result_detail.exam }}

        </template>
        <template
          slot="effort"
          slot-scope="props"
        >
          {{ props.row.result_detail.effort }}

        </template>
        <template
          slot="class_behavior"
          slot-scope="props"
        >
          {{ props.row.result_detail.behavior }}

        </template>
        <template
          slot="comments"
          slot-scope="props"
        >
          {{ props.row.result_detail.comments }}
        </template>

      </v-client-table>
    </div>

    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 form-horizontal">
      <span class="bg-red padded">Key for academic-effort and class-behavior</span>
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Letter</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(rating, index) in ratings"
            :key="index"
          >
            <td>{{ rating.value }}</td>
            <td>{{ rating.label }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import Resource from '@/api/resource'
// import HalfTerm from './HalfTerm.vue';
// import FullTerm from './FullTerm.vue';
// import waves from '@/directive/waves'

const uploadBulk = new Resource('result/upload-bulk-result') // Waves directive
export default {

  // directives: { waves },
  components: {
    // HalfTerm, FullTerm,
  },
  props: {
    studentData: {
      type: Object,
      default: () => ({}),
    },
    selectionForm: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      columns: ['registration_no', 'name', 'ca1', 'ca2', 'ca3', 'exam', 'effort', 'class_behavior', 'comments'],
      options: {
        headings: {
          registration_no: 'STUDENT_ID',
          name: 'STUDENT_NAME',
          ca1: 'CA_1',
          ca2: 'CA_2',
          ca3: 'CA_3',
          exam: 'EXAM',
          effort: 'ACADEMIC_EFFORT',
          class_behavior: 'CLASS_BEHAVIOUR',
          comments: 'REMARK',
        },
        sortable: ['registration_no', 'name'],
        filterable: ['registration_no', 'name'],

      },
      exportable_data: [],
      form: {
        subject_teacher_id: '',
        result_csv_file: '',

      },
      result_csv_file: '',
      ratings: [
        { value: 5, label: 'Excellent' },
        { value: 4, label: 'Very Good' },
        { value: 3, label: 'Good' },
        { value: 2, label: 'Average' },
        { value: 1, label: 'Fair' },

      ],
    }
  },
  created() {
    this.prepareExportData()
  },
  methods: {
    prepareExportData() {
      const app = this
      const data = []
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < app.studentData.students.length; index++) {
        const eachStudent = app.studentData.students[index]
        eachStudent.ca1 = eachStudent.result_detail.ca1
        eachStudent.ca2 = eachStudent.result_detail.ca2
        eachStudent.ca3 = eachStudent.result_detail.ca3
        eachStudent.exam = eachStudent.result_detail.exam
        eachStudent.effort = eachStudent.result_detail.effort
        eachStudent.class_behavior = eachStudent.result_detail.behavior
        eachStudent.comments = eachStudent.result_detail.comments

        data.push(eachStudent)
      }
      app.exportable_data = data
    },
    onImageChange(e) {
      const app = this
      // eslint-disable-next-line prefer-destructuring
      app.form.result_csv_file = e.target.files[0]
      app.form.subject_teacher_id = app.studentData.subject_teacher_id
    },
    uploadBulkResult() {
      const app = this
      const formData = new FormData()
      formData.append('result_csv_file', app.form.result_csv_file)
      formData.append('subject_teacher_id', app.form.subject_teacher_id)
      formData.append('sess_id', app.selectionForm.sess_id)
      formData.append('term_id', app.selectionForm.term_id)
      formData.append('sub_term', app.selectionForm.sub_term)
      formData.append('csv', app.selectionForm.csv)
      uploadBulk.store(formData)
        .then(response => {
          if (response.message === 'success') {
            app.studentData.students = response.students
            this.$message('Bulk result upload successful!!!')
          } else {
            this.$message(response.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleDownload() {
      import('@/vendor/Export2Excel').then(excel => {
        const filterVal = this.columns
        const tHeader = ['STUDENT_ID', 'STUDENT_NAME', 'CA_1', 'CA_2', 'CA_3', 'EXAM', 'ACADEMIC_EFFORT', 'CLASS_BEHAVIOUR', 'REMARK']
        const data = this.formatJson(filterVal, this.exportable_data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'student_result',
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
  },

}
</script>
