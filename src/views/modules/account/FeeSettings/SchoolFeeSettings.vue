<template>
  <div>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Manage School Fees</h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span
            v-if="checkPermission(['can create fees settings'])"
            class="demo-inline-spacing pull-right"
          >
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-danger"
              size="sm"
              :disabled="school_fees.length < 1"
              @click="showApplyFeeModal = true"
            >
              <feather-icon
                icon="CheckIcon"
                class="mr-50"
              />
              <span class="align-middle">Apply Fees</span>
            </b-button>
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
    <b-row>
      <b-col
        cols="4"
      >
        <el-select
          v-model="form.term_id"
          style="width: 100%;"
          placeholder="Select Term"
          filterable
          @input="fetchSchoolFeeSettings()"
        >
          <el-option
            v-for="(term, index) in terms"
            :key="index"
            :label="term.name"
            :value="term.id"
          />
        </el-select>
      </b-col>
      <b-col
        cols="8"
      >
        <el-alert type="error">
          After creating school fees, you need to apply the fees so that parents can view and make payments
        </el-alert>
      </b-col>
    </b-row>
    <v-client-table
      v-model="school_fees"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="amount"
        slot-scope="{row}"
      >
        {{ currency + row.amount.toLocaleString() }}
      </div>
      <div
        slot="vat"
        slot-scope="{row}"
      >
        {{ currency + row.vat.toLocaleString() }}
      </div>
      <div
        slot="total"
        slot-scope="{row}"
      >
        {{ currency + (parseFloat(row.amount + row.vat)).toLocaleString() }}
      </div>
      <div
        slot="is_active"
        slot-scope="props"
      >
        <el-tooltip
          :content="(props.row.is_active === 0) ? 'Activate' : 'Deactivate'"
          placement="top"
        >
          <el-switch
            v-model="props.row.is_active"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            active-text="Active"
            inactive-text="Inactive"
            @change="changeStatus(props.index, props.row.id, $event)"
          />
        </el-tooltip>
      </div>
      <div
        slot="action"
        slot-scope="props"
      >
        <!-- <el-tooltip
          content="Apply fees to students in this level"
          placement="top"
        >
          <b-button
            variant="gradient-success"
            class="btn-icon rounded-circle"
            @click="confirmFeeApplication(props.row)"
          >
            <feather-icon icon="CheckIcon" />
          </b-button>
        </el-tooltip> -->
        <el-tooltip
          content="Edit Fees"
          placement="bottom"
        >
          <b-button
            v-if="checkPermission(['can update fees settings'])"
            variant="gradient-warning"
            class="btn-icon rounded-circle"
            @click="editThisRow(props.row)"
          >
            <feather-icon icon="EditIcon" />
          </b-button>
        </el-tooltip>
      </div>
    </v-client-table>
    <b-modal
      v-model="showApplyFeeModal"
      title="Apply School Fees to Students"
      hide-footer
    >
      <h5>Pick students' levels you wish to apply their school fees</h5>
      <code>Multiple selection enabled</code><br>
      <b-form-group>
        <el-select
          v-model="form.level_ids"
          style="width: 100%;"
          placeholder="Select Level"
          filterable
          multiple
          collapse-tags
        >
          <el-option
            v-for="(level, index) in levels"
            :key="index"
            :label="level.level"
            :value="level.id"
          />
        </el-select>
      </b-form-group>
      <b-form-group>
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          type="submit"
          variant="primary"
          class="mr-1"
          @click="applyFeeToStudent()"
        >
          Submit
        </b-button>
      </b-form-group>
    </b-modal>
    <create-school-fee-settings
      v-if="isCreateClassSidebarActive"
      v-model="isCreateClassSidebarActive"
      :levels="levels"
      :fee-purposes="fee_purposes"
      :currency="currency"
      @save="updateTable"
    />
    <edit-school-fee-settings
      v-if="isEditClassSidebarActive"
      v-model="isEditClassSidebarActive"
      :fee-purposes="fee_purposes"
      :selected-fee-settings="editable_row"
      :currency="currency"
      @update="updateTable"
    />
  </div>
