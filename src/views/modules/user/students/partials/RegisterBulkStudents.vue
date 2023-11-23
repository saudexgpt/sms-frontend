<template>
  <div v-loading="load">
    <el-row
      :gutter="10"
      class="padded"
    >
      <el-col
        :xs="24"
        :sm="12"
        :md="12"
      >
        <div style="background: #f0f0f0; color:#000000; padding: 10px;">
          <strong>Kindly follow the steps below to register students in bulk (per class) from csv file.</strong>
          <ol>
            <li><code><a @click="handleDownload">Download CSV Format</a></code> to get the file format</li>
            <li>Open with a spreadsheet package, example Microsoft Excel package</li>
            <li>Leave the Table Header Names the way they are and <strong class="red">DO NOT MODIFY THEM</strong></li>
            <li>Fill the downloaded csv file accordingly as guided by the Header Names. Each row for an entry. Where no data exist for a column, fill in a NIL. <br><strong class="red">DO NOT leave any cell blank.</strong></li>
            <!-- <li>Delete the two sample entries given to guide you and start from row number two (2) in the file.</li> -->
            <li>When done with all entries, SAVE your file with .csv (Comma delimited) file extension. <strong class="red">For example students.csv</strong></li>
            <li>Fill the form accordingly and select the file from where you saved</li>
            <li>Preview your work and click on SUBMIT if satisfied</li>
            <li>CONGRATULATIONS!!! You are done.</li>
          </ol>
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="12"
        :md="12"
      >
        <b-row>
          <b-col
            cols="12"
            class="mb-2"
          >
            <b-alert
              variant="primary"
              show
            >
              <div class="alert-body">
                <h5><strong>Fill the Form below</strong></h5>
              </div>
            </b-alert>
          </b-col>
          <b-col
            md="12"
          >
            <b-form-group
              label="Select Students Level"
              label-for="level"
            >
              <v-select
                id="level"
                v-model="selectedLevel"
                :options="levels"
                label="level"
                @input="setClass()"
              />
            </b-form-group>
          </b-col>
          <b-col
            md="12"
          >
            <b-form-group
              label="Select Students Class"
              label-for="class"
            >
              <el-select
                id="class"
                v-model="form.class_teacher_id"
                style="width: 100%;"
                placeholder="Select Class"
              >
                <el-option
                  v-for="(class_teacher, index) in classes"
                  :key="index"
                  :label="class_teacher.c_class.name"
                  :value="class_teacher.id"
                />
              </el-select>
            </b-form-group>
          </b-col>
          <b-col md="12">
            <upload-excel-component
              :on-success="handleSuccess"
            />
          </b-col>
        </b-row>
      </el-col>
    </el-row>
    <legend v-if="tableData.length > 0">
      Preview what you just uploaded and then click on the submit button. <a
        class="btn btn-success"
        @click="submitBulkStudent"
      >SUBMIT</a>
    </legend>
    <div style="height: 600px; overflow:auto;">
      <el-table
        :data="tableData"
        border
        highlight-current-row
        style="width: 100%;margin-top:20px;"
      >
        <el-table-column
          v-for="item of tableHeader"
          :key="item"
          :prop="item"
          :label="item"
        />
      </el-table>
    </div>
    <legend v-if="tableData.length > 0">
      Click on the submit button. <a
        class="btn btn-success"
        @click="submitBulkStudent"
      >SUBMIT</a>
    </legend>
  </div>

</template>

<script>
import {
  BAlert,
  BRow,
  BCol,
  BFormGroup,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import UploadExcelComponent from '@/views/components/UploadExcel/index.vue'
import Resource from '@/api/resource'

const uploadBulkStudents = new Resource('user-setup/students/upload/bulk')

export default {
  name: 'UploadBulk',
  components: {
    BAlert,
    BRow,
    BCol,
    BFormGroup,
    vSelect,
    UploadExcelComponent,
  },
  // props: {
  //   params: {
  //     type: Object,
  //     default: () => ({}),
  //   },
  //   itemsInStock: {
  //     type: Array,
  //     default: () => ([]),
  //   },

  //   bulkUpload: {
  //     type: Boolean,
  //     default: () => ({
  //       option: true,
  //     }),
  //   },
  //   page: {
  //     type: Object,
  //     default: () => ({
  //       option: 'add_new',
  //     }),
  //   },
  // },
  data() {
    return {
      fill_fields_error: false,
      tableData: [],
      tableHeader: [],
      form: {
        level_id: '',
        class_teacher_id: '',
        bulk_data: [],
      },
      levels: [],
      selectedLevel: '',
      classes: [],
      load: false,

    }
  },
  created() {
    this.fetchFormDetails()
  },
  methods: {
    fetchFormDetails() {
      const app = this
      const fetchCurriculumSetupResource = new Resource('user-setup/students/create')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.levels = response.levels
        })
    },
    setClass() {
      const app = this
      app.form.level_id = app.selectedLevel.id
      app.form.class_teacher_id = app.selectedLevel.class_teachers[0].id
      app.classes = app.selectedLevel.class_teachers
    },
    handleDownload() {
      // this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        // const multiHeader = [['List of Products', '', '', '', '']];
        const tHeader = ['SURNAME', 'OTHER_NAMES', 'GENDER', 'DOB', /* 'LEVEL', 'CLASS', */ 'ADMISSION_NO', 'ADMISSION_YEAR', 'PARENT_FIRST_NAME', 'PARENT_LAST_NAME', 'PARENT_PHONE_1', 'PARENT_PHONE_2', 'PARENT_EMAIL', 'PARENT_OCCUPATION', 'RESIDENTIAL_ADDRESS', 'RELIGION']
        // const filterVal = []
        // const list = [] // this.items
        const data = [] // this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          // multiHeader,
          header: tHeader,
          data,
          filename: 'Students Information Bulk Upload Sample',
          autoWidth: true,
          bookType: 'csv',
        })
        // this.downloadLoading = false
      })
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      // console.log(results);
    },
    submitBulkStudent() {
      const app = this
      const { form } = app
      if (form.level_id === '') {
        app.$message({ message: 'Please select a level and class', type: 'danger' })
      } else {
        app.load = true
        form.bulk_data = app.tableData
        uploadBulkStudents.store(form)
          .then(response => {
            app.load = false
            app.tableData = response.unsaved_data
            if (app.tableData.length > 0) {
              app.$alert('Some data could not be uploaded. Possible cause may be duplicate student Admission Number')
            } else {
              app.tableHeader = []
              app.$message({ message: 'Bulk upload Successful!!!', type: 'success' })
            }
          })
          .catch(error => {
            app.load = false
            app.$message({ message: error, type: 'danger' })
          })
      }
    },

  },
}
</script>
<style scoped>
  .red {
    color: #c40505;
  }
</style>
