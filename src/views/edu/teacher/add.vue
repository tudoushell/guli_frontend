<template>
  <div id="app-container">
    <el-form ref="eduTeacher" :model="eduTeacher" label-width="80px" style="margin: 30px">
      <el-form-item label="讲师名称">
        <el-input v-model="eduTeacher.name"></el-input>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="eduTeacher.sort" controls-position="right" :min="0" :max="10"></el-input-number>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="eduTeacher.level" placeholder="请选择讲师头衔">
          <el-option label="高级讲师" :value="1"></el-option>
          <el-option label="首席讲师" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="eduTeacher.career"></el-input>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input type="textarea" v-model="eduTeacher.intro"></el-input>
      </el-form-item>
      <el-form-item label="讲师头像">
        <el-upload
          class="avatar-uploader"
          :action="BASE_API + '/oss/file/upload'"
          name="multipartFile"
          :show-file-list="false"
          :on-success="uploadAvatar"
        >
          <img v-if="eduTeacher.avatar" :src="eduTeacher.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button v-if="eduTeacher.id === ''" type="primary" @click="add">添加讲师</el-button>
        <el-button v-else type="primary" @click="update">修改讲师</el-button>
        <el-button  v-if="eduTeacher.id === ''" @click="clearTeacher">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from "@/api/edu/teacher";

export default {
  data() {
    return {
      eduTeacher: {
        id: "",
        name: "",
        sort: 0,
        career: "",
        level: 1,
        intro: "",
        avatar: ""
      },
      BASE_API: process.env.BASE_API
    };
  },
  created() {
    //this.$router 和 this.$route
    //第一个用于做跳转，$route为当前router跳转对象里面可以获取name、path、query、params等
    if (this.$route.params && this.$route.params.id) {
      const id = this.$route.params.id;
      this.getTeacherInfo(id);
    }
  },
  watch: {
    //监听
    $route(from, to) {
      console.log(from, to);
      this.clearTeacher();
    }
  },
  methods: {
    //上传头像
    uploadAvatar(response) {
      this.eduTeacher.avatar = response.data.fileUrl
    },
    //修改讲师
    update() {
      teacher
        .updateTeacher(this.eduTeacher)
        .then(response => {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.$router.push({
            path: "/edu/teacher/list"
          });
        })
        .catch(error => {
          this.$message({
            type: "error",
            message: error
          });
        });
    },
    //获取讲师信息
    getTeacherInfo(id) {
      teacher
        .getTeacherById(id)
        .then(response => {
          this.eduTeacher = response.data;
        })
        .catch(error => {});
    },
    //添加讲师
    add() {
      teacher
        .addTeacher(this.eduTeacher)
        .then(response => {
          this.$message({
            type: "success",
            message: "添加成功!"
          });
          this.$router.push({
            path: "/edu/teacher/list"
          });
        })
        .catch(error => {
          this.$message({
            type: "error",
            message: "添加失败!"
          });
        });
    },
    //清除填写信息
    clearTeacher() {
      this.eduTeacher = {
        name: "",
        sort: 0,
        level: "",
        intro: ""
      };
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>