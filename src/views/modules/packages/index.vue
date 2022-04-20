<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Module Packages</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-primary"
              @click="isCreatePackageSidebarActive = true"
            >
              <feather-icon
                icon="FilePlusIcon"
                class="mr-50"
              />
              <span class="align-middle">New Package</span>
            </b-button>
          </span>
        </b-col>
      </b-row>
    </div>
    <!-- table -->
    <h4>Click on the <code>+</code> sign to view package details</h4>
    <v-client-table
      v-model="packages"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="child_row"
        slot-scope="{row}"
      >

        <legend>{{ row.name }} Package Details</legend>
        <aside>
          <el-row :gutter="15">
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
              :lg="12"
            >
              <h3>Schools on Package</h3>
              <table class="table table-bordered">
                <tbody>
                  <tr
                    v-for="school in row.schools"
                    :key="school.id"
                  >
                    <td>{{ school.name }}</td>
                  </tr>
                </tbody>
              </table>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
              :lg="12"
            >
              <h3>Modules</h3>
              <table class="table table-bordered">
                <tbody>
                  <tr
                    v-for="package_module in row.package_modules"
                    :key="package_module.id"
                  >
                    <td>{{ package_module.module.name }}</td>
                    <td><el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click="removeModule(package_module.id)"
                    /></td>
                  </tr>
                </tbody>
              </table>
            </el-col>
          </el-row>
        </aside>

      </div>
      <div
        slot="action"
        slot-scope="props"
      >
        <el-tooltip
          class="item"
          effect="dark"
          content="Add Modules"
          placement="top-start"
        >
          <b-button
            variant="gradient-primary"
            class="btn-icon rounded-circle"
            @click="addModule(props.row)"
          >
            <feather-icon icon="DatabaseIcon" />
          </b-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="Add Schools"
          placement="top-start"
        >
          <b-button
            variant="gradient-success"
            class="btn-icon rounded-circle"
            @click="addSchool(props.row)"
          >
            <feather-icon icon="HomeIcon" />
          </b-button>
        </el-tooltip>
      </div>
    </v-client-table>
    <create-package
      v-if="isCreatePackageSidebarActive"
      v-model="isCreatePackageSidebarActive"
      @save="updateTable"
    />
    <add-package-modules
      v-if="isCreatePackageModuleSidebarActive"
      v-model="isCreatePackageModuleSidebarActive"
      :selected-package="selectedPackage"
      @save="updateTable"
    />
    <add-package-schools
      v-if="isCreateSchoolPackageSidebarActive"
      v-model="isCreateSchoolPackageSidebarActive"
      :selected-package="selectedPackage"
      @save="updateTable"
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
import CreatePackage from './partials/CreatePackage.vue'
import AddPackageModules from './partials/AddPackageModules.vue'
import AddPackageSchools from './partials/AddPackageSchools.vue'

export default {
  components: {
    // VueGoodTable,
    CreatePackage,
    AddPackageModules,
    AddPackageSchools,
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
      isCreatePackageSidebarActive: false,
      isCreatePackageModuleSidebarActive: false,
      isCreateSchoolPackageSidebarActive: false,
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
        'name',
        'description',
        'action',
      ],

      options: {
        headings: {
          name: 'Package Name',
        },
        pagination: {
          dropdown: true,
          chunk: 10,
        },
        perPage: 10,
        filterByColumn: true,
        texts: {
          filter: 'Search:',
        },
        sortable: [
          'name',
        ],
        // filterable: false,
        filterable: [
          'name',
        ],
      },
      packages: [],
      searchTerm: '',
      selectedPackage: '',
      selected_row_index: '',
    }
  },
  created() {
    this.fetchPackages()
  },
  methods: {
    fetchPackages() {
      const app = this
      app.loading = true
      const fetchPackageResource = new Resource('packages')
      fetchPackageResource.list()
        .then(response => {
          app.packages = response.packages
          app.loading = false
        })
    },
    updateTable() {
      const app = this
      app.fetchPackages()
    },
    addModule(selectedRow) {
      // console.log(props)
      const app = this
      // const editableRow = selected_row;
      app.selectedPackage = selectedRow
      app.isCreatePackageModuleSidebarActive = true
    },
    addSchool(selectedRow) {
      // console.log(props)
      const app = this
      // const editableRow = selected_row;
      app.selectedPackage = selectedRow
      app.isCreateSchoolPackageSidebarActive = true
    },
    updateEditedTableRow() {
      const app = this
      app.fetchPackages()
    },
    removeModule(id) {
      const app = this
      // app.packages = []
      const fetchPackageResource = new Resource('packages/remove-module')
      fetchPackageResource.destroy(id)
        .then(response => {
          app.packages = response.packages
          app.loading = false
        })
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
