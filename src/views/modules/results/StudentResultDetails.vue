<template>
  <div>
    <!--<button @click="download" class="btn btn-success">Download PDF</button>-->
    <div v-if="show_result">
      <div
        ref="content"
        class="col-xs-12"
      >
        <table class="table table-bordered">
          <thead>
            <tr>
              <td
                colspan="9"
                align="center"
              >
                <img
                  :src="baseServerUrl +'storage/'+fetched_data.school.logo"
                  alt="School LOGO"
                  class="img-polaroid"
                  width="100"
                ><br>
                <strong>{{ fetched_data.school.name.toUpperCase() }}</strong><br>
                <small>{{ fetched_data.school.address }}</small>
              </td>
              <!-- <td
                colspan="8"
                align="center"
              >

                <img
                  src="images/coat_of_arms.png"
                  alt=""
                  width="100"
                >
                <div>

                  <strong>GOVERNMENT OF {{ fetched_data.school.lga.state.name.toUpperCase() }} STATE OF NIGERIA</strong>
                  <br>
                  STATE SECONDARY EDUCATION BOARD, {{ fetched_data.school.lga.name.toUpperCase() }}<br>

                  <strong>TERMINAL REPORT</strong>
                </div>

              </td> -->
              <td align="center">
                <img
                  :src="baseServerUrl+'storage/'+fetched_data.student_in_class.student.user.photo"
                  alt="Student Photo"
                  class="img-polaroid"
                  width="100"
                >

              </td>

            </tr>

            <tr>
              <td><strong>NAME: </strong> {{ fetched_data.student_in_class.student.user.last_name +', '+fetched_data.student_in_class.student.user.first_name }} </td>
              <td colspan="4">
                <strong>ID: </strong>{{ fetched_data.student_in_class.student.registration_no }}
              </td>
              <td colspan="3">
                <strong>GENDER: </strong>{{ fetched_data.student_in_class.student.user.gender.toUpperCase() }}
              </td>
              <td colspan="2">
                <strong>CLASS: </strong> {{ fetched_data.student_in_class.class_teacher.c_class.name }}
              </td>
            </tr>
            <tr>

              <td><strong>NO. IN CLASS: </strong>{{ fetched_data.no_in_class }}</td>
              <td colspan="4">
                <strong>SESSION: </strong>{{ fetched_data.this_session.name }}
              </td>
              <td colspan="3">
                <strong>TERM: </strong>{{ fetched_data.this_term.name }} Term
              </td>
              <td colspan="2">
                <strong>POSITION: </strong>{{ fetched_data.position }}
              </td>
            </tr>
            <tr>

              <td colspan="3">
                <strong>CLASS TEACHER: </strong> {{ fetched_data.student_in_class.class_teacher.staff.user.last_name+', '+fetched_data.student_in_class.class_teacher.staff.user.first_name }}
              </td>
              <td colspan="4">
                <strong>STUDENT AVERAGE: </strong>{{ fetched_data.student_average }}
              </td>

              <td colspan="3">
                <strong>CLASS AVERAGE: </strong>{{ fetched_data.class_average }}
              </td>
            </tr>

          </thead>

        </table>
        <div class="col-xs-8">
          <!--result table-->
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>

                <tr>
                  <th rowspan="2">
                    <div style="margin-top: 100px!important;">
                      SUBJECTS
                    </div>
                  </th>
                  <th class="verticalHeader">
                    <span>CLASS-WORK</span>
                  </th>
                  <th class="verticalHeader">
                    <span>TERM-EXAM</span>
                  </th>
                  <th class="verticalHeader">
                    <span>TOTAL</span>
                  </th>
                  <th
                    class="verticalHeader"
                    rowspan="2"
                  >
                    <span>HIGHEST</span>
                  </th>
                  <th
                    class="verticalHeader"
                    rowspan="2"
                  >
                    <span>LOWEST</span>
                  </th>
                  <th
                    class="verticalHeader"
                    rowspan="2"
                  >
                    <span>AVERAGE</span>
                  </th>
                  <th
                    class="verticalHeader"
                    rowspan="2"
                  >
                    <span>GRADE</span>
                  </th>
                  <th
                    class="verticalHeader"
                    rowspan="2"
                  >
                    <span>POSITION</span>
                  </th>
                  <th rowspan="2">
                    <div style="margin-top: 100px!important;">
                      REMARKS
                    </div>
                  </th>
                </tr>
                <tr>
                  <th><span>40%</span></th>
                  <th><span>60%</span></th>
                  <th><span style="margin-top: 10px!important;">100%</span></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(student_result, index) in fetched_data.student_results"
                  :key="index"
                >
                  <td>{{ student_result.subject_teacher.subject.code }}</td>
                  <td>{{ student_result.test }}</td>
                  <td>{{ student_result.exam }}</td>
                  <td :style="'background:'+student_result.color+'; color: #000;'">
                    {{ student_result.total }}
                  </td>
                  <td>{{ student_result.subject_highest_score }}</td>
                  <td>{{ student_result.subject_lowest_score }}</td>
                  <td>{{ student_result.subject_class_average }}</td>
                  <td :style="'background:'+student_result.color+'; color: #000;'">
                    {{ student_result.result_grade }}
                  </td>
                  <td>{{ student_result.position }}</td>
                  <td>{{ student_result.remark }}</td>
                  <!--<td>{{student_result.comments}}</td>-->
                </tr>
                <tr>
                  <th>Class Teacher's Remark:</th>
                  <th colspan="9">
                    <div v-if="fetched_data.student_remark">
                      {{ fetched_data.student_remark.class_teacher_remark }}
                    </div>
                  </th>
                </tr>
                <tr>
                  <th>Principal's Comment:</th>
                  <th colspan="9">
                    <div v-if="fetched_data.student_remark">
                      {{ fetched_data.student_remark.head_teacher_remark }}
                    </div>
                  </th>
                </tr>
              </tbody>

            </table>
          </div>
        </div>
        <div class="col-xs-4">
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr role="row">
                  <th rowspan="2">
                    BEHAVIOURS
                  </th>

                  <th colspan="5">
                    RATINGS
                  </th>

                </tr>
                <tr>
                  <th
                    v-for="(rating, index) in fetched_data.ratings"
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
                    v-for="(rating, index) in fetched_data.ratings"
                    :key="index"
                  >
                    <span v-if="fetched_data.behavior && fetched_data.behavior.attentiveness == index">
                      <i class="fa fa-check green-ic" />
                    </span>
                    <span v-else />
                  </td>

                </tr>
                <tr>
                  <td>Calmness</td>
                  <td
                    v-for="(rating, index) in fetched_data.ratings"
                    :key="index"
                  >
                    <span v-if="fetched_data.behavior && fetched_data.behavior.calmness == index">
                      <i class="fa fa-check green-ic" />
                    </span>
                    <span v-else />
                  </td>

                </tr>
                <tr>
                  <td>Honesty</td>
                  <td
                    v-for="(rating, index) in fetched_data.ratings"
                    :key="index"
                  >
                    <span v-if="fetched_data.behavior && fetched_data.behavior.honesty == index">
                      <i class="fa fa-check green-ic" />
                    </span>
                    <span v-else />
                  </td>

                </tr>
                <tr>
                  <td>Neatness</td>
                  <td
                    v-for="(rating, index) in fetched_data.ratings"
                    :key="index"
                  >
                    <span v-if="fetched_data.behavior && fetched_data.behavior.neatness == index">
                      <i class="fa fa-check green-ic" />
                    </span>
                    <span v-else />
                  </td>

                </tr>
                <tr>
                  <td>Punctuality</td>
                  <td
                    v-for="(rating, index) in fetched_data.ratings"
                    :key="index"
                  >
                    <span v-if="fetched_data.behavior && fetched_data.behavior.punctuality == index">
                      <i class="fa fa-check green-ic" />
                    </span>
                    <span v-else />
                  </td>

                </tr>
                <tr>
                  <td>Perseverance</td>
                  <td
                    v-for="(rating, index) in fetched_data.ratings"
                    :key="index"
                  >
                    <span v-if="fetched_data.behavior && fetched_data.behavior.perseverance == index">
                      <i class="fa fa-check green-ic" />
                    </span>
                    <span v-else />
                  </td>

                </tr>

              </tbody>

              <thead>
                <tr role="row">
                  <th rowspan="2">
                    SKILLS
                  </th>

                  <th colspan="5">
                    RATINGS
                  </th>

                </tr>
                <tr>
                  <th
                    v-for="(rating, index) in fetched_data.ratings"
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
                    v-for="(rating, index) in fetched_data.ratings"
                    :key="index"
                  >
                    <span v-if="fetched_data.skill && fetched_data.skill.leadership == index">
                      <i class="fa fa-check green-ic" />
                    </span>
                    <span v-else />
                  </td>

                </tr>
                <tr>
                  <td>Initiative</td>
                  <td
                    v-for="(rating, index) in fetched_data.ratings"
                    :key="index"
                  >
                    <span v-if="fetched_data.skill && fetched_data.skill.initiative == index">
                      <i class="fa fa-check green-ic" />
                    </span>
                    <span v-else />
                  </td>

                </tr>
                <tr>
                  <td>Art Works</td>
                  <td
                    v-for="(rating, index) in fetched_data.ratings"
                    :key="index"
                  >
                    <span v-if="fetched_data.skill && fetched_data.skill.art_works == index">
                      <i class="fa fa-check green-ic" />
                    </span>
                    <span v-else />
                  </td>

                </tr>
                <tr>
                  <td>Spoken English</td>
                  <td
                    v-for="(rating, index) in fetched_data.ratings"
                    :key="index"
                  >
                    <span v-if="fetched_data.skill && fetched_data.skill.spoken_english == index">
                      <i class="fa fa-check green-ic" />
                    </span>
                    <span v-else />
                  </td>

                </tr>
                <tr>
                  <td>Sports</td>
                  <td
                    v-for="(rating, index) in fetched_data.ratings"
                    :key="index"
                  >
                    <span v-if="fetched_data.skill && fetched_data.skill.sports == index">
                      <i class="fa fa-check green-ic" />
                    </span>
                    <span v-else />
                  </td>

                </tr>
                <tr>
                  <td>Handling of Tools</td>
                  <td
                    v-for="(rating, index) in fetched_data.ratings"
                    :key="index"
                  >
                    <span v-if="fetched_data.skill && fetched_data.skill.tools_handling == index">
                      <i class="fa fa-check green-ic" />
                    </span>
                    <span v-else />
                  </td>

                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
