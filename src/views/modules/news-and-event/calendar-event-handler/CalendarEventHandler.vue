<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isEventHandlerSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-event-handler-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Create Event
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
          <b-row>

            <!-- first name -->
            <b-col cols="12">
              <b-form-group
                label="Title"
                label-for="event-title"
              >
                <b-form-input
                  id="event-title"
                  v-model="form.title"
                  autofocus
                  trim
                  placeholder="Event Title"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Start"
                label-for="start-date"
              >
                <el-date-picker
                  v-model="form.start"
                  type="date"
                  placeholder="Pick a day"
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="End"
                label-for="end-date"
              >
                <el-date-picker
                  v-model="form.end"
                  type="date"
                  placeholder="Pick a day"
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Description"
                label-for="event-description"
              >
                <b-form-textarea
                  id="event-description"
                  v-model="form.description"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Targeted Audience"
              >
                <!-- <v-select
                  v-model="selectedCurriculumClasss"
                  :options="curriculumClasss"
                  label="class_name"
                  value="id"
                /> -->
                <el-select
                  v-model="form.targeted_audience"
                  multiple
                  collapse-tags
                  style="width: 100%;"
                  placeholder="Select Audience"
                  filterable
                >
                  <el-option
                    label="Parent"
                    value="parent"
                  />
                  <el-option
                    label="Staff"
                    value="staff"
                  />
                  <el-option
                    label="Student"
                    value="Student"
                  />
                </el-select>
                <br>
                <code>You can select multiple audience</code>
              </b-form-group>
            </b-col>
            <!-- submit and reset -->
            <b-col cols="12">
              <b-button
                v-if="form.id"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="update()"
              >
                Update
              </b-button>
              <b-button
                v-else
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submit()"
              >
                Add
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
  BSidebar, BRow, BCol, BFormGroup, BButton, BFormInput, BFormTextarea,
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
    BFormInput,
    BFormTextarea,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isEventHandlerSidebarActive',
    event: 'update:is-event-handler-sidebar-active',
  },
  props: {
    isEventHandlerSidebarActive: {
      type: Boolean,
      required: true,
    },
    eventData: {
      type: Object,
      required: true,
      dafault: () => (null),
    },
  },
  data() {
    return {
      form: {
        title: '',
        description: '',
        start: '',
        end: '',
        targeted_audience: [],
      },
    }
  },
  created() {
    if (this.eventData !== null) {
      this.form = this.eventData
    }
    // this.fetchCurriculumClasss()
  },
  methods: {
    // fetchCurriculumClasss() {
    //   const app = this
    //   const fetchCurriculumSetupResource = new Resource('school-setup/fetch-specific-curriculum-class-groups')
    //   fetchCurriculumSetupResource.list()
    //     .then(response => {
    //       app.curriculum_class_groups = response.curriculum_class_groups
    //     })
    // },
    // setClassNames() {
    //   const app = this
    //   app.form.classs = app.selectedCurriculumClasss
    // },
    // setCurriculumClass() {
    //   const app = this
    //   app.curriculumClasss = app.selected_curriculum_group.curriculum_classs
    //   app.form.curriculum_class_group_id = app.selected_curriculum_group.id
    //   app.form.classs = []
    // },
    submit() {
      const app = this
      const saveResource = new Resource('events/add-event')
      const param = app.form
      saveResource.store(param)
        .then(response => {
          // console.log(response)
          app.$emit('saved', response.events)
          // app.$emit('update:is-event-handler-sidebar-active', false)
        })
    },
    update() {
      const app = this
      const updateResource = new Resource('events/update')
      const param = app.form
      updateResource.update(param.id, param)
        .then(response => {
          // console.log(response)
          app.$emit('updated', response.events)
          // app.$emit('update:is-event-handler-sidebar-active', false)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
