<template>
  <el-card v-if="student.user">
    <el-form-item label="Name">
      <el-input
        v-model="student.name"
        :disabled="student.user.role === 'admin'"
      />
    </el-form-item>
    <el-form-item label="Email">
      <el-input
        v-model="student.user.email"
        :disabled="student.user.role === 'admin'"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        :disabled="student.user.role === 'admin'"
        @click="onSubmit"
      >
        Update
      </el-button>
    </el-form-item>
  </el-card>
</template>

<script>

import Resource from '@/api/resource'

const userResource = new Resource('users')

export default {

  props: {
    student: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {

    }
  },
  methods: {

    onSubmit() {
      userResource
        .update(this.user.id, this.user)
        .then(() => {
          this.$message({
            message: 'User information has been updated successfully',
            type: 'success',
            duration: 5 * 1000,
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
