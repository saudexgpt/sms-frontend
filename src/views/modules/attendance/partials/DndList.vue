<template>
  <el-row
    :gutter="10"
    class=""
  >
    <el-col
      :xs="24"
      :md="12"
      style="background: rgba(243, 129, 129, 0.904); color: #000; padding: 10px"
    >
      <h4>{{ unmarkedTitle }}</h4>
      <a
        class="btn btn-success"
        @click="markAll('marked')"
      >Mark All <i class="el-icon-d-arrow-right" /></a>
      <draggable
        :list="unmarked"
        :options="{group:'article'}"
        class="dragArea"
      >
        <div
          v-for="student in unmarked"
          :key="student.id"
          class="list-complete-item"
        >
          <div
            v-if="student !== null"
            class="list-complete-item-handle"
            @click="pushEle(student)"
          >
            {{ student.user.last_name+' '+student.user.first_name }} [{{ student.registration_no }}]

            <div style="position:absolute;right:0px;">
              <span style="float: right ;margin-top: -20px;margin-right:5px;">
                <feather-icon
                  icon="XIcon"
                  style="color: #ff4949"
                />
              </span>
            </div>
          </div>

        </div>
      </draggable>
    </el-col>
    <el-col
      :xs="24"
      :md="12"
      style="background: rgb(166, 247, 184); color: #000; padding: 10px "
    >
      <h4>{{ markedTitle }}</h4>
      <a
        class="btn btn-danger"
        @click="markAll('unmarked')"
      ><i class="el-icon-d-arrow-left" /> Unmark All</a>
      <draggable
        :list="marked"
        :options="{group:'article'}"
        class="dragArea"
      >
        <div
          v-for="student in marked"
          :key="student.id"
          class="list-complete-item"
        >
          <div
            v-if="student !== null"
            class="list-complete-item-handle2"
            @click="deleteEle(student)"
          >
            {{ student.user.last_name+' '+student.user.first_name }} [{{ student.registration_no }}]
            <div style="position:absolute;right:0px;">
              <span style="float: right ;margin-top: -20px;margin-right:5px;">
                <feather-icon
                  icon="CheckIcon"
                  style="color: rgb(17, 104, 9)"
                />
              </span>
            </div>
          </div>

        </div>
      </draggable>
    </el-col>
  </el-row>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'DndList',
  components: { draggable },
  props: {
    unmarked: {
      type: Array,
      default() {
        return []
      },
    },
    marked: {
      type: Array,
      default() {
        return []
      },
    },
    allStudents: {
      type: Array,
      default() {
        return []
      },
    },
    unmarkedTitle: {
      type: String,
      default: 'unmarked',
    },
    markedTitle: {
      type: String,
      default: 'marked',
    },

  },

  methods: {
    markAll(whatToMark) {
      if (whatToMark === 'marked') {
        this.allStudents.forEach(item => {
          this.pushEle(item)
        })
      } else {
        this.allStudents.forEach(item => {
          this.deleteEle(item)
        })
      }
    },
    isNotInUnmarked(v) {
      return this.unmarked.every(k => v.id !== k.id)
    },
    isNotInMarked(v) {
      return this.marked.every(k => v.id !== k.id)
    },
    deleteEle(ele) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of this.marked) {
        if (item.id === ele.id) {
          const index = this.marked.indexOf(item)
          this.marked.splice(index, 1)
          break
        }
      }
      if (this.isNotInUnmarked(ele)) {
        this.unmarked.unshift(ele)
      }
    },
    pushEle(ele) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of this.unmarked) {
        if (item.id === ele.id) {
          const index = this.unmarked.indexOf(item)
          this.unmarked.splice(index, 1)
          break
        }
      }
      if (this.isNotInMarked(ele)) {
        this.marked.push(ele)
      }
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dndList {
  background: #fff;
  padding-bottom: 40px;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
  .dndList-list {
    float: left;
    padding-bottom: 30px;
    &:first-of-type {
      margin-right: 2%;
    }
    .dragArea {
      margin-top: 15px;
      min-height: 50px;
      padding-bottom: 30px;
    }
  }
}

.list-complete-item {
  cursor: pointer;
  position: relative;
  font-size: 14px;
  padding: 5px 12px;
  margin-top: 4px;
  border: 1px solid #fff;
  transition: all 1s;
}

.list-complete-item-handle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 50px;
}

.list-complete-item-handle2 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 20px;
}

.list-complete-item.sortable-chosen {
  background: #4AB7BD;
}

.list-complete-item.sortable-ghost {
  background: #30B08F;
}

.list-complete-enter,
.list-complete-leave-active {
  opacity: 0;
}
</style>
