<template>
  <el-card>
    <div
      slot="header"
      class="no-print"
    >
      <b-row>
        <b-col
          cols="7"
        >
          <strong>
            {{ material.title }} <br> {{ ' (' + material.subject_teacher.subject.name +' - ' + material.subject_teacher.class_teacher.c_class.name + ')' }}
          </strong>
        </b-col>
        <b-col
          cols="5"
        >
          <span class="pull-right">
            <div class="demo-inline-spacing">
              <b-button-group
                size="sm"
              >
                <b-button
                  variant="outline-primary"
                  @click="changePdfPage(0)"
                >
                  Prev
                </b-button>
                <b-button

                  variant="outline-danger"
                >
                  <div>
                    <span> {{ currentPage }}</span>
                    <span>/</span>
                    <span>{{ pageCount }}</span>
                  </div>
                </b-button>
                <b-button

                  variant="outline-primary"
                  @click="changePdfPage(1)"
                >
                  Next
                </b-button>
              </b-button-group>
            </div>
          </span>
        </b-col>
      </b-row>
    </div>
    <div>
      <div v-if="fileType==='pdf'">
        <pdf
          :src="src"
          :page="currentPage"
          @num-pages="pageCount=$event"
          @page-loaded="currentPage=$event"
          @loaded="loadPdfHandler"
        />
      </div>
      <span class="pull-right">
        <div class="demo-inline-spacing">
          <b-button-group
            size="sm"
          >
            <b-button

              variant="outline-primary"
              @click="changePdfPage(0)"
            >
              Prev
            </b-button>
            <b-button

              variant="outline-danger"
            >
              <div>
                <span> {{ currentPage }}</span>
                <span>/</span>
                <span>{{ pageCount }}</span>
              </div>
            </b-button>
            <b-button

              variant="outline-primary"
              @click="changePdfPage(1)"
            >
              Next
            </b-button>
          </b-button-group>
        </div>
      </span>

    </div>
    <br><br>

  </el-card>
</template>

<script>
import pdf from 'vue-pdf'
import {
  BButtonGroup, BButton, BRow, BCol,
} from 'bootstrap-vue'
// import mammoth from 'mammoth'
// import axios from 'axios'
// import VueDocPreview from 'vue-doc-preview'

export default {
  name: 'FileOverView',
  components: {
    BButtonGroup,
    BButton,
    BRow,
    BCol,
    pdf,
    // VueDocPreview,
  },
  props: {
    material: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentPage: 0, // PDF file page
      pageCount: 0, // total pages of PDF file
      fileType: '', // file type src: '', // PDF file address
      src: '', // PDF file address
      viewHtml: '', // Web page string
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },

  },
  async created() { // sometimes PDF file addresses cross domains. It's best to deal with them here
    const app = this
    const url = `${app.baseServerUrl}api/materials/read/${app.material.id}`
    const fileName = app.material.material.split('/')[app.material.material.split('/').length - 1]
    // console.log(fileName)
    // eslint-disable-next-line prefer-destructuring
    app.fileType = fileName.split('.')[1]
    if (/pdf/.test(this.fileType)) {
      app.src = pdf.createLoadingTask(url)
    }
    // else if (/docx/.test(this.fileType)) {
    //   // console.log('word')
    //   const res = await axios({
    //     url,
    //     withCredentials: false,
    //     responseType: 'arraybuffer',
    //   })
    //   mammoth.convertToHtml({ arrayBuffer: res.data })
    //     .then(result => {
    //       console.log(result.value)
    //       this.viewHtml = result.value
    //     })
    //     .done()
    // } else {
    //   // eslint-disable-next-line no-alert
    //   alert('File format is not supported, only PDF and docx file preview are supported ')
    // }
  },
  methods: {
    // Change the page number of PDF. Val sends the value to distinguish the previous page from the next page. 0 is the previous page and 1 is the next page
    changePdfPage(val) {
      // console.log(val)
      if (val === 0 && this.currentPage > 1) {
        // eslint-disable-next-line no-plusplus
        this.currentPage--
        // console.log(this.currentPage)
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        // eslint-disable-next-line no-plusplus
        this.currentPage++
        // console.log(this.currentPage)
      }
    },
    // Pdf loading
    loadPdfHandler(e) {
      console.log(e)
      this.currentPage = 1 // load the first page first when loading
    },

  },
}
</script>

<style scoped lang="scss">
    .fileOverViewBox{
        background:#000000;
        min-width:100vh;
        .fileOverViewContentBox{
            width:1000px;
            margin:0 auto;
            background:#ffffff;
            .arrow{
                position: fixed;
                width:100%;
                height:60px;
                z-index: 100;
                -webkit-box-shadow: 0 2px 2px rgba(0,0,0,0.5);
                -moz-box-shadow: 0 2px 2px rgba(0,0,0,0.5);
                box-shadow:  0 2px 2px rgba(0,0,0,0.5);
                background:rgba(255,255,255,0.9);
                .turn{
                    cursor:pointer;
                    &:hover{
                        color:#58A5FE;
                    }
                }
                .pageBox{
                    margin:0 20px;
                }
            }
            .docViewBox{
                padding:20px;
            }
        }
    }

</style>
<style scoped>
.span {
  width: 100%;
}
</style>
