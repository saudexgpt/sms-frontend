<template>
  <div>
    <vue-html2pdf
      ref="html2Pdf"
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="false"
      filename="hehehe"
      :paginate-elements-by-height="1100"
      :pdf-quality="2"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="800px"

      :manual-pagination="false"
      @progress="onProgress($event)"
      @startPagination="startPagination()"
      @hasPaginated="hasPaginated()"
      @beforeDownload="beforeDownload($event)"
      @hasDownloaded="hasDownloaded($event)"
    >
      <section slot="pdf-content">
        1.0 Introduction
        Digitalization of the education system is required today. The importance of Information Technology (IT) in education, whether it is used to support teaching and learning, or to develop student IT capability, or to support educational management, is now recognized throughout the world. A school delaying to be digitalized will sooner or later be obsolete.
        2.0 Problem Definition
        It takes a lot to manage a school properly. First of all, school management involves making sure that every unit is functioning at its best and is able to collaborate with other units to achieve set-out goals. Every principal, school administrator or manager is tasked with the responsibility of continuously improving student achievement. To do this, they must tackle issues like recruitment and management of teachers and other staff, monitoring and managing student behavior, improving learning experience and teacher effectiveness among other things.

      </section>
    </vue-html2pdf>
    <!-- <button id="generate">Generate PDF</button> -->
  </div>
</template>
<script>
import VueHtml2pdf from 'vue-html2pdf'

export default {

  components: {
    VueHtml2pdf,
  },
  methods: {
    /*
            Generate Report using refs and calling the
            refs function generatePdf()
        */
    startPagination() {
      this.$refs.html2Pdf.generatePdf()
    },
    async beforeDownload({ html2pdf, options, pdfContent }) {
      await html2pdf().set(options).from(pdfContent).toPdf()
        .get('pdf')
        .then(pdf => {
          const totalPages = pdf.internal.getNumberOfPages()
          // eslint-disable-next-line no-plusplus
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i)
            pdf.setFontSize(10)
            pdf.setTextColor(150)
            pdf.text(`Page ${i} of ${totalPages}`, (pdf.internal.pageSize.getWidth() * 0.88), (pdf.internal.pageSize.getHeight() - 0.3))
          }
        })
        .save()
    },
  },
}
</script>
