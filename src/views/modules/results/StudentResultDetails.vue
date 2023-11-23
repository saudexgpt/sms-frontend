<template>
  <div
    v-loading="load"
  >
    <div v-if="show_result">
      <el-card>
        <div
          class="no-print"
        >
          <el-button
            type="danger"
            icon="el-icon-printer"
            @click="print()"
          >
            Print
          </el-button>
        </div>
        <table class="table table-bordered">
          <thead>
            <tr>
              <td
                colspan="10"
                align="center"
              >
                <img
                  :src="baseServerUrl +'storage/'+fetched_data.school.logo"
                  alt="School LOGO"
                  class="img-polaroid"
                  width="200"
                >
                <!--<img
                  v-if="fetched_data.result_settings.logo !== null"
                  :src="baseServerUrl +'storage/'+fetched_data.result_settings.logo"
                  alt="School LOGO"
                  class="img-polaroid"
                  width="200"
                >
                <img
                  v-else
                  :src="baseServerUrl +'storage/'+fetched_data.school.logo"
                  alt="School LOGO"
                  class="img-polaroid"
                  width="200"
                >-->
                <br>
                <strong v-if="fetched_data.result_settings.display_school_name_on_result === 'yes'">{{ fetched_data.school.name.toUpperCase() }}</strong><br>
                <small v-if="fetched_data.result_settings.display_school_address_on_result === 'yes'">{{ fetched_data.school.address }}</small>
                <div
                  align="center"
                  class="report"
                >
                  <h3>{{ ucWords(fetched_data.term_spec) }} Term Report Sheet</h3>
                </div>
              </td>

            </tr>
            <!-- <tr>
              <td colspan="10">
                <div
                  align="center"
                  class="report"
                >
                  <h3>{{ ucWords(fetched_data.term_spec) }} Term Report Sheet</h3>
                </div>
              </td>

            </tr> -->
            <tr>
              <td
                rowspan="3"
                align="center"
              >
                <img
                  :src="baseServerUrl+'storage/'+fetched_data.student_in_class.student.user.photo"
                  alt="Student Photo"
                  class="img-polaroid"
                  width="80"
                  onerror="this.src='/images/profile-image.png'"
                >
              </td>
              <td colspan="3">
                <strong>NAME: </strong> {{ fetched_data.student_in_class.student.user.last_name +', '+fetched_data.student_in_class.student.user.first_name }}
              </td>
              <td colspan="3">
                <strong>ID: </strong>{{ fetched_data.student_in_class.student.registration_no }}
              </td>
              <td colspan="3">
                <strong>GENDER: </strong>{{ fetched_data.student_in_class.student.user.gender.toUpperCase() }}
              </td>
            </tr>
            <tr>
              <td>
                <strong>CLASS: </strong> {{ fetched_data.student_in_class.class_teacher.c_class.name }}
              </td>
              <td colspan="2">
                <strong>NO. IN CLASS: </strong>{{ fetched_data.no_in_class }}
              </td>
              <td colspan="3">
                <strong>SESSION: </strong>{{ fetched_data.this_session.name }}
              </td>
              <td colspan="3">
                <strong>TERM: </strong>{{ fetched_data.this_term.name }} Term
              </td>
            </tr>
            <tr v-if="publishedResults.length > 0">

              <td :colspan="checkColSpan(fetched_data.result_settings)">
                <strong>CLASS TEACHER: </strong> {{ fetched_data.student_in_class.class_teacher.staff.user.last_name+', '+fetched_data.student_in_class.class_teacher.staff.user.first_name }}
              </td>

              <td
                v-if="fetched_data.result_settings.display_class_average_score === 'yes'"
                colspan="3"
              >
                <strong>CLASS AVERAGE: </strong>{{ fetched_data.class_average }}
              </td>
              <td
                v-if="fetched_data.result_settings.display_student_class_average === 'yes'"
                :colspan="(fetched_data.result_settings.display_student_position === 'yes') ? 2 : 4"
              >
                <strong>STUDENT AVERAGE: </strong>{{ fetched_data.student_average }}
              </td>

              <td
                v-if="fetched_data.result_settings.display_student_position === 'yes'"
                colspan="2"
              >
                <strong>POSITION: </strong>{{ fetched_data.position }}
              </td>
            </tr>

          </thead>

        </table>
        <!--result table-->
        <half-term
          v-if="fetched_data.term_spec==='half'"
          :published-results="publishedResults"
          :fetch-data="fetched_data"
        />
        <full-term
          v-if="fetched_data.term_spec==='full'"
          :published-results="publishedResults"
          :fetch-data="fetched_data"
        />
      </el-card>
    </div>

  </div>
