<template>
  <div class="table-responsive">
    <table class="table table-bordered">
      <thead>

        <tr>
          <th>
            <div>
              SUBJECTS
            </div>
          </th>
          <th>
            <div>
              Score
            </div>
          </th>
          <th>
            <span>GRADE</span>
          </th>
          <th>
            <span>HIGHEST</span>
          </th>
          <th>
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
        :md="12"
        :sm="12"
        :xs="12"
      >
        <div class="table-responsive">
          <table class="table table-bordered">
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
          <table class="table table-bordered">
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
}
</script>
