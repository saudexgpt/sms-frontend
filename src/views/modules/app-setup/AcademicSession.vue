<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Manage Term & Session</h4>
        </b-col>
        <!-- <b-col
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
        </b-col> -->
      </b-row>
    </div>
    <el-row :gutter="10">
      <el-col
        :md="24"
        :sm="24"
        :xs="24"
      >
        <v-client-table
          v-model="terms"
          v-loading="loading"
          :columns="columns"
          :options="options"
        >
          <div
            slot="is_active"
            slot-scope="{row}"
          >
            {{ (row.is_active === '1') ? 'Active' : 'Inactive' }}
          </div>
          <div
            slot="action"
            slot-scope="{row}"
          >

            <!-- <b-form-checkbox
              v-model="selected"
              :checked="(row.is_active === '1') ? true : false"
              class="custom-control-secondary"
              name="check-button"
              switch
            /> -->
            <el-switch
              v-model="row.is_active"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              :disabled="row.is_active == '1'"
              @change="toggleTermActivation(row.id, $event)"
            />
          </div>
        </v-client-table>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col
        :md="6"
        :sm="8"
        :xs="24"
      >
        <strong>Create New Session</strong>
        <el-input
          v-model="session_name"
          type="text"
          placeholder="Session Name. E.g 2021/2022"
        />
        <hr>
        <b-button
          variant="gradient-primary"
          class="btn-icon"
          @click="createSession()"
        >
          <feather-icon icon="SaveIcon" /> Save
        </b-button>
      </el-col>
      <el-col
        :md="18"
        :sm="16"
        :xs="24"
      >
        <v-client-table
          v-model="sessions"
          v-loading="loading"
          :columns="columns"
          :options="options"
        >
          <div
            slot="is_active"
            slot-scope="{row}"
          >
            {{ (row.is_active === '1') ? 'Active' : 'Inactive' }}
          </div>
          <div
            slot="action"
            slot-scope="{row}"
          >

            <!-- <b-form-checkbox
              v-model="selected"
              :checked="(row.is_active === '1') ? true : false"
              class="custom-control-secondary"
              name="check-button"
              switch
            /> -->
            <el-switch
              v-model="row.is_active"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              @change="toggleSessionActivation(row.id, $event)"
            />
          </div>
        </v-client-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import {
  BButton, BRow, BCol,
} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    BButton,
    // BFormCheckbox,
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
        'name',
        'is_active',
        'action',
      ],

      options: {
        headings: {
          is_active: 'Status',
          action: 'Activate/Deactivate',
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        perPage: 10,
        filterByColumn: false,
        texts: {
          filter: 'Search:',
        },
        sortable: [
          'name',
          'is_active',
        ],
        // filterable: false,
        filterable: [
          'name',
          'is_active',
        ],
      },
      sessions: [],
      terms: [],
      session_name: '',
      editable_row: '',
      selected_row_index: '',
    }
  },
  created() {
    this.fetchSessions()
    this.fetchTerms()
  },
  methods: {
    fetchSessions() {
      const app = this
      app.loading = true
      const fetchSessionResource = new Resource('school-setup/session/index')
      fetchSessionResource.list()
        .then(response => {
          app.sessions = response.sessions
          app.loading = false
        })
    },
    fetchTerms() {
      const app = this
      const fetchTermResource = new Resource('school-setup/term/index')
      fetchTermResource.list()
        .then(response => {
          app.terms = response.terms
        })
    },
    createSession() {
      const app = this
      app.loading = true
      const param = { name: app.session_name }
      const fetchSessionResource = new Resource('school-setup/session/store')
      fetchSessionResource.store(param)
        .then(response => {
          app.session_name = ''
          app.sessions = response.sessions
          app.loading = false
        })
    },
    toggleSessionActivation(id, event) {
      const app = this
      const param = { status: event }
      const activateSessionResource = new Resource('school-setup/toggle-session-activation')
      activateSessionResource.update(id, param)
        .then(response => {
          app.sessions = response.sessions
        })
    },
    toggleTermActivation(id, event) {
      const app = this
      const param = { status: event }
      const activateTermResource = new Resource('school-setup/toggle-term-activation')
      activateTermResource.update(id, param)
        .then(response => {
          app.terms = response.terms
        })
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
