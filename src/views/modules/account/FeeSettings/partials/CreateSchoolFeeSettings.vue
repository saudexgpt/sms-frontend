<template>
  <div v-loading="load">
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateClassSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-class-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Create School Fees
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
              <strong>All fields are required</strong>
            </b-col>

            <!-- first name -->
            <b-col cols="12">
              <b-form-group
                label="Select Level"
                label-for="v-level"
              >
                <code>You can select multiple Levels</code><br>
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
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Select Term"
              >
                <el-select
                  v-model="form.term_id"
                  style="width: 100%;"
                  placeholder="Select Term"
                >
                  <el-option
                    v-for="(term, index) in terms"
                    :key="index"
                    :label="term.name"
                    :value="term.id"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Enter Fee"
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
            <b-col cols="12">
              <b-form-group
                label="Fee Purpose"
              >
                <el-select
                  v-model="selected_purpose"
                  style="width: 100%;"
                  placeholder="Set Fee Purpose"
                  @input="setPurpose($event)"
                >
                  <el-option
                    v-for="(purpose, index) in feePurposes"
                    :key="index"
                    :label="purpose.name"
                    :value="purpose.name"
                  />
                  <el-option
                    label="Others"
                    value="Others"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col
              v-if="selected_purpose === 'Others'"
              cols="12"
            >
              <b-form-group
                label="Specify Purpose"
              >
                <el-input
                  v-model="form.purpose"
                  placeholder="Purpose"
                />
              </b-form-group>
            </b-col>
            <!-- submit and reset -->
            <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submit()"
              >
                Submit
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
    prop: 'isCreateClassSidebarActive',
    event: 'update:is-create-class-sidebar-active',
  },
  props: {
    isCreateClassSidebarActive: {
      type: Boolean,
      required: true,
    },
    levels: {
      type: Array,
      required: true,
    },
    feePurposes: {
      type: Array,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      form: {
        level_ids: [],
        term_id: '',
        amount: '',
        purpose: '',
        vat: 0,
      },
      terms: [
        { id: 1, name: 'First Term' },
        { id: 2, name: 'Second Term' },
        { id: 3, name: 'Third Term' },
      ],
      selected_purpose: '',
      vat_percentage: 7.5,
      load: false,
    }
  },
  created() {
    // this.fetchCurriculumClasss()
  },
  methods: {
    setVat() {
      const app = this
      app.form.vat = (app.vat_percentage * app.form.amount) / 100
    },
    setPurpose(purpose) {
      this.form.purpose = ''
      if (purpose !== 'Others') {
        this.form.purpose = purpose
      }
    },
    aFieldIsEmpty() {
      const app = this
      return app.form.level_ids.length < 1 || app.form.term_id === '' || app.form.amount === '' || app.form.purpose === ''
    },
    submit() {
      const app = this
      if (app.aFieldIsEmpty()) {
        app.$alert('Kindly fill all empty fields')
        return
      }
      const saveSchoolFeeResource = new Resource('account/fee-settings/store/school-fee')
      const param = app.form
      app.load = true
      saveSchoolFeeResource.store(param)
        .then(() => {
          app.$emit('save')
          app.$emit('update:is-create-class-sidebar-active', false)
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
