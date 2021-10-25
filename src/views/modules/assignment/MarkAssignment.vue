<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <el-card>
      <h4>Click on the + sign to view students' response</h4>
      <v-client-table
        v-model="studentAssignments"
        v-loading="load"
        :columns="columns"
        :options="options"
      >
        <div
          slot="child_row"
          slot-scope="{row}"
        >
          <aside>
            <legend>Student Answer</legend>
            <span v-html="row.student_answer" />
          </aside>

        </div>
        <div
          slot="created_at"
          slot-scope="{row}"
        >{{ moment(row.created_at).format('MMM Do YYYY') }}
        </div>
        <div
          slot="name"
          slot-scope="{row}"
        >{{ row.student.user.first_name + ' ' + row.student.user.last_name }}
        </div>
        <div
          slot="score"
          slot-scope="props"
        >
          <el-select
            v-model="props.row.score"
            @change="setScore(props.index, props.row, $event, props.row.remark)"
          >
            <el-option
              v-for="value in 20"
              :key="value"
              :value="value"
              :label="value"
            />
          </el-select>
        </div>
        <div
          slot="remark"
          slot-scope="props"
        >
          <el-input
            v-model="props.row.remark"
            type="textarea"
            placeholder="Type Remark Here..."
            maxlength="60"
            show-word-limit
            @input="setRemark(props.index, $event)"
            @change="setScore(props.index, props.row, props.row.score, $event)"
          />
        </div>
      </v-client-table>
    </el-card>
  </div>
</template>
<script>
import moment from 'moment'
import Resource from '@/api/resource'

export default {
  props: {
    studentAssignments: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      subject_teacher_id: '',
      columns: [
        'name',
        'created_at',
        'score',
        'remark',
      ],

      options: {
        headings: {
          created_at: 'Date Submitted',
        },
        sortable: [],
        // filterable: false,
        filterable: [],
      },
      load: false,
    }
  },
  created() {
    // this.fetchSubjects()
  },
  methods: {
    moment,
    setRemark(index, remark) {
      const app = this
      app.studentAssignments[index - 1].remark = remark
    },
    setScore(index, row, score, remark) {
      const app = this
      const param = {
        id: row.id,
        score,
        remark,
      }
      app.studentAssignments[index - 1].score = score
      app.studentAssignments[index - 1].remark = remark
      const fetchTeacherSubjectResource = new Resource('assignment/score')
      fetchTeacherSubjectResource.store(param).then(response => {
        app.subject_teachers = response.subject_teachers
      })
    },
  },
}
</script>
