<template>
  <b-row>
    <b-col cols="12">
      <b-row>
        <b-col cols="6">
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="gradient-primary"
            pill
            @click="isCreateLevelSidebarActive = true"
          >
            <feather-icon
              icon="FilePlusIcon"
              class="mr-50"
            />
            <span class="align-middle">Create</span>
          </b-button>
        </b-col>
        <b-col cols="6">
          <!-- search input -->
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
        </b-col>
      </b-row>
      <!-- table -->
      <vue-good-table
        :columns="columns"
        :rows="curriculumLevels"
        :search-options="{
          enabled: true,
          externalQuery: searchTerm }"
        :pagination-options="{
          enabled: true,
          perPage:pageLength
        }"
      >
        <template
          slot="table-row"
          slot-scope="props"
        >

          <!-- Column: Action -->
          <span v-if="props.column.field === 'curriculum_setup'">
            {{ props.row.curriculum_setup.name }}
          </span>
          <!-- Column: Action -->
          <span v-else-if="props.column.field === 'action'">
            <b-button
              variant="gradient-warning"
              class="btn-icon rounded-circle"
              @click="editThisRow(props)"
            >
              <feather-icon icon="EditIcon" />
            </b-button>
          </span>
        </template>

        <!-- pagination -->
        <template
          slot="pagination-bottom"
          slot-scope="props"
        >
          <div class="d-flex justify-content-between flex-wrap">
            <div class="d-flex align-items-center mb-0 mt-1">
              <span class="text-nowrap ">
                Showing 1 to
              </span>
              <b-form-select
                v-model="pageLength"
                :options="['10', '25', '50', '100']"
                class="mx-1"
                @input="(value)=>props.perPageChanged({currentPerPage:value})"
              />
              <span class="text-nowrap"> of {{ props.total }} entries </span>
            </div>
            <div>
              <b-pagination
                :value="1"
                :total-rows="props.total"
                :per-page="pageLength"
                first-number
                last-number
                align="right"
                prev-class="prev-item"
                next-class="next-item"
                class="mt-1 mb-0"
                @input="(value)=>props.pageChanged({currentPage:value})"
              >
                <template #prev-text>
                  <feather-icon
                    icon="ChevronLeftIcon"
                    size="18"
                  />
                </template>
                <template #next-text>
                  <feather-icon
                    icon="ChevronRightIcon"
                    size="18"
                  />
                </template>
              </b-pagination>
            </div>
          </div>
        </template>
      </vue-good-table>
    </b-col>
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
  </b-row>
</template>

<script>
import {
  BButton, BPagination, BFormGroup, BFormInput, BFormSelect, BRow, BCol,
} from 'bootstrap-vue'
import { VueGoodTable } from 'vue-good-table'
import Resource from '@/api/resource'
import Ripple from 'vue-ripple-directive'
import CreateCurriculumLevel from './CreateCurriculumLevel.vue'
import EditCurriculumLevel from './EditCurriculumLevel.vue'

export default {
  components: {
    VueGoodTable,
    CreateCurriculumLevel,
    EditCurriculumLevel,
    BButton,
    BPagination,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      isCreateLevelSidebarActive: false,
      isEditLevelSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        {
          label: '#',
          field: 'id',
        },
        {
          label: 'Name',
          field: 'level_name',
        },
        {
          label: 'Abbrev',
          field: 'abbrev',
        },
        {
          label: 'Group',
          field: 'level_group',
        },
        {
          label: 'Curriculum',
          field: 'curriculum_setup',
        },
        {
          label: 'Action',
          field: 'action',
        },
      ],
      curriculumLevels: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
    }
  },
  created() {
    this.fetchCurriculumLevels()
  },
  methods: {
    fetchCurriculumLevels() {
      const app = this
      const fetchCurriculumSetupResource = new Resource('curriculum/level/all')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.curriculumLevels = response.curriculum_levels
        })
    },
    updateTable(curriculum) {
      const app = this
      app.curriculumLevels.unshift(curriculum)
    },
    editThisRow(props) {
      // console.log(props)
      const app = this
      const editableRow = props.formattedRow
      app.selected_row_index = props
      app.editable_row = editableRow
      app.isEditLevelSidebarActive = true
    },
    updateEditedTableRow() {
      const app = this
      app.fetchCurriculumLevels()
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
