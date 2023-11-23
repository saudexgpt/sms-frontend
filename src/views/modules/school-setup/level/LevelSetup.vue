<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Manage Level</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              size="sm"
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
      v-model="levels"
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
        <b-button
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="confirmDelete(props.row)"
        >
          <feather-icon icon="TrashIcon" />
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
      @update="updateTable"
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
import CreateCurriculumLevel from './partials/CreateLevel.vue'
import EditCurriculumLevel from './partials/EditLevel.vue'

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
      isCreateLevelSidebarActive: false,
      isEditLevelSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'action',
        'level',
        'description',
        'level_group.name',
        'level_group.curriculum',
      ],

      options: {
        headings: {
          'level_group.name': 'Level Group',
          'level_group.curriculum': 'Curriculum',
          action: '',

          // id: 'S/N',
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        // filterByColumn: true,
        sortable: [
          'level',
          'level_group.name',
          'description',
        ],
        // filterable: false,
        filterable: [
          'level',
          'level_group.name',
          'description',
        ],
      },
      levels: [],
      loading: false,
      editable_row: '',
      selected_row_index: '',
    }
  },
  created() {
    this.fetchLevels()
  },
  methods: {
    fetchLevels() {
      const app = this
      app.loading = true
      const fetchCurriculumSetupResource = new Resource('school-setup/levels')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.levels = response.levels
          app.loading = false
        })
    },
    updateTable(levels) {
      const app = this
      app.levels = levels
    },
    editThisRow(value) {
      // console.log(props)
      const app = this
      app.editable_row = value
      app.isEditLevelSidebarActive = true
    },
    confirmDelete(level) {
      const app = this
      const message = `You are about to delete ${level.level}. It might affect any student in that level. Click Yes to confirm.`
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
            app.deleteLevel(level)
          }
        })
    },
    deleteLevel(level) {
      const app = this
      const deleteCurriculumSetupResource = new Resource('school-setup/level/destroy')
      deleteCurriculumSetupResource.destroy(level.id)
        .then(response => {
          app.updateTable(response.levels)
        })
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