// import jsPDF from 'jspdf'
// import html2canvas from 'html2canvas'
import Resource from '@/api/resource'

// import Helper from '@/api/helper'

const getResultStudentResult = new Resource('result/get-student-result-details')
// const loadHelper = new Helper()
export default {

  data() {
    return {
      fetched_data: {},
      show_result: false,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  mounted() {
    const app = this
    app.fetchResultStudentResultDetails()
  },

  methods: {
    download() {
      /* const doc = new jsPDF();
      const contentHtml = this.$refs.content.innerHTML;
      doc.fromHTML(contentHtml, 15, 15, {
        width: 170
      });
      doc.save("sample.pdf"); */

      // const doc = new jsPDF()
      /** WITH CSS */
      // const canvasElement = document.createElement('canvas')
      // html2canvas(this.$refs.content, { canvas: canvasElement }).then(canvas => {
      //   const img = canvas.toDataURL('image/jpeg', 0.8)
      //   doc.addImage(img, 'JPEG', 10, 10)
      //   doc.output('sample.pdf')
      // })
    },
    fetchResultStudentResultDetails() {
      const app = this

      const param = {
        student_id: app.$route.params.student_id,
        sess_id: app.$route.params.sess_id,
        term_id: app.$route.params.term_id,
        sub_term: app.$route.params.sub_term,
        class_teacher_id: app.$route.params.class_teacher_id,
      }

      getResultStudentResult.list(param)
        .then(response => {
          app.fetched_data = response
          app.show_result = true
        })
        .catch(() => {
          // app.$router.replace('/404')
        })
    },

  },

}
</script>
<style scoped>
.col-xs-9, .col-xs-3, .col-xs-8, .col-xs-4 {
  padding-right: 0px;
  padding-left: 0px;
}
@media print {
table{
    font-size: 10px;
  }
}
</style>
<style scoped>
.table thead th, .table tfoot th {
    vertical-align: bottom;
    text-transform: uppercase;
    font-size: 0.857rem;
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