</template>
<script>

import Resource from '@/api/resource'
import FullTerm from './partials/FullTerm.vue'
import HalfTerm from './partials/HalfTerm.vue'
// import html2canvas from 'html2canvas'

// import Helper from '@/api/helper'

const getResultStudentResult = new Resource('result/get-student-result-details')
// const loadHelper = new Helper()

export default {
  components: {
    FullTerm,
    HalfTerm,
  },
  props: {
    isSubPage: {
      type: Boolean,
      default: false,
    },
    param: {
      type: Object,
      default: () => ({}),
    },
    studentId: {
      type: Number,
      default: () => (null),
    },
  },
  data() {
    return {
      fetched_data: {
        student_results: [],
      },
      show_result: false,
      load: false,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    publishedResults() {
      // return this.fetched_data.student_results
      if (this.fetched_data.term_spec === 'half') {
        return this.fetched_data.student_results.filter(i => (i.midterm_status === 'published' && i.subject_teacher !== null))
      }
      return this.fetched_data.student_results.filter(i => (i.fullterm_status === 'published' && i.subject_teacher !== null))
    },

  },
  mounted() {
    const app = this
    app.fetchResultStudentResultDetails(app.isSubPage)
  },

  methods: {
    checkColSpan(resultSettings) {
      let colspan = 7
      if (resultSettings.display_class_average_score === 'yes' && resultSettings.display_student_class_average === 'yes') {
        colspan = 3
      } else if (resultSettings.display_class_average_score === 'no' && resultSettings.display_student_class_average === 'yes') {
        colspan = 7
      } else if (resultSettings.display_class_average_score === 'yes' && resultSettings.display_student_class_average === 'no' && resultSettings.display_student_position === 'yes') {
        colspan = 5
      } else if (resultSettings.display_class_average_score === 'no' && resultSettings.display_student_class_average === 'no' && resultSettings.display_student_position === 'yes') {
        colspan = 8
      }
      return colspan
    },
    ucWords(str) {
      const lower = str.toLowerCase()
      return str.charAt(0).toUpperCase() + lower.slice(1)
    },
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
    fetchResultStudentResultDetails(isSubPage) {
      const app = this
      let params = app.param
      params.student_id = app.studentId
      if (isSubPage === false) {
        params = {
          student_id: app.$route.params.student_id,
          sess_id: app.$route.params.sess_id,
          term_id: app.$route.params.term_id,
          sub_term: app.$route.params.sub_term,
          class_teacher_id: app.$route.params.class_teacher_id,
        }
      }
      app.load = true
      getResultStudentResult.list(params)
        .then(response => {
          app.fetched_data = response
          app.show_result = true
          app.load = false
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.load = false
        })
    },
    print() {
      window.print()
    },

  },

}
</script>
<style scoped>
.table th, [dir] .table td {
  padding: 0.75rem 0.75rem;
  color: #000;
}
.report h1 {
    font-weight: bold;
    font-family: 'cooper std', sans-serif;
    background: transparent !important;
}
.report h3 {
  font-weight: bold;
  text-decoration: underline;
  font-family: 'lucida calligraphy', sans-serif;
  background: transparent !important;
  }
.report{
  padding: 5pt;
}
.col-xs-9, .col-xs-3, .col-xs-8, .col-xs-4 {
  padding-right: 0px;
  padding-left: 0px;
}
@media print {
  table{
    font-size: 10px;
  }
  .el-col-lg-5 {
    width: 20.83333% !important;
  }
  .el-col-lg-19 {
    width: 79.16667% !important;
  }
}
</style>
