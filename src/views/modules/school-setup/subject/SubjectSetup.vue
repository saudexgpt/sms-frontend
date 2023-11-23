<template>
  <div>
    <div v-if="page === 'subjects'">
      <el-card>
        <div slot="header">
          <b-row>
            <b-col
              cols="6"
            >
              <h4>Manage Subject</h4>
            </b-col>
            <b-col
              cols="6"
            >
              <span class="demo-inline-spacing pull-right">
                <b-button
                  v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                  variant="gradient-primary"
                  size="sm"
                  @click="isCreateSubjectSidebarActive = true"
                >
                  <feather-icon
                    icon="FilePlusIcon"
                    class="mr-50"
                  />
                  <span class="align-middle">Create</span>
                </b-button>
                <b-button
                  v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                  variant="gradient-danger"
                  size="sm"
                  @click="page = 'assign_teachers'"
                >
                  <feather-icon
                    icon="UserIcon"
                    class="mr-50"
                  />
                  <span>Assign Subjects</span>
                </b-button>
              </span>
            </b-col>
          </b-row>
        </div>
        <div>
          <b-row>
            <b-col
              cols="6"
            >
              <v-select
                v-model="selected_level_group"
                placeholder="Select Level Group"
                :options="level_groups"
                label="name"
                value="id"
              />
            </b-col>
          </b-row>
          <v-client-table
            v-model="selected_level_group.subjects"
            v-loading="loading"
            :columns="columns"
            :options="options"
          >
            <!-- <div
                slot="staff"
                slot-scope="props"
              ><i class="el-icon-user-solid" /> {{ props.row.staff.user.first_name + ' ' + props.row.staff.user.last_name }}
              </div> -->
            <div
              slot="color_code"
              slot-scope="props"
            >
              <v-swatches
                v-model="props.row.color_code"
                popover-x="right"
                swatches="text-advanced"
                @input="changeColor(props, $event)"
              />
            </div>
            <div
              slot="action"
              slot-scope="props"
            >
              <b-button
                v-b-tooltip.hover.bottom="'Edit'"
                variant="gradient-warning"
                class="btn-icon rounded-circle"
                @click="editThisRow(props)"
              >
                <feather-icon icon="EditIcon" />
              </b-button>
              <b-button
                v-if="props.row.enabled === 1"
                v-b-tooltip.hover.bottom="'Disable'"
                variant="gradient-danger"
                class="btn-icon rounded-circle"
                @click="enableSubject(props.row, 0)"
              >
                <feather-icon icon="XIcon" />
              </b-button>
              <b-button
                v-else
                v-b-tooltip.hover.bottom="'Enable'"
                variant="gradient-success"
                class="btn-icon rounded-circle"
                @click="enableSubject(props.row, 1)"
              >
                <feather-icon icon="CheckIcon" />
              </b-button>

              <!-- <b-button
                variant="gradient-danger"
                class="btn-icon rounded-circle"
                @click="confirmDelete(props.row)"
              >
                <feather-icon icon="TrashIcon" />
              </b-button> -->
            </div>
          </v-client-table>
        </div>
        <create-subject
          v-if="isCreateSubjectSidebarActive"
          v-model="isCreateSubjectSidebarActive"
          :level-groups="level_groups"
          @save="updateTable"
        />
        <edit-subject
          v-if="isEditSubjectSidebarActive"
          v-model="isEditSubjectSidebarActive"
          :selected-subject="editable_row"
          @update="updateEditedRow"
        />
      </el-card>
    </div>
    <div
      v-if="page ==='assign_teachers'"
    >
      <span class="pull-left">
        <b-button
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="gradient-danger"
          size="sm"
          @click="page = 'subjects'"
        >
          <feather-icon
            icon="ArrowLeftIcon"
            class="mr-50"
          />
          <span class="align-middle">Back</span>
        </b-button>
      </span>
      <assign-teachers />
    </div>
  </div>
</template>

