<template>
  <div class="demo-wrap">
    <!-- <div
      v-if="fetchData.result_settings.display_logo_for_result_background==='yes'"
    >

      <img
        v-if="fetchData.result_settings.logo !== null"
        align="center"
        class="demo-bg"
        :src="baseServerUrl +'storage/'+fetchData.result_settings.logo"
        alt=""
      >
      <img
        v-else
        align="center"
        class="demo-bg"
        :src="baseServerUrl +'storage/'+school.logo"
        alt=""
      >
    </div> -->
    <div class="demo-content table-responsive">
      <table
        class="resultTable table-bordered"
      >
        <thead>

          <tr>
            <th>
              SUBJECTS
            </th>
            <th>
              Score
            </th>
            <th v-if="fetchData.result_settings.display_grade === 'yes'">
              <span>GRADE</span>
            </th>
            <th v-if="fetchData.result_settings.display_highest_score === 'yes'">
              <span>HIGHEST</span>
            </th>
            <th v-if="fetchData.result_settings.display_lowest_score === 'yes'">
              <span>LOWEST</span>
            </th>
            <th v-if="fetchData.result_settings.display_student_subject_average === 'yes'">
              <span>AVERAGE</span>
            </th>
            <th v-if="fetchData.result_settings.display_student_subject_position === 'yes'">
              <span>POSITION</span>
            </th>
            <th>
              <div>
                REMARKS
              </div>
            </th>
          </tr>
        </thead>
        <tbody
          v-if="publishedResults.length > 0"
        >
          <tr
            v-for="(student_result, index) in publishedResults"
            :key="index"
          >
            <template v-if="student_result.total">
              <td>{{ student_result.subject_teacher.subject.name }}</td>
              <td>{{ student_result.total }}</td>
              <td
                v-if="fetchData.result_settings.display_grade === 'yes'"
                :style="'background:'+student_result.color+'; color: #000;'"
              >
                {{ student_result.result_grade }}
              </td>
              <td v-if="fetchData.result_settings.display_highest_score === 'yes'">
                {{ (student_result.total) ? student_result.subject_highest_score : '' }}
              </td>
              <td v-if="fetchData.result_settings.display_lowest_score === 'yes'">
                {{ (student_result.total) ? student_result.subject_lowest_score : '' }}
              </td>
              <td v-if="fetchData.result_settings.display_student_subject_average === 'yes'">
                {{ (student_result.total) ? student_result.subject_class_average : '' }}
              </td>
              <td v-if="fetchData.result_settings.display_student_subject_position === 'yes'">
                {{ (student_result.total) ? student_result.position : '' }}
              </td>
              <td>{{ (student_result.remark != 'Undefined') ? student_result.remark : '' }}</td>
              <!--<td>{{student_result.comments}}</td>-->
            </template>
          </tr>
          <tr>
            <th>Class Teacher's Remark:</th>
            <th colspan="9">
              <div v-if="fetchData.student_remark">
                {{ fetchData.student_remark.class_teacher_remark }}
              </div>
            </th>
          </tr>
          <tr>
            <th>Principal's Comment:</th>
            <th colspan="9">
              <div v-if="fetchData.student_remark">
                {{ fetchData.student_remark.head_teacher_remark }}
              </div>
            </th>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="9">
              <b-alert
                variant="danger"
                show
              >
                <div class="alert-body">
                  RESULT HAS NOT BEEN PUBLISHED
                </div>
              </b-alert>
            </td>
          </tr>
        </tbody>
      </table>
      <el-row :gutter="10">

        <el-col
          v-if="fetchData.result_settings.display_grade === 'yes'"
          :md="12"
          :sm="12"
          :xs="12"
        >
          <div class="">
            <table
              class="table-bordered keyTable"
              border="1"
              cell-padding="2"
            >
              <thead>
                <tr>
                  <td colspan="4">
                    Grade Key
                  </td>
                </tr>
                <tr>
                  <td>Grade</td>
                  <td>Description</td>
                  <td>Range(%)</td>
                  <td>Point</td>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(grade, index) in fetchData.grades"
                  :key="index"
                >
                  <td>{{ grade.grade }}</td>
                  <td>{{ grade.interpretation }}</td>
                  <td>{{ grade.lower_limit + '-' + grade.upper_limit }}</td>
                  <td>{{ grade.grade_point }}</td>
                </tr>

              </tbody>
            </table>
          </div>
        </el-col>

      <!-- <el-col
        :md="12"
        :sm="12"
        :xs="12"
      >
        <div class="table-responsive">
          <table class="table table-bordered keyTable">
            <thead>
              <tr role="row">
                <th>
                  SKILLS
                </th>

                <th colspan="5">
                  RATINGS
                </th>

              </tr>
              <tr>
                <th />
                <th
                  v-for="(rating, index) in fetchData.ratings"
                  :key="index"
                >
                  {{ index }}
                </th>

              </tr>
            </thead>
            <tbody>

              <tr>
                <td>Leadership</td>

                <td
                  v-for="(rating, index) in fetchData.ratings"
                  :key="index"
                >
                  <span v-if="fetchData.skill && fetchData.skill.leadership == index">
                    <feather-icon icon="CheckIcon" />
                  </span>
                  <span v-else />
                </td>

              </tr>
              <tr>
                <td>Initiative</td>
                <td
                  v-for="(rating, index) in fetchData.ratings"
                  :key="index"
                >
                  <span v-if="fetchData.skill && fetchData.skill.initiative == index">
                    <feather-icon icon="CheckIcon" />
                  </span>
                  <span v-else />
                </td>

              </tr>
              <tr>
                <td>Art Works</td>
                <td
                  v-for="(rating, index) in fetchData.ratings"
                  :key="index"
                >
                  <span v-if="fetchData.skill && fetchData.skill.art_works == index">
                    <feather-icon icon="CheckIcon" />
                  </span>
                  <span v-else />
                </td>

              </tr>
              <tr>
                <td>Spoken English</td>
                <td
                  v-for="(rating, index) in fetchData.ratings"
                  :key="index"
                >
                  <span v-if="fetchData.skill && fetchData.skill.spoken_english == index">
                    <feather-icon icon="CheckIcon" />
                  </span>
                  <span v-else />
                </td>

              </tr>
              <tr>
                <td>Sports</td>
                <td
                  v-for="(rating, index) in fetchData.ratings"
                  :key="index"
                >
                  <span v-if="fetchData.skill && fetchData.skill.sports == index">
                    <feather-icon icon="CheckIcon" />
                  </span>
                  <span v-else />
                </td>

              </tr>
              <tr>
                <td>Handling of Tools</td>
                <td
                  v-for="(rating, index) in fetchData.ratings"
                  :key="index"
                >
                  <span v-if="fetchData.skill && fetchData.skill.tools_handling == index">
                    <feather-icon icon="CheckIcon" />
                  </span>
                  <span v-else />
                </td>

              </tr>

            </tbody>
          </table>
        </div>
      </el-col> -->
      </el-row>
    </div>
  </div>
</template>
<script>
import { BAlert } from 'bootstrap-vue'

export default {
  components: {
    BAlert,
  },
  props: {
    publishedResults: {
      type: Array,
      default: () => ([]),
    },
    fetchData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {}
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    school() {
      return this.$store.getters.userData.school
    },
  },
}
</script>
<style scoped>
.table th, [dir] .table td {
    padding: 0.75rem 0.75rem !important;
    color: #000;
}

</style>
