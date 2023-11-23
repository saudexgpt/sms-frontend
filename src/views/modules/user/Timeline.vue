<template>
  <el-card>
    <div slot="header">
      <h4>My Timeline</h4>
    </div>
    <b-card>
      <b-form-group>
        <el-input
          v-model="newpost"
          placeholder="Type Post..."
          type="textarea"
          rows="3"
        />
      </b-form-group>
      <!--/ comment box -->

      <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        size="sm"
        variant="primary"
        @click="createPost()"
      >
        Post
      </b-button>
    </b-card>
    <div style="height: 1500px; overflow: auto">
      <div v-if="posts.length > 0">
        <b-card
          v-for="(data, index) in posts"
          :key="index"
        >
          <aside>
            <div
              class="d-flex justify-content-start align-items-center mb-1"
            >
              <!-- avatar -->
              <b-avatar
                :src="baseServerUrl +'storage/'+data.user.photo"
                size="50"
                class="mr-1"
              />
              <!--/ avatar -->
              <div class="profile-user-info">
                <strong class="mb-0">
                  {{ data.user.first_name + ' ' + data.user.last_name }}
                </strong>
                <small class="text-muted">{{ moment(data.created_at).format('LLL') }}</small>
              </div>
            </div>
            <b-card-text>
              {{ data.content }}
            </b-card-text>
          </aside>

          <!-- comments -->
          <div
            v-for="(comment,ind) in data.comments"
            :key="ind"
            class="d-flex align-items-start mb-1"
          >
            <b-avatar
              :src="comment.avatar"
              size="20"
              class="mt-25 mr-75"
            />
            <div class="profile-user-info w-100">
              <div class="d-flex align-items-center justify-content-between">
                <strong class="mb-0">
                  <!-- {{ comment.username }} -->
                  {{ comment.user.first_name + ' ' + comment.user.last_name }}
                </strong>
              <!-- <b-link class="text-body">
                <feather-icon
                  icon="HeartIcon"
                  size="18"
                  class="mr-25"
                  :class="comment.youLiked ? 'profile-likes' :'profile-icon'"
                />
                <span class="text-muted align-middle">{{ comment.commentsLikes }}</span>
              </b-link> -->
              </div>
              <small>{{ comment.comment }}</small>
            </div>
          </div>
          <!--/ comments -->

          <!-- comment box -->
          <b-form-group>
            <!-- <el-input
              v-model="new_comment"
              type="textarea"
              maxlength="70"
              show-word-limit
              placeholder="Add Comment"
            /> -->

            <el-input
              v-model="new_comment"
              placeholder="Type comment..."
              type="textarea"
              rows="1"
              resize="none"
            />
          </b-form-group>
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            size="sm"
            variant="danger"
            @click="postComment(index, data.id)"
          >
            Send
          </b-button>
          <!--/ comment box -->

        </b-card>
      </div>
      <infinite-loading @infinite="fetchTimeline">
        <span slot="no-results" />
      </infinite-loading>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
    </div>
  </el-card>
</template>

<script>
import moment from 'moment'
import {
  BAvatar, BCard, BCardText, /* BImg, BLink, BRow, BCol, BAvatarGroup, */ VBTooltip, BButton, BFormGroup, // BEmbed,
} from 'bootstrap-vue'
import InfiniteLoading from 'vue-infinite-loading'
import Ripple from 'vue-ripple-directive'
import { kFormatter } from '@core/utils/filter'

import Resource from '@/api/resource'

export default {
  components: {
    BAvatar,
    BCard,
    BCardText,
    BButton,
    // BFormTextarea,
    // BImg,
    BFormGroup,
    InfiniteLoading,
    // BRow,
    // BLink,
    // BCol,
    // BAvatarGroup,
    // BEmbed,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  data() {
    return {
      posts: [],
      new_comment: '',
      newpost: '',
      query: {
        page: 1,
        limit: 10,
        // total: 0,
        // to: null,
        // first_page_url: '',
        // last_page: 1,
        // current_page: 1
      },
      total: 0,
      no_of_loads: 0,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchTimeline()
  },
  methods: {
    moment,
    kFormatter,
    fetchTimeline($state) {
      // console.log($state)
      const app = this
      // if (app.no_of_loads === 0 || app.query.next_page_url !== null) {
      const timelineResource = new Resource('timeline')
      timelineResource.list(app.query).then(response => {
        app.posts.push(...response.timelines.data)
        app.total = response.total
        // app.posts = app.posts.concat(response.timelines.data)
        // console.log()
        // app.query.next_page_url = response.timelines.next_page_url
        app.query.page += 1
        $state.loaded()
      }).catch(error => {
        console.log(error)
        $state.complete()
      })
      // }
    },
    postComment(index, postId) {
      const app = this
      const param = { comment: app.new_comment, timeline_id: postId }
      const commentResource = new Resource('timeline/post-comment')
      commentResource.store(param).then(response => {
        app.new_comment = ''
        app.posts[index].comments.push(response.timeline_comment)
      }).catch(error => {
        console.log(error)
      })
    },
    createPost() {
      const app = this
      const param = { content: app.newpost }
      const commentResource = new Resource('timeline/store')
      commentResource.store(param).then(response => {
        app.newpost = ''
        app.posts.unshift(response.timeline)
      }).catch(error => {
        console.log(error)
      })
    },
  },
}
</script>
