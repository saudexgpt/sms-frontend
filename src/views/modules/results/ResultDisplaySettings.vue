<template>
  <el-card>
    <div slot="header">
      <b-row v-loading="load">
        <b-col
          cols="6"
        >
          <h4>
            Result Display Settings
          </h4>
        </b-col>
        <b-col
          cols="6"
        >
          <span class="pull-right">
            <label for="">Level Group</label>
            <el-select
              v-model="curriculum_level_group_id"
              placeholder="Select Level Group"
              class="span"
              filterable
              style="width: 100%"
              @input="fetchResultSettings()"
            >
              <el-option
                v-for="(curriculum_level_group, index) in curriculum_level_groups"
                :key="index"
                :value="curriculum_level_group.id"
                :label="curriculum_level_group.name"
              />

            </el-select>
          </span>
        </b-col>
      </b-row>
    </div>
    <div v-if="result_setting !== ''">
      <result-settings-details
        :result-setting="result_setting"
      />
    </div>
    <!-- <div v-else>
      <b-alert
        variant="danger"
        show
      >
        <div class="alert-body">
          <span><strong>Kindly S</strong></span>
        </div>
      </b-alert>
    </div> -->
  </el-card>
</template>
<script>
import {
  BRow, BCol,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import ResultSettingsDetails from './partials/ResultSettingsDetails.vue'

export default {
  components: {
    BRow, BCol, ResultSettingsDetails,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      modalShow: true,
      curriculum_level_groups: [],
      curriculum_level_group_id: '',
      result_setting: '',
      load: false,
      display_label: '',
    }
  },

  created() {
    this.fetchCurriculumLevelGroups()
  },
  methods: {
    fetchCurriculumLevelGroups() {
      const app = this

      const selectionOptions = new Resource('school-setup/fetch-specific-curriculum-level-groups')
      selectionOptions.list()
        .then(response => {
          app.curriculum_level_groups = response.curriculum_level_groups
        })
        .catch(error => {
          console.log(error)
        })
    },

    fetchResultSettings() {
      const app = this
      const fetchSettings = new Resource('result/fetch-result-display-settings')
      const param = { curriculum_level_group_id: app.curriculum_level_group_id }
      app.load = true
      app.result_setting = ''
      fetchSettings.list(param)
        .then(response => {
          app.result_setting = response.result_setting
          app.load = false
        })
        .catch(error => {
          app.load = false
          console.log(error)
        })
    },

  },
}
</script>
<style scoped>
.span {
  width: 100%;
}
</style>