<script>
import {
  BButton, BRow, BCol, VBTooltip,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import VSwatches from 'vue-swatches'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import CreateSubject from './partials/CreateSubject.vue'
import EditSubject from './partials/EditSubject.vue'
import AssignTeachers from './AssignTeachers.vue'

export default {
  components: {
    // VueGoodTable,
    vSelect,
    VSwatches,
    CreateSubject,
    EditSubject,
    AssignTeachers,
    BButton,
    // BPagination,
    // BFormGroup,
    // BFormInput,
    // BFormSelect,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      page: 'subjects',
      isCreateSubjectSidebarActive: false,
      isEditSubjectSidebarActive: false,
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
        rowAttributesCallback(row) {
          if (row.enabled === 0) {
            return { style: 'background: #d83b3beb; color: #000000' }
          }
          return null
        },
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
      subjects: [],
      selected_level_group: {
        subjects: [],
      },
      level_groups: [],
      loading: false,
      editable_row: '',
      selected_row_index: '',
      selected_teacher: '',

    }
  },
  created() {
    this.fetchSubjects(0)
  },
  methods: {
    fetchSubjects(index) {
      const app = this
      app.loading = true
      const fetchCurriculumSetupResource = new Resource('school-setup/subjects')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.level_groups = response.level_groups
          // eslint-disable-next-line prefer-destructuring
          app.selected_level_group = app.level_groups[index]
          app.loading = false
        })
    },
    changeColor(props, value) {
      // console.log(props)
      const app = this
      const param = {
        color_code: value.replace('#', ''),
        id: props.row.id,
        option: 'subject',
      }
      const fetchCurriculumSetupResource = new Resource('school-setup/set/color-code')
      fetchCurriculumSetupResource.list(param)
        .then(() => {
          app.selected_level_group.subjects[props.index - 1].color_code = value
          // console.log(response)
        })
    },
    updateTable(levelGroups) {
      const app = this
      app.level_groups = levelGroups
      const index = levelGroups.findIndex(object => object.id === app.selected_level_group.id)
      app.selected_level_group.subjects = levelGroups[index].subjects
    },
    updateSubjects(subjects) {
      const app = this
      app.selected_level_group.subjects = subjects
    },
    updateEditedRow(subject) {
      const app = this
      app.selected_level_group.subjects[app.selected_row_index - 1].name = subject.name
      app.selected_level_group.subjects[app.selected_row_index - 1].code = subject.code
      // console.log(app.selected_level_group.subjects[app.selected_row_index - 1])
    },
    editThisRow(value) {
      // console.log(props)
      const app = this
      app.editable_row = value.row
      app.selected_row_index = value.index
      app.isEditSubjectSidebarActive = true
    },
    confirmDelete(subject) {
      const app = this
      const message = `You are about to delete ${subject.name}. All entries related to this subject will be deleted (Results, Assignments and Attendance).`
      app.$bvModal
        .msgBoxConfirm(message, {
          title: 'Confirm Delete Action (Irreversible)',
          size: 'sm',
          okVariant: 'danger',
          okTitle: 'Yes, Delete',
          cancelTitle: 'No',
          cancelVariant: 'outline-secondary',
          hideHeaderClose: false,
          centered: true,
        })
        .then(value => {
          if (value) {
            app.deleteSubject(subject)
          }
        })
    },
    deleteSubject(subject) {
      const app = this
      app.loading = true
      const deleteCurriculumSetupResource = new Resource('school-setup/subject/destroy')
      deleteCurriculumSetupResource.destroy(subject.id)
        .then(response => {
          app.loading = false
          app.updateSubjects(response.subjects)
        }).catch(error => {
          app.$alert(error.response.data.message)
        })
    },
    enableSubject(subject, status) {
      const app = this
      app.loading = true
      const param = { status }
      const deleteCurriculumSetupResource = new Resource('school-setup/enable-subject')
      deleteCurriculumSetupResource.update(subject.id, param)
        .then(response => {
          app.loading = false
          app.updateSubjects(response.subjects)
        }).catch(error => {
          app.$alert(error.response.data.message)
        })
    },
  },
}
</script>
