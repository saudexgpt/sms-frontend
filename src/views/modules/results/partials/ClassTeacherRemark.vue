<template>
  <div
    v-if="broadSheetData"
    class=""
  >
    <div class="box">
      <div class="box-header">
        <h4 class="box-title">
          Class Teacher's Remark/Comment for {{ broadSheetData.class_name }} ({{ broadSheetData.sub_term.toUpperCase() }} Term)
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
              <tr role="row">
                <th
                  class="sorting_asc padded"
                  tabindex="0"
                  aria-controls="table_marksheet"
                  rowspan="1"
                  colspan="1"
                  style="width: 41px;"
                  @click="sortTable(3 + broadSheetData.result_subjects.length)"
                >
                  <div>
                    S/N
                  </div>
                </th>
                <th class="solid-border clickable padded">
                  <div>
                    Student Name
                  </div>
                </th>
                <th class="solid-border clickable padded">
                  <div>
                    Student ID
                  </div>
                </th>

                <th
                  v-for="(subject_name,index) in broadSheetData.result_subjects"
                  :key="index"
                  class="verticalHeader solid-border clickable"
                >
                  <div><span>{{ subject_name }}</span></div>
                </th>

                <!--<th class="verticalHeader sorting" >
                        <span>GPA</span>
                    </th>-->
                <th
                  class="verticalHeader solid-border clickable"
                  @click="sortTable(3 + broadSheetData.result_subjects.length)"
                >
                  <div><span>Average</span></div>
                </th>
                <th class="solid-border noExport">
                  <div>
                    Give Remark/Comment
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>

              <tr
                v-for="(student_in_class,index) in filtered_students_in_class"
                :key="index"
                class=""
              >
                <td>{{ rankResult(student_in_class.student_result.average, broadSheetData.result_averages, 'serial_number') }}</td>
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
                <!-- <td
                  v-for="(result_detail, result_index) in student_in_class.student_result.result_details"
                  :key="result_index"
                  :style="'background:'+result_detail.color+'; color: #000;'"
                >

                  <span v-if="result_detail.total">
                    {{ result_detail.total }}
                  </span>
                  <span v-else>-</span>

                </td> -->
                <td class="noExport">
                  {{ student_in_class.student_result.average }}
                </td>
                <!--<td style="background:{{$average_color}}   ; ">{{$grade_point}}</td>
                <td >{{rankResult(student_in_class.student_result.average, broadSheetData.result_averages, 'position')}}</td>-->
                <td width="300">
                  <textarea
                    id="remark"
                    v-model="student_in_class.student_remark.class_teacher_remark"
                    row="3"
                    style="width: 300px;"
                    class=""
                    aria-multiline="true"
                    tabindex="0"
                    aria-invalid="false"
                    placeholder="Type remark here..."
                    @blur="giveRemark(student_in_class.student_remark.class_teacher_remark, student_in_class.student_id, 'class_teacher');"
                  />

                  <!--<textarea row="3" style="width: 100%;"  class="" aria-multiline="true" tabindex="0" aria-invalid="false" v-model="student_in_class.student_remark.class_teacher_remark" placeholder="Type remark here..." id="remark" @blur="giveRemark(student_in_class.student_remark.class_teacher_remark, student_in_class.student_id, 'class_teacher');"></textarea>-->
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
import Resource from '@/api/resource'
import Helper from '@/api/helper'

const loadHelper = new Helper()
const giveStudentRemark = new Resource('result/give-student-remark')
// const fetchResultComment = new Resource('result/get-result-comment')
export default {
  components: { BFormGroup, BFormInput },
  props: {
    broadSheetData: {
      type: Object,
      default: () => ({}),
    },
    params: {
      type: Object,
      default: () => ({}),
    },

  },
  data() {
    return {
      // resultCommentData: {},
      filtered_students_in_class: [],
    }
  },
  created() {
    // this.fetchBroadSheet()
    this.filtered_students_in_class = this.broadSheetData.students_in_class
    // sort table by average (ranking)
    // this.sortTable(3 + this.broadSheetData.result_subjects.length)
  },
  methods: {
    giveRemark(remark, studentId, remarkBy) {
      const app = this
      const param = {

        sess_id: app.params.sess_id,
        term_id: app.params.term_id,
        sub_term: app.params.sub_term,
        class_teacher_id: app.params.class_teacher_id,
        student_id: studentId,
        remark,
        remark_by: remarkBy,
      }
      giveStudentRemark.list(param, false)
        .then(response => {
        // app.resultCommentData = response;
          console.log(response)
          // setTimeout(function(){app.setDataTable();}, 0);//delay for zero seconds
        })
        .catch(error => {
          console.log(error)
        })
    },
    setDataTable() {
      const app = this
      // app.order_column = Object.keys(app.broadSheetData.result_subjects).length + 3;
      if (app.broadSheetData) {
        // const oTable = $('.datatable').DataTable('refresh')
      }
    },
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
