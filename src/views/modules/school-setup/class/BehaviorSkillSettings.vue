<template>
  <div v-if="tableData.length > 0">
    <template>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="450"
        @input="recordRatings(scope.row.student_id, $event)"
      >
        <!-- <el-table-column
          type="selection"
          width="55"
        /> -->
        <el-table-column
          fixed
          label="Student Name"
          width="250"
        >
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="BEHAVIORAL RATINGS">
          <el-table-column
            label="Attentiveness"
            width="150"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.attentiveness"
                placeholder="Rate"
                style="width: 100%"
                @input="recordRatings('behaviour', scope.row.student_id, $event, 'attentiveness')"
              >
                <el-option
                  v-for="(rating, index) in ratings"
                  :key="index"
                  :value="rating.value"
                  :label="rating.label"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="Calmness"
            width="150"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.calmness"
                placeholder="Rate"
                style="width: 100%"
                @input="recordRatings('behaviour', scope.row.student_id, $event, 'calmness')"
              >
                <el-option
                  v-for="(rating, index) in ratings"
                  :key="index"
                  :value="rating.value"
                  :label="rating.label"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="Honesty"
            width="150"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.honesty"
                placeholder="Rate"
                style="width: 100%"
                @input="recordRatings('behaviour', scope.row.student_id, $event, 'honesty')"
              >
                <el-option
                  v-for="(rating, index) in ratings"
                  :key="index"
                  :value="rating.value"
                  :label="rating.label"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="Neatness"
            width="150"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.neatness"
                placeholder="Rate"
                style="width: 100%"
                @input="recordRatings('behaviour', scope.row.student_id, $event, 'neatness')"
              >
                <el-option
                  v-for="(rating, index) in ratings"
                  :key="index"
                  :value="rating.value"
                  :label="rating.label"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="Punctuality"
            width="150"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.punctuality"
                placeholder="Rate"
                style="width: 100%"
                @input="recordRatings('behaviour', scope.row.student_id, $event, 'punctuality')"
              >
                <el-option
                  v-for="(rating, index) in ratings"
                  :key="index"
                  :value="rating.value"
                  :label="rating.label"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="Perseverance"
            width="150"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.perseverance"
                placeholder="Rate"
                style="width: 100%"
                @input="recordRatings('behaviour', scope.row.student_id, $event, 'perseverance')"
              >
                <el-option
                  v-for="(rating, index) in ratings"
                  :key="index"
                  :value="rating.value"
                  :label="rating.label"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="SKILL RATINGS">
          <el-table-column
            label="Leadership"
            width="150"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.leadership"
                placeholder="Rate"
                style="width: 100%"
                @input="recordRatings('skill', scope.row.student_id, $event, 'leadership')"
              >
                <el-option
                  v-for="(rating, index) in ratings"
                  :key="index"
                  :value="rating.value"
                  :label="rating.label"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="Initiative"
            width="150"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.initiative"
                placeholder="Rate"
                style="width: 100%"
                @input="recordRatings('skill', scope.row.student_id, $event, 'initiative')"
              >
                <el-option
                  v-for="(rating, index) in ratings"
                  :key="index"
                  :value="rating.value"
                  :label="rating.label"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="Art Works"
            width="150"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.art_works"
                placeholder="Rate"
                style="width: 100%"
                @input="recordRatings('skill', scope.row.student_id, $event, 'art_works')"
              >
                <el-option
                  v-for="(rating, index) in ratings"
                  :key="index"
                  :value="rating.value"
                  :label="rating.label"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="Spoken English"
            width="150"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.spoken_english"
                placeholder="Rate"
                style="width: 100%"
                @input="recordRatings('skill', scope.row.student_id, $event, 'spoken_english')"
              >
                <el-option
                  v-for="(rating, index) in ratings"
                  :key="index"
                  :value="rating.value"
                  :label="rating.label"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="Sports"
            width="150"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.sports"
                placeholder="Rate"
                style="width: 100%"
                @input="recordRatings('skill', scope.row.student_id, $event, 'sports')"
              >
                <el-option
                  v-for="(rating, index) in ratings"
                  :key="index"
                  :value="rating.value"
                  :label="rating.label"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="Tools Handling"
            width="150"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.tools_handling"
                placeholder="Rate"
                style="width: 100%"
                @input="recordRatings('skill', scope.row.student_id, $event, 'tools_handling')"
              >
                <el-option
                  v-for="(rating, index) in ratings"
                  :key="index"
                  :value="rating.value"
                  :label="rating.label"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  props: {
    studentsInClass: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tableData: [],
      ratings: [
        { value: 5, label: 'Excellent' },
        { value: 4, label: 'Very Good' },
        { value: 3, label: 'Good' },
        { value: 2, label: 'Average' },
        { value: 1, label: 'Fair' },
      ],
      multipleSelection: [],
    }
  },
  mounted() {
    this.setTableData(this.studentsInClass)
  },
  methods: {
    setTableData(studentsInClass) {
      const app = this
      const tableData = []
      studentsInClass.forEach(element => {
        if (element.student !== null) {
          const data = {
            student_id: element.student_id,
            name: `${element.student.user.first_name} ${element.student.user.last_name}`,
            // behavior
            attentiveness: (element.student.behavior !== null) ? element.student.behavior.attentiveness : '',
            calmness: (element.student.behavior !== null) ? element.student.behavior.calmness : '',
            honesty: (element.student.behavior !== null) ? element.student.behavior.honesty : '',
            neatness: (element.student.behavior !== null) ? element.student.behavior.neatness : '',
            punctuality: (element.student.behavior !== null) ? element.student.behavior.punctuality : '',
            perseverance: (element.student.behavior !== null) ? element.student.behavior.perseverance : '',
            // skils
            leadership: (element.student.skill !== null) ? element.student.skill.leadership : '',
            initiative: (element.student.skill !== null) ? element.student.skill.initiative : '',
            art_works: (element.student.skill !== null) ? element.student.skill.art_works : '',
            spoken_english: (element.student.skill !== null) ? element.student.skill.spoken_english : '',
            sports: (element.student.skill !== null) ? element.student.skill.sports : '',
            tools_handling: (element.student.skill !== null) ? element.student.skill.tools_handling : '',
          }
          tableData.push(data)
        }
      })
      app.tableData = tableData
    },
    recordRatings(ratings, studentId, value, field) {
      const param = {
        ratings, value, student_id: studentId, field,
      }
      const recordRatingsResource = new Resource('school-setup/record-ratings')
      recordRatingsResource.store(param)
        .then(() => {

        })
        .catch(error => {
          console.log(error)
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
  },
}
</script>
