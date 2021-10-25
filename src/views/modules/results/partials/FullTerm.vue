/* eslint-disable space-before-blocks */
<template>
  <div class="table-responsive">
    <table class="table table-bordered">
      <thead>

        <tr>
          <th>
            <div style="margin-top: 50px!important;">
              SUBJECTS
            </div>
          </th>
          <th>
            <div>
              CA1
            </div>
          </th>
          <th>
            <div>
              CA2
            </div>
          </th>
          <th>
            <div>
              CA3
            </div>
          </th>
          <th>
            <div>
              CA4
            </div>
          </th>
          <th>
            <div>
              Exam
            </div>
          </th>
          <th class="verticalHeader solid-border">
            <div>
              Total
            </div>
          </th>
          <th class="verticalHeader solid-border">
            <span>GRADE</span>
          </th>
          <th class="verticalHeader solid-border">
            <span>HIGHEST</span>
          </th>
          <th class="verticalHeader solid-border">
            <span>AVERAGE</span>
          </th>
          <th>
            <div>
              REMARKS
            </div>
          </th>
        </tr>
      </thead>
      <tbody v-if="publishedResults.length > 0">
        <tr
          v-for="(student_result, index) in publishedResults"
          :key="index"
        >
          <td>{{ student_result.subject_teacher.subject.name }}</td>
          <td>{{ student_result.mid_term / 10 }}</td>
          <td>{{ student_result.ca1 }}</td>
          <td>{{ student_result.ca2 }}</td>
          <td>{{ student_result.ca3 }}</td>
          <td>{{ student_result.exam }}</td>
          <td>{{ student_result.total }}</td>
          <td :style="'background:'+student_result.color+'; color: #000;'">
            {{ student_result.result_grade }}
          </td>
          <td>{{ student_result.subject_highest_score }}</td>
          <td>{{ student_result.subject_class_average }}</td>
          <!-- <td>{{ student_result.position }}</td> -->
          <td>{{ student_result.remark }}</td>
          <!--<td>{{student_result.comments}}</td>-->
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
          <td colspan="11">
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
        :md="12"
        :sm="12"
        :xs="12"
      >
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr role="row">
                <th>
                  BEHAVIOURS
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
                <td>Attentiveness</td>

                <td
                  v-for="(rating, index) in fetchData.ratings"
                  :key="index"
                >
                  <span v-if="fetchData.behavior && fetchData.behavior.attentiveness == index">
                    <feather-icon icon="CheckIcon" />
                  </span>
                  <span v-else />
                </td>

              </tr>
              <tr>
                <td>Calmness</td>
                <td
                  v-for="(rating, index) in fetchData.ratings"
                  :key="index"
                >
                  <span v-if="fetchData.behavior && fetchData.behavior.calmness == index">
                    <feather-icon icon="CheckIcon" />
                  </span>
                  <span v-else />
                </td>

              </tr>
              <tr>
                <td>Honesty</td>
                <td
                  v-for="(rating, index) in fetchData.ratings"
                  :key="index"
                >
                  <span v-if="fetchData.behavior && fetchData.behavior.honesty == index">
                    <feather-icon icon="CheckIcon" />
                  </span>
                  <span v-else />
                </td>

              </tr>
              <tr>
                <td>Neatness</td>
                <td
                  v-for="(rating, index) in fetchData.ratings"
                  :key="index"
                >
                  <span v-if="fetchData.behavior && fetchData.behavior.neatness == index">
                    <feather-icon icon="CheckIcon" />
                  </span>
                  <span v-else />
                </td>

              </tr>
              <tr>
                <td>Punctuality</td>
                <td
                  v-for="(rating, index) in fetchData.ratings"
                  :key="index"
                >
                  <span v-if="fetchData.behavior && fetchData.behavior.punctuality == index">
                    <feather-icon icon="CheckIcon" />
                  </span>
                  <span v-else />
                </td>

              </tr>
              <tr>
                <td>Perseverance</td>
                <td
                  v-for="(rating, index) in fetchData.ratings"
                  :key="index"
                >
                  <span v-if="fetchData.behavior && fetchData.behavior.perseverance == index">
                    <feather-icon icon="CheckIcon" />
                  </span>
                  <span v-else />
                </td>

              </tr>

            </tbody>
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
      </el-col>

      <el-col
        :md="12"
        :sm="12"
        :xs="12"
      >
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr role="row">
                <th colspan="4">
                  Grade Key
                </th>
              </tr>
              <tr>
                <th>Grade</th>
                <th>Description</th>
                <th>Range(%)</th>
                <th>Point</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(grade, index) in fetchData.grades"
                :key="index"
              >
                <td :style="'background:'+grade.color_code+'; color: #000;'">
                  {{ grade.grade }}
                </td>
                <td>{{ grade.interpretation }}</td>
                <td>{{ grade.lower_limit + '-' + grade.upper_limit }}</td>
                <td>{{ grade.grade_point }}</td>
              </tr>

            </tbody>
          </table>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th
                  colspan="2"
                  align="center"
                >
                  BEHAVIOURS & SKILLS
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(rating, index) in sortedRatings"
                :key="index"
              >
                <td>{{ rating[0] }}</td>
                <td>{{ rating[1] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-col>
    </el-row>
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
    sortedRatings() {
      const list = this.fetchData.ratings
      return Object.entries(list).sort((a, b) => a - b)
    },
  },
}
</script>
<style scoped>
.table thead th, .table tfoot th {
    vertical-align: bottom;
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.5px;
}
.verticalHeader {
  font-size: 0.7rem;
}
.table th, [dir] .table td {
  padding: 0.75rem 0.75rem;
}
.sticky-header {
    position: sticky;
}
</style>
