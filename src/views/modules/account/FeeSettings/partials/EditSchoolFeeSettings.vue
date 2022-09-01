<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isEditClassSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-edit-class-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Edit {{ selectedFeeSettings.term.name }} Term Fees for {{ selectedFeeSettings.level.level }}
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
        <div class="justify-content-between align-items-center px-2 py-1">
          <b-row v-loading="load">
            <b-col cols="12">
              <b-form-group
                label="Edit Amount"
              >
                <el-input
                  v-model="form.amount"
                  placeholder="Enter Amount"
                  @input="setVat()"
                >
                  <template #prepend>
                    {{ currency }}
                  </template>
                </el-input>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="VAT (in percentage)"
              >
                <el-input
                  v-model="vat_percentage"
                  placeholder="Enter VAT percentage"
                  @input="setVat()"
                >
                  <template #append>
                    <strong>VAT Value: {{ currency + form.vat }}</strong>
                  </template>
                </el-input>
              </b-form-group>
            </b-col>
            <!-- submit and reset -->
            <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="update()"
              >
                Update
              </b-button>
            </b-col>
          </b-row>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
// import vSelect from 'vue-select'
import {
  BSidebar, BRow, BCol, BFormGroup, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    // vSelect,
    BSidebar,
    BRow,
    BCol,
    BFormGroup,
    BButton,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isEditClassSidebarActive',
    event: 'update:is-edit-class-sidebar-active',
  },
  props: {
    isEditClassSidebarActive: {
      type: Boolean,
      required: true,
    },
    selectedFeeSettings: {
      type: Object,
      default: () => (null),
    },
    currency: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      form: {
        id: '',
        amount: '',
        vat: 0,
      },
      load: false,
      vat_percentage: 0,
    }
  },
  created() {
    this.form.amount = this.selectedFeeSettings.amount
    this.form.vat = this.selectedFeeSettings.vat
    this.form.id = this.selectedFeeSettings.id
    this.getVatPecentage()
  },
  methods: {
    getVatPecentage() {
      this.vat_percentage = (this.form.vat * 100) / this.form.amount
    },
    setVat() {
      const app = this
      app.form.vat = (app.vat_percentage * app.form.amount) / 100
    },
    update() {
      const app = this
      const updateClassResource = new Resource('account/fee-settings/update/school-fee')
      const param = app.form
      app.load = true
      updateClassResource.update(param.id, param)
        .then(() => {
          app.$emit('update')
          app.$emit('update:is-edit-class-sidebar-active', false)
          app.load = false
        }).catch(() => {
          app.load = false
          app.$message('An error occured')
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