</template>

<script>
import {
  BButton, BRow, BCol, BModal, BFormGroup,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import checkPermission from '@/utils/permission'
// import { VueGoodTable } from 'vue-good-table'
import Resource from '@/api/resource'
import CreateSchoolFeeSettings from './partials/CreateSchoolFeeSettings.vue'
import EditSchoolFeeSettings from './partials/EditSchoolFeeSettings.vue'

export default {
  components: {
    // VueGoodTable,
    // vSelect,
    CreateSchoolFeeSettings,
    EditSchoolFeeSettings,
    BButton,
    BModal,
    BRow,
    BCol,
    BFormGroup,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      isCreateClassSidebarActive: false,
      isEditClassSidebarActive: false,
      showApplyFeeModal: false,
      pageLength: 10,
      dir: false,
      columns: [
        'action',
        'level.level',
        'term.name',
        'purpose',
        'amount',
        'vat',
        'total',
        'is_active',
      ],

      options: {
        headings: {
          'level.level': 'Level',
          'term.name': 'Term',
          vat: 'VAT',
          is_active: 'Status',
          action: '',

          // id: 'S/N',
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        filterByColumn: true,
        sortable: [
          'level.level',
          // 'term.name',
        ],
        // filterable: false,
        filterable: [
          'level.level',
          'purpose',
        ],
      },
      school_fees: [],
      levels: [],
      fee_purposes: [],
      loading: false,
      editable_row: '',
      selected_row_index: '',
      currency: '',

      form: {
        level_ids: [],
        term_id: '',
      },
      terms: [
        { id: 1, name: 'First Term' },
        { id: 2, name: 'Second Term' },
        { id: 3, name: 'Third Term' },
      ],
    }
  },
  created() {
    this.fetchLevels()
    this.fetchFeePurposes()
  },
  methods: {
    checkPermission,
    fetchSchoolFeeSettings() {
      const app = this
      app.loading = true
      const param = app.form
      const fetchSchoolFeesSettingsResource = new Resource('account/fee-settings/school-fee')
      fetchSchoolFeesSettingsResource.list(param)
        .then(response => {
          app.school_fees = response.school_fees
          app.currency = response.currency
          app.loading = false
        })
    },
    fetchFeePurposes() {
      const app = this
      const fetchResource = new Resource('account/fee-settings/fee-purposes')
      fetchResource.list()
        .then(response => {
          app.fee_purposes = response.fee_purposes
          app.currency = response.currency
        })
    },
    fetchLevels() {
      const app = this
      const fetchLevelsResource = new Resource('school-setup/levels')
      fetchLevelsResource.list()
        .then(response => {
          app.levels = response.levels
        })
    },
    updateTable() {
      const app = this
      app.fetchSchoolFeeSettings()
    },
    editThisRow(value) {
      // console.log(props)
      const app = this
      app.editable_row = value
      app.isEditClassSidebarActive = true
    },
    changeStatus(index, id, status) {
      const param = { is_active: status }
      const saveSchoolFeeResource = new Resource('account/fee-settings/change-status')
      this.school_fees[index - 1].is_active = status
      saveSchoolFeeResource.update(id, param)
        .then(() => {
        }).catch(() => {
          this.$message('An error occured')
        })
    },
    applyFeeToStudent() {
      const app = this
      const param = app.form
      app.loading = true
      const applyFeeToStudentsResource = new Resource('account/fee-settings/apply/students-school-fee')
      applyFeeToStudentsResource.store(param)
        .then(() => {
          app.$alert('School Fees applied to students successfully')
          app.loading = false
          app.showApplyFeeModal = false
          app.form.level_ids = []
        }).catch(() => {
          this.$message('An error occured')
          app.loading = false
        })
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
