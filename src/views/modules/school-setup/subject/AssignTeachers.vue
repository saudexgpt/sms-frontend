<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Assign Subject Teachers</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              @click="modalShow = true"
            >
              <feather-icon
                icon="FilePlusIcon"
                class="mr-50"
              />
              <span class="align-middle">Make Selection</span>
            </b-button>
          </span>
        </b-col>
      </b-row>
    </div>
    <div style="overflow: auto">
      <div class="custom-search d-flex">
        <b-form-group>
          <div class="d-flex align-items-center">
            <b-form-input
              placeholder="Search Teacher"
              type="text"
              class="d-inline-block"
              @input="searchTeacher($event)"
            />
          </div>
        </b-form-group>
      </div>
      <table
        v-if="filtered_staff.length > 0"
        v-loading="loading"
        class="resultTable table-bordered table-striped"
      >
        <thead class="sticky-header">
          <tr>
            <!-- <th /> -->
            <th>
              <div class="padded">
                Teacher Name
              </div>
            </th>
            <template
              v-for="(subject_teacher, index) in subject_teachers"
            >
              <th
                v-if="subject_teacher.subject.enabled === 1"
                :key="index"
                class="verticalHeader solid-border padded"
                :value="subject_teacher.id"
              >
                <div><span>{{ subject_teacher.subject.code }}</span></div>
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(teacher, index) in filtered_staff"
            :key="index"
            :value="teacher.id"
          >
            <template v-if="teacher.user">
              <td align="left">
                {{ teacher.user.first_name }} {{ teacher.user.last_name }}
              </td>
              <template
                v-for="(subject_teacher, subject_teacher_index) in subject_teachers"
              >
                <td
                  v-if="subject_teacher.subject.enabled === 1"
                  :key="subject_teacher_index"
                  :value="subject_teacher.id"
                >

                  <!-- <b-form-checkbox
                :checked="teacher.id === subject_teacher.teacher_id"
                class="custom-control-success"
                name="check-button"
                switch
                @change="assignSubjectTeachers(teacher.id, subject_teacher.id)"
              >
                <span class="switch-icon-left">
                  <feather-icon icon="CheckIcon" />
                </span>
                <span class="switch-icon-right">
                  <feather-icon icon="XIcon" />
                </span>
              </b-form-checkbox> -->
                  <div>
                    <input
                      :id="teacher.id + '-' + subject_teacher.id"
                      type="checkbox"
                      :checked="teacher.id === subject_teacher.teacher_id"
                      :name="subject_teacher.id"
                      @click="assignSubjectTeachers(teacher.id, subject_teacher.id)"
                    >

                  </div>

                </td>
              </template>

            </template>
          </tr>
        </tbody>
        <!-- <tfoot class="sticky-header">
          <tr>
            <th>
              <div class="padded">
                Teacher Name
              </div>
            </th>
            <template
              v-for="(subject_teacher, index) in subject_teachers"
            >
              <th
                v-if="subject_teacher.subject.enabled === 1"
                :key="index"
                class="verticalHeader solid-border padded"
                :value="subject_teacher.id"
              >
                <div><span>{{ subject_teacher.subject.code }}</span></div>
              </th>
            </template>
          </tr>
        </tfoot> -->
      </table>
    </div>
    <!--SIDEBAR MODAL-->
    <b-sidebar
      v-model="modalShow"
      sidebar-subject="sidebar-lg"
      :visible="modalShow"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Select Level and Class
          </h5>
          <div>
            <b-button
              variant="gradient-danger"
              class="btn-icon"
              @click="hide"
            >
              <feather-icon
                icon="XIcon"
              />
            </b-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <b-form-group>
            <label for="level">Level</label>

            <v-select
              v-model="selected_level"
              placeholder="Select Level"
              :options="levels"
              label="level"
              value="id"
            />
          </b-form-group>
          <b-form-group>
            <label for="class">Class</label>
            <el-select
              v-model="selected_class"
              placeholder="Select Class"
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="(class_teacher, index) in selected_level.class_teachers"
                :key="index"
                :label="class_teacher.c_class.name"
                :value="class_teacher.id"
              />
            </el-select>
          </b-form-group>
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mr-1"
            @click="fetchSubjects(true)"
          >
            Fetch Subjects
          </b-button>
        </div>
      </template>
    </b-sidebar>
    <!--SIDEBAR MODAL-->
  </el-card>
