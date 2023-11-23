<template>
  <div v-loading="loader">
    <div
      v-if="!wardOnly"
      class="mb-1"
    >
      <b-button
        variant="gradient-danger"
        class="btn-icon"
        @click="$router.go(-1)"
      >
        Back
      </b-button>
      <!-- <b-button
        variant="gradient-danger"
        class="btn-icon"
      >
        <router-link
          :to="{name: 'manage-parent'}"
          style="color: #fff;"
        >
          Back
        </router-link>
      </b-button> -->
    </div>
    <template v-if="guardian">
      <!-- First Row -->
      <b-row v-if="!wardOnly">
        <b-col
          cols="12"
          xl="9"
          lg="8"
          md="7"
        >
          <user-bio :user="guardian.user" />
        </b-col>
        <b-col
          cols="12"
          xl="3"
          lg="4"
          md="5"
        >
          <b-card>
            <h3>No. of Wards</h3>
            <legend>{{ guardian.guardian_students.length }}</legend>
          </b-card>
        </b-col>
      </b-row>
      <el-card>

        <div slot="header">
          <h1>Wards</h1>
        </div>
        <b-row>
          <b-col
            v-for="(guardian_student, index) in guardian.guardian_students"
            :key="index"
            lg="4"
            md="6"
          >

            <b-card
              class="card-profile"
            >
              <div class="profile-image-wrapper">
                <div class="profile-image p-0">
                  <b-avatar
                    size="100"
                    variant="light-danger"
                    :src="baseServerUrl + 'storage/'+ guardian_student.student.user.photo"
                    :text="avatarText(guardian_student.student.user.last_name +' ' + guardian_student.student.user.first_name)"
                  />
                </div>
              </div>
              <h3>{{ guardian_student.student.user.last_name +', ' + guardian_student.student.user.first_name }}</h3>
              <h6 class="text-muted">
                {{ (guardian_student.student.my_classes.length > 0) ? guardian_student.student.my_classes[0].class_teacher.c_class.name : '' }}
              </h6>
              <hr class="mb-2">
              <router-link
                :to="{name: 'studentDetails', params: {id: guardian_student.student_id}}"
              >
                <el-button
                  type="primary"
                  round
                  size="small"
                >
                  BioData
                </el-button>
              </router-link>
              <router-link
                :to="{name: 'MyWardResult', params: {student_id: guardian_student.student_id}}"
              >
                <el-button
                  type="success"
                  round
                  size="small"
                >
                  Check Result
                </el-button>
              </router-link>
            </b-card>
          </b-col>
        <!-- <b-col
          cols="12"
          lg="6"
        >
          <user-view-user-permissions-card />
        </b-col> -->
        </b-row>
      </el-card>
    </template>

  </div>
</template>

<script>
import {
  BRow, BCol, BButton, BCard, BAvatar,
} from 'bootstrap-vue'
// eslint-disable-next-line import/no-cycle
import { avatarText } from '@core/utils/filter'
import Resource from '@/api/resource'
import UserBio from '@/views/modules/user/UserBioData.vue'

const guardianResource = new Resource('user-setup/guardian/show')

export default {
  components: {
    BButton,
    UserBio,
    BRow,
    BCol,
    BCard,
    BAvatar,
  },
  props: {
    guardianId: {
      type: Number,
      default: () => (null),
    },
    wardOnly: {
      type: Boolean,
      default: () => (false),
    },
  },
  data() {
    return {
      guardian: '',
      loader: false,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    if (this.guardianId) {
      const id = this.guardianId
      this.getGuardian(id)
    } else {
      const id = this.$route.params && this.$route.params.id
      this.getGuardian(id)
    }
  },
  methods: {
    avatarText,
    getGuardian(id) {
      this.loader = true
      guardianResource.get(id).then(response => {
        this.guardian = response.guardian
        this.can_edit = response.can_edit
        this.loader = false
      })
    },

  },
}
</script>

<style>

</style>
