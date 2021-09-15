<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Manage Section</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              size="sm"
              @click="isCreateSectionSidebarActive = true"
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
      v-model="sections"
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
        <!-- <b-button
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="confirmDelete(props.row)"
        >
          <feather-icon icon="TrashIcon" />
        </b-button> -->
      </div>
    </v-client-table>
    <create-section
      v-if="isCreateSectionSidebarActive"
      v-model="isCreateSectionSidebarActive"
      @save="updateTable"
    />
    <edit-section
      v-if="isEditSectionSidebarActive"
      v-model="isEditSectionSidebarActive"
      :selected-section="editable_row"
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
import CreateSection from './partials/CreateSection.vue'
import EditSection from './partials/EditSection.vue'

export default {
  components: {
    // VueGoodTable,
    // vSelect,
    CreateSection,
    EditSection,
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
      isCreateSectionSidebarActive: false,
      isEditSectionSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'action',
        'name',
      ],

      options: {
        headings: {
          action: '',

          // id: 'S/N',
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        // filterByColumn: true,
        sortable: [
          'name',
        ],
        // filterable: false,
        filterable: [
          'name',
        ],
      },
      sections: [],
      staff: [],
      loading: false,
      editable_row: '',
      selected_row_index: '',
      selected_teacher: '',
    }
  },
  created() {
    this.fetchSectiones()
  },
  methods: {
    fetchSectiones() {
      const app = this
      app.loading = true
      const fetchCurriculumSetupResource = new Resource('school-setup/sections')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.sections = response.sections
          app.loading = false
        })
    },
    updateTable(sections) {
      const app = this
      app.sections = sections
    },
    editThisRow(value) {
      // console.log(props)
      const app = this
      app.editable_row = value
      app.isEditSectionSidebarActive = true
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
