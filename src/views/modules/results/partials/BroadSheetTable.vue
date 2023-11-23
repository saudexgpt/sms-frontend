<template>
  <div
    class=""
  >
    <div
      v-if="broadSheetData !== null"
      class="box"
    >
      <div class="box-header">
        <h4 class="box-title">
          Result BroadSheet for {{ broadSheetData.class_name }} ({{ (broadSheetData) ? broadSheetData.sub_term.toUpperCase() : '-' }} Term)
        </h4>

      </div>
      <div class="box-body">
        <div class="table-responsive">
          <div class="custom-search d-flex">
            <b-form-group>
              <div class="d-flex align-items-center">
                <b-form-input
                  placeholder="Search Student"
                  type="text"
                  class="d-inline-block"
                  @input="searchStudent($event)"
                />
              </div>
            </b-form-group>
          </div>
          <table
            id="myTable"
            class="resultTable table-striped table-bordered"
          >
            <thead>
              <tr>
                <th
                  class="sorting_asc padded"
                  tabindex="0"
                  aria-controls="table_marksheet"
                  style="width: 41px;"
                  @click="sortTable(3 + broadSheetData.result_subjects.length)"
                >
                  <div>
                    S/N
                  </div>
                </th>
                <th
                  class="solid-border clickable padded"
                  @click="sortTable(1)"
                >
                  <div>
                    Student Name
                  </div>
                </th>
                <th
                  class="solid-border clickable padded"
                  @click="sortTable(2)"
                >
                  <div>
                    Student ID
                  </div>
                </th>

                <th
                  v-for="(subject_name,index) in broadSheetData.result_subjects"
                  :key="index"
                  class="verticalHeader solid-border clickable"
                  @click="sortTable(3 + index)"
                >
                  <div><span>{{ subject_name }}</span></div>
                </th>

                <th
                  class="verticalHeader solid-border"
                  @click="sortTable(3 + broadSheetData.result_subjects.length)"
                >
                  <div><span>Average</span></div>

                </th>
                <th
                  class="verticalHeader clickable"
                  @click="sortTable(3 + broadSheetData.result_subjects.length)"
                >
                  <div><span>Average Grade</span></div>

                </th>
                <!--<th class="verticalHeader sorting" >
                        <span>GPA</span>
                    </th>-->
                <th
                  class="verticalHeader solid-border clickable"
                  @click="sortTable(3 + broadSheetData.result_subjects.length)"
                >
                  <div><span>Position</span></div>
                </th>
                <th class="solid-border noExport" />
              </tr>
            </thead>
            <tbody>

              <tr
                v-for="(student_in_class,index) in filtered_students_in_class"
                :key="index"
                class=""
              >
                <td>{{ Number(rankResult(student_in_class.student_result.average, broadSheetData.result_averages, 'serial_number')) }}</td>
                <td class="solid-border">
                  {{ student_in_class.student.user.first_name +' '+student_in_class.student.user.last_name }}
                </td>
                <td>
                  {{ student_in_class.student.registration_no }}
                </td>

                <td
                  v-for="(result_detail, result_index) in student_in_class.student_result.result_details_array"
                  :key="result_index"
                  :style="'background:'+result_detail['color']+'; color: #000;'"
                >
                  <span v-if="result_detail['total']">
                    {{ result_detail['total'] }}
                  </span>
                  <span v-else>-</span>

                </td>

                <td class="noExport">
                  {{ student_in_class.student_result.average }}
                </td>

                <td :style="'background:'+student_in_class.student_result.average_color+';  color: #000;'">
                  {{ student_in_class.student_result.average_grade }}
                </td>
                <!--<td style="background:{{$average_color}}   ; ">{{$grade_point}}</td>-->
                <td>{{ rankResult(student_in_class.student_result.average, broadSheetData.result_averages, 'position') }}</td>
                <td>
                  <router-link
                    :to="{
                      name: 'StudentResultDetails',
                      params: {
                        student_id: student_in_class.student_id,
                        class_teacher_id: broadSheetData.class_teacher_id,
                        sess_id: broadSheetData.sess_id,
                        term_id: broadSheetData.term_id,
                        sub_term: broadSheetData.sub_term
                      }
                    }"
                    target="_blank"
                    class="btn btn-info"
                    title="Student Result Detail"
                  ><i class="fa fa-newspaper-o" /> Details</router-link>
                </td>
              </tr>

            </tbody>
          </table>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {
  BFormGroup, BFormInput,
} from 'bootstrap-vue'
// import Resource from '@/api/resource'
import Helper from '@/api/helper'

