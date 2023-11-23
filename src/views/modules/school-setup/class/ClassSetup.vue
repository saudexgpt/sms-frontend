<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Manage Class</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              size="sm"
              @click="isCreateClassSidebarActive = true"
            >
              <feather-icon
                icon="FilePlusIcon"
                class="mr-50"
              />
              <span class="align-middle">Create</span>
            </b-button>
          </span>
        </b-col>
        <!-- <b-col cols="6">
            <div class="custom-search d-flex justify-content-end">
              <b-form-group>
                <div class="d-flex align-items-center">
                  <label class="mr-1">Search</label>
                  <b-form-input
                    v-model="searchTerm"
                    placeholder="Search"
                    type="text"
                    class="d-inline-block"
                  />
                </div>
              </b-form-group>
            </div>
          </b-col> -->
      </b-row>
    </div>
    <v-client-table
      v-model="classes"
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
        slot="staff"
        slot-scope="props"
      >
        <el-select
          v-model="props.row.teacher_id"
          placeholder="Select PC Teacher"
          filterable
          style="width: 250px"
          @change="assignPcTeacher(props, $event)"
        >
          <template
            v-for="(each_staff, index) in staff"
          >
            <el-option
              v-if="each_staff.user"
              :key="index"
              :label="each_staff.user.first_name + ' ' + each_staff.user.last_name"
              :value="each_staff.id"
            />
          </template>
        </el-select>
      </div>
      <div
        slot="action"
        slot-scope="props"
      >
        <b-button
          variant="gradient-warning"
          class="btn-icon rounded-circle"
          @click="editThisRow(props.row)"
        >
          <feather-icon icon="EditIcon" />
        </b-button>
        <b-button
          v-if="props.row.first_student_in_class === null"
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="confirmDelete(props.row)"
        >
          <feather-icon icon="TrashIcon" />
        </b-button>
      </div>
    </v-client-table>
    <create-class
      v-if="isCreateClassSidebarActive"
      v-model="isCreateClassSidebarActive"
      :levels="levels"
      :sections="sections"
      @save="updateTable"
    />
    <edit-class
      v-if="isEditClassSidebarActive"
      v-model="isEditClassSidebarActive"
      :selected-curriculum-class="editable_row"
      @update="updateTable"
    />
  </el-card>
</template>

<script>
import {
  BButton, BRow, BCol,
} from 'bootstrap-vue'
// import vSelect from 'vue-select'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import CreateClass from './partials/CreateClass.vue'
import EditClass from './partials/EditClass.vue'

export default {
  components: {
    // VueGoodTable,
    // vSelect,
    CreateClass,
    EditClass,
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
  },
  data() {
    return {
      isCreateClassSidebarActive: false,
      isEditClassSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'action',
        'staff',
        'level.level',
        'c_class.name',
      ],

      options: {
        headings: {
          'level.level': 'Level',
          'c_class.name': 'Class Name',
          staff: 'Assigned Teacher (pick to change)',
          // assign: 'Assign TO',
          action: '',

          // id: 'S/N',
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        // filterByColumn: true,
        sortable: [
          'level.level',
          'c_class.name',
        ],
        // filterable: false,
        filterable: [
          'level.level',
          'c_class.name',
          'staff.user.first_name',
          'staff.user.last_name',
        ],
      },
      classes: [],
      levels: [],
      sections: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }],
      staff: [],
      loading: false,
      editable_row: '',
      selected_row_index: '',
      selected_teacher: '',
    }
  },
  created() {
    this.fetchClasses()
  },
  methods: {
    fetchClasses() {
      const app = this
      app.loading = true
      const fetchCurriculumSetupResource = new Resource('school-setup/classes')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.classes = response.class_teachers
          app.levels = response.levels
          app.sections = response.sections.concat(app.sections)
          app.staff = response.staff
          app.loading = false
        })
    },
    assignPcTeacher(selectedRow, selectedTeacher) {
      // console.log(selectedTeacher)
      // console.log(selectedRow)
      const app = this
      const param = {
        class_teacher_id: selectedRow.row.id,
        teacher_id: selectedTeacher,
      }
      const fetchCurriculumSetupResource = new Resource('school-setup/class/assign-teacher')
      fetchCurriculumSetupResource.store(param)
        .then(assignedTeacher => {
          app.classes[selectedRow.index - 1].staff = assignedTeacher
          app.classes[selectedRow.index - 1].teacher_id = assignedTeacher.id
        })
    },
    updateTable(classes) {
      const app = this
      app.classes = classes
    },
    editThisRow(value) {
      // console.log(props)
      const app = this
      app.editable_row = value
      app.isEditClassSidebarActive = true
    },
    confirmDelete(cClass) {
      const app = this
      const message = `You are about to delete ${cClass.class}. It might affect any student in that class. Click Yes to confirm.`
      app.$bvModal
        .msgBoxConfirm(message, {
          title: 'Confirm Delete Action',
          size: 'sm',
          okVariant: 'danger',
          okTitle: 'Yes',
          cancelTitle: 'No',
          cancelVariant: 'outline-secondary',
          hideHeaderClose: false,
          centered: true,
        })
        .then(value => {
          if (value) {
            app.deleteClass(cClass)
          }
        })
    },
    deleteClass(cClass) {
      const app = this
      const deleteCurriculumSetupResource = new Resource('school-setup/class/destroy')
      deleteCurriculumSetupResource.destroy(cClass.id)
        .then(() => {
          app.fetchClasses()
        })
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
