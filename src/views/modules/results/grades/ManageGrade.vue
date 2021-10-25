<template>
  <el-card>
    <div
      v-if="page==='list'"
      slot="header"
      class="clearfix"
    >
      <span>Avaliable Grade</span>
      <el-button
        style="float: right; padding: 8px"
        type="text"
        class="btn btn-primary"
        @click="page = 'addNew'"
      >
        Add Grade
      </el-button>
    </div>
    <div
      v-if="page==='addNew'"
      slot="header"
      class="clearfix"
    >
      <span>Add New Grades</span>
      <el-button
        style="float: right; padding: 8px"
        type="text"
        class="btn btn-primary"
        @click="page = 'list'"
      >
        View Grades
      </el-button>
    </div>
    <div v-if="page==='list'">
      <v-client-table
        v-loading="load"
        :data="grades"
        :columns="columns"
        :options="options"
      >
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
            variant="gradient-primary"
            class="btn-icon rounded-circle"
            @click="editGrade(props)"
          >
            <feather-icon icon="EditIcon" />
          </b-button>
          <b-button
            variant="gradient-danger"
            class="btn-icon rounded-circle"
            @click="deleteGrade(props)"
          >
            <feather-icon icon="Trash2Icon" />
          </b-button>
        </div>
      </v-client-table>
    </div>
    <div v-if="page==='addNew'">
      <add-grades @returnToPage="page = 'list'; fetchGrades()" />
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
      class="no-print"
    >
      <template
        #default="{ hide }"
      >
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Edit Selected Grade
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
        <div
          v-loading="load_modal"
          class="justify-content-between align-items-center px-2 py-1"
        >
          <b-form-group>
            <label>Grade</label>
            <el-input
              v-model="editForm.grade"
              type="text"
              outline
              placeholder="Ex: A+"
              min="3"
            />
          </b-form-group>
          <b-form-group>
            <label>Interpretation</label>
            <el-input
              v-model="editForm.interpretation"
              type="text"
              outline
              placeholder="Ex: Excellent"
            />
          </b-form-group>
          <b-form-group>
            <label>Upper Limit</label>
            <el-input
              v-model="editForm.upper_limit"
              type="text"
              outline
              placeholder="Ex: 100"
            />
          </b-form-group>
          <b-form-group>
            <label>Lower Limit</label>
            <el-input
              v-model="editForm.lower_limit"
              type="text"
              outline
              placeholder="Ex: 75"
            />
          </b-form-group>
          <b-form-group>
            <label>Grade Point</label>
            <el-input
              v-model="editForm.grade_point"
              type="text"
              outline
              placeholder="Ex: 5"
            />
          </b-form-group>
          <b-form-group>
            <hr>
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-1"
              @click="updateGrade()"
            >
              Update Grade
            </b-button>
          </b-form-group>
        </div>
      </template>
    </b-sidebar>
    <!--SIDEBAR MODAL-->
  </el-card>
</template>
<script>
import {
  BButton, BSidebar, BFormGroup,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import VSwatches from 'vue-swatches'
import Resource from '@/api/resource'
import AddGrades from './AddGrades.vue'

export default {
  components: {
    BButton,
    BSidebar,
    BFormGroup,
    VSwatches,
    AddGrades,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      modalShow: false,
      load_modal: false,
      page: 'list',
      columns: ['curriculum_level_group.name', 'grade', 'interpretation', 'upper_limit', 'lower_limit', 'grade_point', 'color_code', 'action'],
      options: {
        headings: {
          'curriculum_level_group.name': 'Level',
          upper_limit: 'Upper Limit',
          lower_limit: 'Lower Limit',
          grade_point: 'Grade Point',
          color_code: 'Background Color',
          action: '',
        },
        sortable: ['curriculum_level_group.name', 'grade', 'interpretation', 'upper_limit', 'lower_limit', 'grade_point'],
        filterable: ['curriculum_level_group.name', 'grade', 'interpretation', 'upper_limit', 'lower_limit', 'grade_point'],

      },
      grades: [],
      load: false,
      editForm: {

      },
      selected_index: '',
    }
  },
  created() {
    this.fetchGrades()
  },
  methods: {
    fetchGrades() {
      const app = this
      app.load = true
      const gradesResources = new Resource('result/grades')
      gradesResources.list().then(response => {
        app.grades = response.grades
        app.load = false
      }).catch(error => {
        app.load = false
        console.log(error)
      })
    },
    deleteGrade(props) {
      const app = this
      // eslint-disable-next-line no-alert
      if (window.confirm('This Delete Action cannot be undone. Click OK to confirm')) {
        app.load = true
        const gradesResources = new Resource('result/grades')
        gradesResources.destroy(props.row.id).then(() => {
          app.grades.splice(props.index - 1, 1)
          app.load = false
        })
      }
    },
    changeColor(props, value) {
      // console.log(props)
      const app = this
      const param = {
        color_code: value.replace('#', ''),
        id: props.row.id,
        option: 'grade',
      }
      const fetchCurriculumSetupResource = new Resource('school-setup/set/color-code')
      fetchCurriculumSetupResource.list(param)
        .then(() => {
          app.grades[props.index - 1].color_code = value
          // console.log(response)
        })
    },
    editGrade(props) {
      this.selected_index = props.index
      this.editForm = props.row
      this.modalShow = true
    },
    updateGrade() {
      const app = this
      app.load_modal = true
      const gradesResources = new Resource('result/grades')
      const param = this.editForm
      gradesResources.update(param.id, param).then(response => {
        app.grades.splice(app.selected_index - 1, 1)
        app.grades[app.selected_index - 1] = response.grade
        app.load_modal = false
        this.modalShow = false
      })
    },
  },
}
</script>