</template>

<script>
import {
  BButton, BRow, BCol, BSidebar, BFormGroup, BFormInput,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    // VueGoodTable,
    vSelect,
    BSidebar,
    BButton,
    BFormGroup,
    // BPagination,
    BFormInput,
    // BFormCheckbox,
    // BFormSelect,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      modalShow: true,
      searchTerm: '',
      pageLength: 10,
      dir: false,
      columns: [
        'color_code',
        'name',
        'code',
        'action',
      ],

      options: {
        headings: {
          color_code: 'Color',
          name: 'Title',
          action: '',

          // id: 'S/N',
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        filterByColumn: true,
        sortable: [
          'name',
          'code',
        ],
        // filterable: false,
        filterable: [
          'name',
          'code',
        ],
      },
      levels: [],
      selected_level: {
        level: '',
        class_teachers: [],
      },
      selected_class: '',
      loading: false,
      subject_teachers: [],
      staff: [],
      filtered_staff: [],
    }
  },
  created() {
    this.fetchLevelClass()
  },
  methods: {
    fetchLevelClass() {
      const app = this
      const fetchCurriculumSetupResource = new Resource('school-setup/fetch-level-class')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.levels = response.levels
        })
    },
    fetchSubjects(load) {
      const app = this
      app.modalShow = false
      const param = {
        class_teacher_id: app.selected_class,
        level_id: app.selected_level.id,
      }
      app.loading = load
      const fetchTeacherSubjectResource = new Resource('school-setup/fetch-teacher-subject')
      fetchTeacherSubjectResource.list(param)
        .then(response => {
          app.subject_teachers = response.subject_teachers
          app.staff = response.staff
          app.filtered_staff = app.staff
          app.loading = false
        })
    },
    assignSubjectTeachers(teacherId, subjectTeacherId) {
      // console.log(document.getElementById(teacherId + subjectTeacherId).checked)
      // if (document.getElementById(teacherId + subjectTeacherId).checked === true) {
      //   document.getElementById(teacherId + subjectTeacherId).checked = false
      // }
      const x = document.getElementsByName(subjectTeacherId)
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < x.length; i++) {
        if (x[i] !== document.getElementById(`${teacherId}-${subjectTeacherId}`)) {
          x[i].checked = false
        }
      }
      let selectedTeacherId = null
      let message = 'Subject Unassigned Successfully'
      if (document.getElementById(`${teacherId}-${subjectTeacherId}`).checked) {
        selectedTeacherId = teacherId
        message = 'Subject Assigned Successfully'
      }
      const assignSubjectTeacherResource = new Resource('school-setup/assign-subject')
      const param = { teacher_id: selectedTeacherId }

      assignSubjectTeacherResource.update(subjectTeacherId, param)
        .then(() => {
          this.$bvToast.toast(message, {
            title: 'Success',
            variant: 'success',
            solid: true,
          })
          // this.fetchSubjects(false)
          // const subject = response.subject
          // const teacher = response.teacher
          // this.$message(subject + ' assigned to ' + teacher + ' Successfully!!!')
        })
    },
    searchTeacher(value) {
      const query = value.toLowerCase()
      const items = this.staff
      const newFilter = []
      if (query && query.trim() !== '') {
        // we check whether somthing is typed. if it is type, filter it
        items.forEach(item => {
          if ((item.user.first_name.toLowerCase().indexOf(query) > -1) || (item.user.last_name.toLowerCase().indexOf(query) > -1)) {
            newFilter.push(item)
          }
        })
        this.filtered_staff = newFilter
        // });
      } else {
        // if nothing is typed, restore the full list
        this.filtered_staff = this.staff
      }
    },
  },
}
</script>
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
</style>
