<template>
  <div class="">
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
          <strong>Kindly fill the form by following the steps below to promote students from one level to another</strong>
          <ol>
            <li>Pick the <code>Past Level</code> of the Students to be promoted</li>
            <li>Pick the <code>Current Level</code> to which the students will be promoted</li>
            <li>Pick the <code>Students</code> that are to be promoted</li>
            <li>Click on the <code>Promote Students</code> Button</li>
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
              variant="danger"
              show
            >
              <div class="alert-body">
                <h5><strong>It is assumed that you are in a new academic session before performing this task</strong></h5>
              </div>
            </b-alert>
          </b-col>
          <b-col
            md="12"
          >
            <b-form-group
              label="Select Past Level"
              label-for="former_level"
            >
              <el-select
                id="former_level"
                v-model="level_id"
                style="width: 100%;"
                placeholder="Select Past Level"
                filterable
                @input="fetchStudents()"
              >
                <el-option
                  v-for="(level, index) in levels"
                  :key="index"
                  :label="level.level"
                  :value="level.id"
                />
              </el-select>
              <!-- <v-select
                id="level"
                v-model="selectedLevel"
                :options="levels"
                label="level"
                @input="setClass()"
              /> -->
            </b-form-group>
          </b-col>
          <b-col
            md="12"
          >
            <b-form-group
              label="Select Current Level"
              label-for="next_level"
            >
              <el-select
                id="next_level"
                v-model="form.promote_next_level_id"
                style="width: 100%;"
                placeholder="Select Current Level"
                filterable
              >
                <el-option
                  v-for="(level, index) in levels"
                  :key="index"
                  :label="level.level"
                  :value="level.id"
                />
                <el-option
                  label="Alumni"
                  value="alumni"
                />
              </el-select>
            </b-form-group>
          </b-col>
          <b-col
            v-if="form.promote_next_level_id !== ''"
            md="12"
          >
            <b-form-group
              label="Select Students to be promoted (multiple selection allowed)"
              label-for="class"
            >
              <el-switch
                v-model="promote_all"
                style="display: block"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="Promote All"
                inactive-text=""
                @change="setPromoteAll()"
              />
              <br>
              <el-select
                id="class"
                v-model="form.promote_student_id"
                style="width: 100%;"
                placeholder="Select Promotable Students"
                multiple
                filterable
                collapse-tags
              >
                <el-option
                  v-for="(student, index) in students"
                  :key="index"
                  :label="`${student.user.first_name} ${student.user.last_name} | ${student.user.username}`"
                  :value="student.id"
                />
              </el-select>
            </b-form-group>

            <el-button
              type="primary"
              @click="promoteStudents()"
            >
              Promote Students
            </el-button>
          </b-col>
        </b-row>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import {
  BAlert,
  BRow,
  BCol,
  BFormGroup,
} from 'bootstrap-vue'
// import vSelect from 'vue-select'
// import UploadExcelComponent from '@/views/components/UploadExcel/index.vue'
import Resource from '@/api/resource'

export default {
  name: 'UploadBulk',
  components: {
    BAlert,
    BRow,
    BCol,
    BFormGroup,
    // vSelect,
    // UploadExcelComponent,
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
        promote_next_level_id: '',
        promote_student_id: [],
      },
      level_id: '',
      levels: [],
      selectedLevel: '',
      students: [],
      promote_all: true,

    }
  },
  created() {
    this.fetchLevels()
  },
  methods: {
    fetchLevels() {
      const app = this
      const fetchLevelsResource = new Resource('school-setup/levels')
      fetchLevelsResource.list()
        .then(response => {
          app.levels = response.levels
        })
    },
    fetchStudents() {
      const app = this
      const param = { level_id: app.level_id }
      const fetchLevelStudentsResource = new Resource('user-setup/level-students')
      fetchLevelStudentsResource.list(param)
        .then(response => {
          app.students = response.students
          app.setPromoteAll()
        })
    },
    promoteStudents() {
      const app = this
      const param = app.form
      const fetchLevelStudentsResource = new Resource('user-setup/promote-students')
      fetchLevelStudentsResource.store(param)
        .then(() => {
          app.form = {
            promote_next_level_id: '',
            promote_student_id: [],
          }
          app.$message('Promotion Successful')
        })
    },
    setPromoteAll() {
      const app = this
      const promoteAll = app.promote_all
      const promoteStudentId = []
      if (promoteAll) {
        app.students.forEach(student => {
          promoteStudentId.push(student.id)
        })
      }
      app.form.promote_student_id = promoteStudentId
    },
  },
}
</script>
<style scoped>
  .red {
    color: #c40505;
  }
</style>
