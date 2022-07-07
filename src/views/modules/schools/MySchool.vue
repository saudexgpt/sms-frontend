<template>
  <el-tabs type="border-card">
    <el-tab-pane label="Approved Schools">
      <approved-schools role="partner" />
    </el-tab-pane>
    <el-tab-pane label="Potential Schools">
      <potential-schools role="partner" />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import ApprovedSchools from './ApprovedSchools.vue'
import PotentialSchools from './PotentialSchools.vue'

export default {
  components: { ApprovedSchools, PotentialSchools },
}
</script>