// const getResultBroadSheet = new Resource('result/class-broadsheet')
const loadHelper = new Helper()
export default {
  components: { BFormGroup, BFormInput },
  props: {
    broadSheetData: {
      type: Object,
      default: () => (null),
    },
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // broadSheetData: {},
      filtered_students_in_class: [],
      loader: false,
      // fetched_data : {}
    }
  },

  created() {
    // this.fetchBroadSheet()
    this.filtered_students_in_class = this.broadSheetData.students_in_class
    // sort table by average (ranking)
    // this.sortTable(3 + this.broadSheetData.result_subjects.length)
  },
  /* watch: {
    fetched_data () {
      this.broadSheetData = this.fetched_data;

    }
  }, */
  methods: {
    // fetchBroadSheet() {
    //   const app = this
    //   const param = app.params
    //   app.loader = true
    //   // let param = {

    //   //   sess_id: app.$route.params.sess_id,
    //   //   term_id: app.$route.params.term_id,
    //   //   sub_term: app.$route.params.sub_term,
    //   //   class_teacher_id: app.$route.params.class_teacher_id,
    //   // };

    //   getResultBroadSheet.list(param)
    //     .then(response => {
    //       app.broadSheetData = response
    //       app.filtered_students_in_class = app.broadSheetData.students_in_class
    //       app.loader = false
    //       // setTimeout(() => { app.setDataTable() }, 0)// delay for zero seconds
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
    // },

    rankResult(scoreAverage, resultAverages, option) {
      // function called from @/api/resource.js script

      return loadHelper.rankResult(scoreAverage, resultAverages, option)
    },
    searchStudent(value) {
      const query = value.toLowerCase()
      const items = this.broadSheetData.students_in_class // this.staff
      const newFilter = []
      if (query && query.trim() !== '') {
        // we check whether somthing is typed. if it is type, filter it
        items.forEach(item => {
          if ((item.student.user.first_name.toLowerCase().indexOf(query) > -1) || (item.student.user.last_name.toLowerCase().indexOf(query) > -1) || (item.student.registration_no.toLowerCase().indexOf(query) > -1)) {
            newFilter.push(item)
          }
        })
        this.filtered_students_in_class = newFilter
        // });
      } else {
        // if nothing is typed, restore the full list
        this.filtered_students_in_class = this.broadSheetData.students_in_class
      }
    },
    sortTable(n) {
      let rows; let switching; let i; let x; let y; let shouldSwitch; let dir; let
        switchcount = 0
      const table = document.getElementById('myTable')
      switching = true
      // Set the sorting direction to ascending:
      dir = 'asc'
      /* Make a loop that will continue until
      no switching has been done: */
      while (switching) {
        // Start by saying: no switching is done:
        switching = false
        rows = table.rows
        /* Loop through all table rows (except the
        first, which contains table headers): */
        // eslint-disable-next-line no-plusplus
        for (i = 1; i < (rows.length - 1); i++) {
          // Start by saying there should be no switching:
          shouldSwitch = false
          /* Get the two elements you want to compare,
          one from current row and one from the next: */
          // const n = rows[i].getElementsByTagName('TD').length - 4
          x = rows[i].getElementsByTagName('TD')[n]
          y = rows[i + 1].getElementsByTagName('TD')[n]
          /* Check if the two rows should switch place,
          based on the direction, asc or desc: */
          if (dir === 'asc') {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              // If so, mark as a switch and break the loop:
              shouldSwitch = true
              break
            }
          } else if (dir === 'desc') {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
              // If so, mark as a switch and break the loop:
              shouldSwitch = true
              break
            }
          }
        }
        if (shouldSwitch) {
          /* If a switch has been marked, make the switch
          and mark that a switch has been done: */
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
          switching = true
          // Each time a switch is done, increase this count by 1:
          // eslint-disable-next-line no-plusplus
          switchcount++
        } else {
          /* If no switching has been done AND the direction is "asc",
          set the direction to "desc" and run the while loop again. */
          // eslint-disable-next-line no-lonely-if
          if (switchcount === 0 && dir === 'asc') {
            dir = 'desc'
            switching = true
          }
        }
      }
    },
  },

}
</script>
<style>
  .clickable{
    cursor: pointer;

  }
  .dataTables_filter{
    text-align: right!important;
  }

</style>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
<style scoped>
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
