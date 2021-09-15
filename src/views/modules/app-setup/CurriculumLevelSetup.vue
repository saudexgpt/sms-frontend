<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Curriculum Level</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              @click="isCreateLevelSidebarActive = true"
            >
              <feather-icon
                icon="FilePlusIcon"
                class="mr-50"
              />
              <span class="align-middle">Create</span>
            </b-button>
          </span>
        </b-col>
      </b-row>
    </div>
    <!-- table -->

    <v-client-table
      v-model="curriculumLevels"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
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
      </div>
    </v-client-table>
    <create-curriculum-level
      v-if="isCreateLevelSidebarActive"
      v-model="isCreateLevelSidebarActive"
      @save="updateTable"
    />
    <edit-curriculum-level
      v-if="isEditLevelSidebarActive"
      v-model="isEditLevelSidebarActive"
      :selected-curriculum-level="editable_row"
      @update="updateEditedTableRow"
    />
  </el-card>
</template>

<script>
import {
  BButton, BRow, BCol,
} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import CreateCurriculumLevel from './partials/CreateCurriculumLevel.vue'
import EditCurriculumLevel from './partials/EditCurriculumLevel.vue'

export default {
  components: {
    // VueGoodTable,
    CreateCurriculumLevel,
    EditCurriculumLevel,
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
      loading: false,
      isCreateLevelSidebarActive: false,
      isEditLevelSidebarActive: false,
      pageLength: 10,
      dir: false,
      // columns: [
      //   {
      //     label: '#',
      //     field: 'id',
      //   },
      //   {
      //     label: 'Name',
      //     field: 'name',
      //   },
      //   {
      //     label: 'Curriculum',
      //     field: 'curriculum_category',
      //   },
      //   {
      //     label: 'Action',
      //     field: 'action',
      //   },
      // ],
      columns: [
        'level_name',
        'abbrev',
        'curriculum_level_group.name',
        'curriculum_category.name',
        'action',
      ],

      options: {
        headings: {
          abbrev: 'Abbreviation',
          'curriculum_level_group.name': 'Level Group',
          'curriculum_category.name': 'Curriculum',

          // id: 'S/N',
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        perPage: 10,
        filterByColumn: true,
        texts: {
          filter: 'Search:',
        },
        sortable: [
          'level_name',
          'abbrev',
          'curriculum_level_group.name',
          'curriculum_category.name',
        ],
        // filterable: false,
        filterable: [
          'level_name',
          'abbrev',
          'curriculum_level_group.name',
          'curriculum_category.name',
        ],
      },
      curriculumLevels: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
    }
  },
  created() {
    this.fetchcurriculumLevels()
  },
  methods: {
    fetchcurriculumLevels() {
      const app = this
      app.loading = true
      const fetchCurriculumSetupResource = new Resource('curriculum/level/all')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.curriculumLevels = response.curriculum_levels
          app.loading = false
        })
    },
    updateTable(curriculum) {
      const app = this
      app.curriculumLevels.unshift(curriculum)
    },
    editThisRow(selectedRow) {
      // console.log(props)
      const app = this
      // const editableRow = selected_row;
      app.editable_row = selectedRow
      app.isEditLevelSidebarActive = true
    },
    updateEditedTableRow() {
      const app = this
      app.fetchcurriculumLevels()
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
