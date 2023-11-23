<template>
  <div v-loading="load">
    <table class="table table-striped">
      <tbody>
        <tr>
          <th>
            Full Term Result Score Presentation
          </th>
          <th>
            <el-tooltip
              :content="'Current Value: ' + resultSettingForm.display_exam_score_only_for_full_term"
              placement="top"
            >
              <el-switch
                v-model="resultSettingForm.display_exam_score_only_for_full_term"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="yes"
                inactive-value="no"
                active-text="Exams Only"
                inactive-text="CA + Exams"
                @change="setExamLimit(); resultSettingForm.no_of_ca_for_midterm = 1;"
              />
            </el-tooltip>
          </th>
        </tr>
        <tr>
          <th>
            No. of Continuous Assessment for a Half Term <code>Max: 2</code>
          </th>
          <th>
            <el-select
              v-model="resultSettingForm.no_of_ca_for_midterm"
              :disabled="resultSettingForm.display_exam_score_only_for_full_term === 'yes' || resultSettingForm.display_exam_score_only_for_full_term === '1'"
            >
              <el-option
                v-for="(ca, index) in 2"
                :key="index"
                :value="ca"
                :label="ca"
              />
            </el-select>
          </th>
        </tr>
        <tr>
          <th>
            No. of Continuous Assessment for a Full Term <code>After Half Term</code>
          </th>
          <th>
            <el-select
              v-model="resultSettingForm.no_of_ca"
              :disabled="resultSettingForm.display_exam_score_only_for_full_term === 'yes' || resultSettingForm.display_exam_score_only_for_full_term === '1'"
              @input="resultSettingForm.no_of_ca_for_midterm = 1; setExamLimit()"
            >
              <el-option
                v-for="(ca, index) in 5"
                :key="index"
                :value="ca"
                :label="ca"
              />
            </el-select>
          </th>
        </tr>
        <tr>
          <th>
            Add Half Term Score to Full Term Result?
          </th>
          <th>
            <el-tooltip
              :content="'Current Value: ' + resultSettingForm.add_midterm_score_to_full_result"
              placement="top"
            >
              <el-switch
                v-model="resultSettingForm.add_midterm_score_to_full_result"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="yes"
                inactive-value="no"
                active-text="Yes"
                inactive-text="No"
                :disabled="resultSettingForm.display_exam_score_only_for_full_term === 'yes' || resultSettingForm.display_exam_score_only_for_full_term === '1'"
                @change="resultSettingForm.midterm_score_limit = 0; setExamLimit();"
              />
            </el-tooltip>
          </th>
        </tr>
        <tr v-if="resultSettingForm.add_midterm_score_to_full_result === 'yes'">
          <th>
            Half Term Score limit (<code>if to be added to full term result</code>)
          </th>
          <th>
            <el-input-number
              v-model="resultSettingForm.midterm_score_limit"
              :min="0"
              :max="100"
              :disabled="resultSettingForm.add_midterm_score_to_full_result === 'no' || resultSettingForm.display_exam_score_only_for_full_term === 'yes' ||
                resultSettingForm.display_exam_score_only_for_full_term === '1'"
              @input="setExamLimit()"
            />
          </th>
        </tr>
        <tr>
          <th>
            Add Attendance Score to Full Term Result?
          </th>
          <th>
            <el-tooltip
              :content="'Current Value: ' + resultSettingForm.add_attendance_to_ca"
              placement="top"
            >
              <el-switch
                v-model="resultSettingForm.add_attendance_to_ca"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="yes"
                inactive-value="no"
                active-text="Yes"
                inactive-text="No"
                :disabled="resultSettingForm.display_exam_score_only_for_full_term === 'yes' || resultSettingForm.display_exam_score_only_for_full_term === '1'"
                @change="resultSettingForm.attendance_score_limit = 0; setExamLimit();"
              />
            </el-tooltip>
          </th>
        </tr>
        <tr v-if="resultSettingForm.add_attendance_to_ca === 'yes'">
          <th>
            Attendance Score limit (<code>if to be added to full term result</code>)
          </th>
          <th>
            <el-input-number
              v-model="resultSettingForm.attendance_score_limit"
              :min="0"
              :max="100"
              :disabled="resultSettingForm.add_attendance_to_ca === 'no' || resultSettingForm.display_exam_score_only_for_full_term === 'yes' ||
                resultSettingForm.display_exam_score_only_for_full_term === '1'"
              @input="setExamLimit()"
            />
          </th>
        </tr>
        <tr
          v-for="(ca, index2) in resultSettingForm.no_of_ca"
          :key="index2"
        >
          <th>
            Continuous Assessment {{ ca }} Score Limit
          </th>
          <th>
            <el-input-number
              v-if="ca === 1"
              v-model="resultSettingForm.ca1"
              :min="0"
              :max="100"
              :disabled="resultSettingForm.display_exam_score_only_for_full_term === 'yes' || resultSettingForm.display_exam_score_only_for_full_term === '1'"
              @input="setExamLimit()"
            />
            <el-input-number
              v-if="ca === 2"
              v-model="resultSettingForm.ca2"
              :min="0"
              :max="100"
              :disabled="resultSettingForm.display_exam_score_only_for_full_term === 'yes' || resultSettingForm.display_exam_score_only_for_full_term === '1'"
              @input="setExamLimit()"
            />
            <el-input-number
              v-if="ca === 3"
              v-model="resultSettingForm.ca3"
              :min="0"
              :max="100"
              :disabled="resultSettingForm.display_exam_score_only_for_full_term === 'yes' || resultSettingForm.display_exam_score_only_for_full_term === '1'"
              @input="setExamLimit()"
            />
            <el-input-number
              v-if="ca === 4"
              v-model="resultSettingForm.ca4"
              :min="0"
              :max="100"
              :disabled="resultSettingForm.display_exam_score_only_for_full_term === 'yes' || resultSettingForm.display_exam_score_only_for_full_term === '1'"
              @input="setExamLimit()"
            />
            <el-input-number
              v-if="ca === 5"
              v-model="resultSettingForm.ca5"
              :min="0"
              :max="100"
              :disabled="resultSettingForm.display_exam_score_only_for_full_term === 'yes' || resultSettingForm.display_exam_score_only_for_full_term === '1'"
              @input="setExamLimit()"
            />
          </th>
        </tr>
        <tr>
          <th>
            Exam Score Limit
          </th>
          <th>
            <el-input-number
              v-model="resultSettingForm.exam"
              :min="0"
              :max="100"
              :disabled="true"
            />
          </th>
        </tr>

        <tr>
          <th>
            Display Students' Class Position on Result Sheet?
          </th>
          <th>
            <el-tooltip
              :content="'Current Value: ' + resultSettingForm.display_student_position"
              placement="top"
            >
              <el-switch
                v-model="resultSettingForm.display_student_position"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="yes"
                inactive-value="no"
                active-text="Yes"
                inactive-text="No"
              />
            </el-tooltip>
          </th>
        </tr>
        <tr>
          <th>
            Display Students' Subject Position on Result Sheet?
          </th>
          <th>
            <el-tooltip
              :content="'Current Value: ' + resultSettingForm.display_student_subject_position"
              placement="top"
            >
              <el-switch
                v-model="resultSettingForm.display_student_subject_position"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="yes"
                inactive-value="no"
                active-text="Yes"
                inactive-text="No"
              />
            </el-tooltip>
          </th>
        </tr>
        <tr>
          <th>
            Display Subject Highest Score on Result Sheet?
          </th>
          <th>
            <el-tooltip
              :content="'Current Value: ' + resultSettingForm.display_highest_score"
              placement="top"
            >
              <el-switch
                v-model="resultSettingForm.display_highest_score"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="yes"
                inactive-value="no"
                active-text="Yes"
                inactive-text="No"
              />
            </el-tooltip>
          </th>
        </tr>
        <tr>
          <th>
            Display Subject Lowest Score on Result Sheet?
          </th>
          <th>
            <el-tooltip
              :content="'Current Value: ' + resultSettingForm.display_lowest_score"
              placement="top"
            >
              <el-switch
                v-model="resultSettingForm.display_lowest_score"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="yes"
                inactive-value="no"
                active-text="Yes"
                inactive-text="No"
              />
            </el-tooltip>
          </th>
        </tr>
        <tr>
          <th>
            Display Class Average Score on Result Sheet?
          </th>
          <th>
            <el-tooltip
              :content="'Current Value: ' + resultSettingForm.display_class_average_score"
              placement="top"
            >
              <el-switch
                v-model="resultSettingForm.display_class_average_score"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="yes"
                inactive-value="no"
                active-text="Yes"
                inactive-text="No"
              />
            </el-tooltip>
          </th>
        </tr>
        <tr>
          <th>
            Display Student's Class Average Score on Result Sheet?
          </th>
          <th>
            <el-tooltip
              :content="'Current Value: ' + resultSettingForm.display_student_class_average"
              placement="top"
            >
              <el-switch
                v-model="resultSettingForm.display_student_class_average"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="yes"
                inactive-value="no"
                active-text="Yes"
                inactive-text="No"
              />
            </el-tooltip>
          </th>
        </tr>
        <tr>
          <th>
            Display Student's Subject Average Score on Result Sheet?
          </th>
          <th>
            <el-tooltip
              :content="'Current Value: ' + resultSettingForm.display_student_subject_average"
              placement="top"
            >
              <el-switch
                v-model="resultSettingForm.display_student_subject_average"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="yes"
                inactive-value="no"
                active-text="Yes"
                inactive-text="No"
              />
            </el-tooltip>
          </th>
        </tr>
        <tr>
          <th>
            Display Students' Grades on Result Sheet?
          </th>
          <th>
            <el-tooltip
              :content="'Current Value: ' + resultSettingForm.display_grade"
              placement="top"
            >
              <el-switch
                v-model="resultSettingForm.display_grade"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="yes"
                inactive-value="no"
                active-text="Yes"
                inactive-text="No"
              />
            </el-tooltip>
          </th>
        </tr>
        <tr>
          <th>
            Display Students' Behavioural/Skills Ratings on Result Sheet?
          </th>
          <th>
            <el-tooltip
              :content="'Current Value: ' + resultSettingForm.display_student_behovior_and_skill_rating"
              placement="top"
            >
              <el-switch
                v-model="resultSettingForm.display_student_behovior_and_skill_rating"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="yes"
                inactive-value="no"
                active-text="Yes"
                inactive-text="No"
              />
            </el-tooltip>
          </th>
        </tr>
        <tr>
          <th>
            Display Logo for result background?
          </th>
          <th>
            <el-tooltip
              :content="'Current Value: ' + resultSettingForm.display_logo_for_result_background"
              placement="top"
            >
              <el-switch
                v-model="resultSettingForm.display_logo_for_result_background"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="yes"
                inactive-value="no"
                active-text="Yes"
                inactive-text="No"
              />
            </el-tooltip>
          </th>
        </tr>
        <tr>
          <th>
            Display school name on result?
          </th>
          <th>
            <el-tooltip
              :content="'Current Value: ' + resultSettingForm.display_school_name_on_result"
              placement="top"
            >
              <el-switch
                v-model="resultSettingForm.display_school_name_on_result"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="yes"
                inactive-value="no"
                active-text="Yes"
                inactive-text="No"
              />
            </el-tooltip>
          </th>
        </tr>
        <tr>
          <th>
            Display school address on result?
          </th>
          <th>
            <el-tooltip
              :content="'Current Value: ' + resultSettingForm.display_school_address_on_result"
              placement="top"
            >
              <el-switch
                v-model="resultSettingForm.display_school_address_on_result"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="yes"
                inactive-value="no"
                active-text="Yes"
                inactive-text="No"
              />
            </el-tooltip>
          </th>
        </tr>
        <tr>
          <th>
            Set Result Sheet Logo
          </th>
          <th>
            <img
              align="center"
              :src="baseServerUrl +'storage/'+ resultSettingForm.logo"
              alt="Result Logo"
              width="150"
            ><br>
            <label>Select Custom Logo</label>
            <input
              type="file"
              class="form-control"
              @change="onImageChange"
            >
            OR <br>
            <el-button
              @click="resultSettingForm.use_school_logo = 'yes'"
            >
              Use Default School logo
            </el-button>
          </th>
        </tr>
        <tr>
          <th />
          <th><el-button
            type="primary"
            @click="updateResultSettings()"
          >
            Update Settings
          </el-button></th>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {
  },
  props: {
    resultSetting: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      resultSettingForm: {
        use_school_logo: 'no',
      },
      load: false,
      logoToBeUploaded: '',
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.resultSettingForm = this.resultSetting
    this.resultSettingForm.use_school_logo = 'no'
  },
  methods: {
    onImageChange(e) {
      const app = this
      // console.log(e)
      // eslint-disable-next-line prefer-destructuring
      app.logoToBeUploaded = e.target.files[0]
    },
    setExamLimit() {
      const app = this
      const noOfCA = app.resultSettingForm.no_of_ca
      let totalCA = 0

      // eslint-disable-next-line no-plusplus
      for (let index = 1; index <= noOfCA; index++) {
        const ca = `ca${index}`
        totalCA += app.resultSettingForm[ca]
      }
      if (app.resultSettingForm.add_midterm_score_to_full_result) {
        totalCA += app.resultSettingForm.midterm_score_limit
      }
      if (app.resultSettingForm.add_attendance_to_ca) {
        totalCA += app.resultSettingForm.attendance_score_limit
      }

      app.resultSettingForm.exam = 100 - totalCA
      if (app.resultSettingForm.display_exam_score_only_for_full_term === 'yes' || app.resultSettingForm.display_exam_score_only_for_full_term === '1') {
        app.resultSettingForm.exam = 100
      }
    },
    updateResultSettings() {
      const app = this
      const fetchSettings = new Resource('result/update-result-display-settings')
      const param = app.resultSettingForm
      let formData = app.resultSettingForm

      if (app.logoToBeUploaded !== '') {
        formData = new FormData()
        formData.append('id', param.id)
        formData.append('result_logo', app.logoToBeUploaded)
        formData.append('no_of_ca', param.no_of_ca)
        formData.append('ca1', param.ca1)
        formData.append('ca2', param.ca2)
        formData.append('ca3', param.ca3)
        formData.append('ca4', param.ca4)
        formData.append('ca5', param.ca5)
        formData.append('exam', param.exam)
        formData.append('no_of_ca_for_midterm', param.no_of_ca_for_midterm)
        formData.append('add_midterm_score_to_full_result', param.add_midterm_score_to_full_result)
        formData.append('midterm_score_limit', param.midterm_score_limit)
        formData.append('add_attendance_to_ca', param.add_attendance_to_ca)
        formData.append('attendance_score_limit', param.attendance_score_limit)
        formData.append('display_exam_score_only_for_full_term', param.display_exam_score_only_for_full_term)
        formData.append('display_student_position', param.display_student_position)
        formData.append('display_student_subject_position', param.display_student_subject_position)
        formData.append('display_highest_score', param.display_highest_score)
        formData.append('display_lowest_score', param.display_lowest_score)
        formData.append('display_class_average_score', param.display_class_average_score)
        formData.append('display_student_subject_average', param.display_student_subject_average)
        formData.append('display_student_class_average', param.display_student_class_average)
        formData.append('display_grade', param.display_grade)
        formData.append('display_student_behovior_and_skill_rating', param.display_student_behovior_and_skill_rating)
        formData.append('display_logo_for_result_background', param.display_logo_for_result_background)
        formData.append('display_school_name_on_result', param.display_school_name_on_result)
        formData.append('display_school_address_on_result', param.display_school_address_on_result)
        formData.append('use_school_logo', param.use_school_logo)
      }
      app.load = true
      fetchSettings.store(formData)
        .then(response => {
          app.resultSettingForm = response.result_setting
          app.load = false
          app.$message('Update Successful')
        })
        .catch(error => {
          app.load = false
          console.log(error)
        })
    },
  },
}
</script>
<style scoped>
.table th, [dir] .table td {
    padding: 0.5rem 0.5rem !important;
}
</style>
