<template>
  <div v-loading="load">
    <el-select
      v-model="form.curriculum_level_group_id"
      style="width: 100%"
      placeholder="Select Level Group"
      @change="showTable = true"
    >
      <el-option
        v-for="(curriculum_level, index) in curriculum_levels"
        :key="index"
        :label="curriculum_level.name"
        :value="curriculum_level.id"
      />
    </el-select>
    <hr>
    <el-row
      v-if="showTable"
      :gutter="2"
      class="padded"
    >
      <el-col>
        <div style="overflow: auto">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th />
                <th>Grade</th>
                <th>Interpretation</th>
                <th>Upper limit</th>
                <th>Lower Limit</th>
                <th>Grade point</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(grade, index) in grades"
                :key="index"
              >
                <td>
                  <span>
                    <b-button
                      variant="outline-danger"
                      class="btn-icon rounded-circle"
                      @click="removeLine(index)"
                    >
                      <feather-icon icon="Trash2Icon" />
                    </b-button>
                    <b-button
                      v-if="index + 1 === grades.length"
                      variant="outline-primary"
                      class="btn-icon rounded-circle"
                      @click="addLine(index)"
                    >
                      <feather-icon icon="PlusIcon" />
                    </b-button>

                  </span>
                </td>
                <td>
                  <el-input
                    v-model="grade.grade"
                    type="text"
                    outline
                    placeholder="Ex: A+"
                    min="3"
                  />
                </td>
                <td>
                  <el-input
                    v-model="grade.interpretation"
                    type="text"
                    outline
                    placeholder="Ex: Excellent"
                  />
                </td>
                <td>
                  <el-input
                    v-model="grade.upper_limit"
                    type="text"
                    outline
                    placeholder="Ex: 100"
                  />
                </td>
                <td>
                  <el-input
                    v-model="grade.lower_limit"
                    type="text"
                    outline
                    placeholder="Ex: 75"
                  />
                </td>
                <td>
                  <el-input
                    v-model="grade.grade_point"
                    type="text"
                    outline
                    placeholder="Ex: 5"
                  />
                </td>
              </tr>
              <tr v-if="fill_fields_error">
                <td colspan="6">
                  <b-alert
                    variant="danger"
                    show
                  >
                    <div class="alert-body">
                      <span>Please fill all empty fields before adding another row</span>
                    </div>
                  </b-alert>
                </td>
              </tr>
              <tr>
                <td colspan="6">
                  <b-button
                    variant="gradient-success"
                    @click="submitGrades()"
                  >
                    Submit
                  </b-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { BButton, BAlert } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: { BButton, BAlert },
  directives: {
    Ripple,
  },
  data() {
    return {
      showTable: false,
      curriculum_levels: [],
      form: {
        curriculum_level_group_id: '',
      },
      grades: [],
      fill_fields_error: false,
      load: false,
    }
  },
  watch: {
    grades() {
      this.blockRemoval = this.grades.length <= 1
    },
  },
  created() {
    this.fetchLevels()
    this.addLine()
  },
  methods: {
    addLine() {
      this.fill_fields_error = false

      const checkEmptyLines = this.grades.filter(
        detail => detail.grade === ''
          || detail.interpretation === ''
          || detail.upper_limit === ''
          || detail.lower_limit === ''
          || detail.grade_point === '',
      )

      if (checkEmptyLines.length >= 1 && this.grades.length > 0) {
        this.fill_fields_error = true
        // this.grades[index].seleted_category = true;
      } else {
        // if (this.grades.length > 0)
        //     this.grades[index].grade = '';
        this.grades.push({
          grade: '',
          interpretation: '',
          upper_limit: '',
          lower_limit: '',
          grade_point: '',
        })
      }
    },
    removeLine(detailId) {
      this.fill_fields_error = false
      if (!this.blockRemoval) {
        this.grades.splice(detailId, 1)
      }
    },
    fetchLevels() {
      const app = this
      app.load = true
      const gradesResources = new Resource('result/grades/create')
      gradesResources.list().then(response => {
        app.curriculum_levels = response.curriculum_levels
        app.load = false
      })
    },
    submitGrades() {
      const app = this
      const checkEmptyLines = this.grades.filter(
        detail => detail.grade === ''
          || detail.interpretation === ''
          || detail.upper_limit === ''
          || detail.lower_limit === ''
          || detail.grade_point === '',
      )

      if (checkEmptyLines.length >= 1 && this.grades.length > 0) {
        app.$alert('Please fill all empty fields before submitting')
      } else {
        app.load = true
        const saveGradesResources = new Resource('result/grades')
        const param = app.form
        param.grades = app.grades
        saveGradesResources.store(param).then(() => {
          app.load = false
          app.$emit('returnToPage', 'list')
        }).catch(error => {
          app.$message(error.response.data.meesage)
          app.load = false
        })
      }
    },
  },
}
</script>
