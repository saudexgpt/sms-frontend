<template>
  <div>
    <div
      v-if="staffId === null"
      class="mb-1"
    >
      <b-button
        variant="gradient-danger"
        class="btn-icon"
      >
        <router-link
          :to="{name: 'manage-staff'}"
          style="color: #fff;"
        >
          Back
        </router-link>
      </b-button>
    </div>
    <template v-if="staff">
      <!-- First Row -->
      <b-row>
        <b-col
          cols="12"
          xl="9"
          lg="8"
          md="7"
        >
          <user-bio :user="staff.user" />
        </b-col>
        <b-col
          cols="12"
          xl="3"
          lg="4"
          md="5"
        >
          <b-card>
            <label>Assigned Class(es)</label>
            <div
              v-for="(class_teacher, index) in staff.class_teachers"
              :key="index"
            >
              <h4>{{ class_teacher.c_class.name }}</h4>
            </div>
          </b-card>
        </b-col>
      </b-row>

      <b-row>
        <b-col
          cols="12"
          lg="12"
        >
          <b-card>
            <legend>Assigned Subjects</legend>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Class</th>
                  <th>Subject Code</th>
                  <th>Subject Name</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(subject_teacher, index) in staff.subject_teachers"
                  :key="index"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ subject_teacher.class_teacher.c_class.name }}</td>
                  <td>{{ subject_teacher.subject.code }}</td>
                  <td>{{ subject_teacher.subject.name }}</td>
                </tr>
              </tbody>
            </table>
          </b-card>
        </b-col>
        <!-- <b-col
          cols="12"
          lg="6"
        >
          <user-view-user-permissions-card />
        </b-col> -->
      </b-row>
    </template>

  </div>
</template>

<script>
import {
  BRow, BCol, BButton, BCard,
} from 'bootstrap-vue'
// import InvoiceList from '@/views/apps/invoice/invoice-list/InvoiceList.vue'
import Resource from '@/api/resource'
// import userStoreModule from '../userStoreModule'
// import UserViewUserInfoCard from './UserViewUserInfoCard.vue'
// import UserViewUserPlanCard from './UserViewUserPlanCard.vue'
// import UserViewUserTimelineCard from './UserViewUserTimelineCard.vue'
// import UserViewUserPermissionsCard from './UserViewUserPermissionsCard.vue'
import UserBio from '@/views/modules/user/UserBioData.vue'
// import UpdateProfile from '../components/UpdateProfile.vue'
// import AcademicInformation from '../components/AcademicInformation.vue'

const staffResource = new Resource('user-setup/staff/show')

export default {
  components: {
    BButton,
    UserBio,
    BRow,
    BCol,
    BCard,

    // Local Components
    // UserViewUserInfoCard,
    // UserViewUserPlanCard,
    // UserViewUserTimelineCard,
    // UserViewUserPermissionsCard,

    // InvoiceList,
  },
  props: {
    staffId: {
      type: Number,
      default: () => (null),
    },
  },
  data() {
    return {
      staff: '',
    }
  },
  created() {
    if (this.staffId) {
      const id = this.staffId
      this.getStaff(id)
    } else {
      const id = this.$route.params && this.$route.params.id
      this.getStaff(id)
    }
  },
  methods: {
    async getStaff(id) {
      const response = await staffResource.get(id)
      this.staff = response.staff
      this.can_edit = response.can_edit
    },

  },
}
</script>

<style>

</style>
