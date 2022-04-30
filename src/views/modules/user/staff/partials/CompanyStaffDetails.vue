<template>
  <div v-loading="load">
    <template v-if="staff">
      <!-- First Row -->
      <b-row>
        <b-col
          cols="12"
          xl="9"
          lg="8"
          md="7"
        >
          <user-bio
            :user="staff.user"
          />
        </b-col>
      </b-row>

      <b-row>
        <b-col
          cols="12"
          lg="12"
        >
          <b-card>
            <legend>Approved Schools</legend>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>School Name</th>
                  <th>Package</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(partner_school, index) in staff.user.partner_schools"
                  :key="index"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ partner_school.school.name }}</td>
                  <td>{{ partner_school.school.package.name }}</td>
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
  BRow, BCol, BCard,
} from 'bootstrap-vue'
// import InvoiceList from '@/views/apps/invoice/invoice-list/InvoiceList.vue'
// import Resource from '@/api/resource'
import UserBio from '@/views/modules/user/UserBioData.vue'
// const staffResource = new Resource('user-setup/staff/show')

export default {
  components: {
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
    staff: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      load: false,
    }
  },
}
</script>

<style></style>
