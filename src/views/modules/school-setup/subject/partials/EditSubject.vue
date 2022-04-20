<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-subject="sidebar-lg"
      :visible="isEditSubjectSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-edit-subject-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Edit Subject
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
                label="Subject Title"
              >
                <b-form-input
                  v-model="form.name"
                  placeholder="Subject Title"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Subject Code"
              >
                <b-form-input
                  v-model="form.code"
                  placeholder="Subject Code"
                />
              </b-form-group>
            </b-col>
            <!-- submit and reset -->
            <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="warning"
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
  BSidebar, BRow, BCol, BFormGroup, BButton, BFormInput,
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
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isEditSubjectSidebarActive',
    event: 'update:is-edit-subject-sidebar-active',
  },
  props: {
    isEditSubjectSidebarActive: {
      type: Boolean,
      required: true,
    },
    selectedSubject: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        name: '',
        code: '',
      },
      load: false,
    }
  },
  created() {
    this.form = this.selectedSubject
    // this.fetchCurriculumSubjects()
  },
  methods: {
    update() {
      const app = this
      const editSubjectsResource = new Resource('school-setup/subjects')
      const param = app.form
      app.load = true
      editSubjectsResource.update(param.id, param)
        .then(response => {
          app.load = false
          app.$emit('update', response)
          app.$emit('update:is-edit-subject-sidebar-active', false)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
