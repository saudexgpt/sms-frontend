<template>
  <div>
    <div
      v-if="option.question_type == 'select'"
      class="box"
    >

      <div class="box-header">
        <h4 class="box-title">
          Select Question Type
        </h4>
      </div>
      <el-row :gutter="10">
        <el-col
          :xs="12"
          :sm="12"
          :md="6"
          :lg="6"
        >
          <b-card
            class="text-center"
            style="cursor: pointer"
            @click="option.question_type='objective'"
          >
            <div class="truncate">
              <strong>{{ subjectTeacher.subject.code.toUpperCase() }}</strong>
              <div class="inner">
                <h4>
                  <feather-icon
                    size="30"
                    icon="Edit2Icon"
                  />
                </h4>
                <p><strong>Objective Questions</strong></p>
              </div>
            </div>
          </b-card>
        </el-col>
        <el-col
          :xs="12"
          :sm="12"
          :md="6"
          :lg="6"
        >
          <b-card
            class="text-center"
            style="cursor: pointer"
            @click="option.question_type='theory'"
          >
            <div class="truncate">
              <strong>{{ subjectTeacher.subject.code.toUpperCase() }}</strong>
              <div class="inner">
                <h4>
                  <feather-icon
                    size="30"
                    icon="Edit2Icon"
                  />
                </h4>
                <p><strong>Theory Questions</strong></p>
              </div>
            </div>
          </b-card>
        </el-col>
      </el-row>
    </div>
    <div v-if="option.question_type=='objective'">
      <obj-questions
        :subject-teacher="subjectTeacher"
        :option="option"
      />
    </div>
    <div v-if="option.question_type=='theory'">
      <theory-questions
        :subject-teacher="subjectTeacher"
        :option="option"
      />
    </div>
  </div>
</template>
<script>
import { BCard } from 'bootstrap-vue'
import ObjQuestions from './partials/objective/ObjQuestions.vue'
import TheoryQuestions from './partials/theory/TheoryQuestions.vue'

export default {
  components: {
    BCard, ObjQuestions, TheoryQuestions,
  },
  props: {
    subjectTeacher: {
      type: Object,
      default: () => ({}),
    },

  },
  data() {
    return {
      option: {
        question_type: 'select',
      },

    }
  },

}
</script>
