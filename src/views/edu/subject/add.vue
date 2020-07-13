<template>
  <div id="app-container">
    <el-upload
      class="upload-demo"
      ref="upload"
      name="file"
      :action="BASE_API + '/edu-service/edu-subject/file'"
      :on-success="uploadFileSuccess"
      :auto-upload="false"
      :limit="1"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>
                    
<script>
export default {
  data() {
    return {
      BASE_API: process.env.BASE_API
    };
  },
  created() {},
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    uploadFileSuccess(response) {
      if (response.code === 200) {
        this.$message({
          type: "success",
          message: "上传成功!"
        });
      } else {
        this.$message({
          type: "error",
          message: response.message
        });
      }
    }
  }
};
</script>

<style>
.upload-demo {
  padding: 20px;
}
</style>