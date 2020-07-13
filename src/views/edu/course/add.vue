<template>
  <div id="app-container">
    <el-steps :active="active" align-center class="step">
      <el-step title="填写课程基本信息" description></el-step>
      <el-step title="创建课程大纲" description></el-step>
      <el-step title="最终发布" description></el-step>
    </el-steps>
    <el-form
      :model="course"
      ref="subjectForm"
      label-width="100px"
      class="form-style"
    >
      <el-form-item label="课程标题" prop="title">
        <el-input v-model="course.title"></el-input>
      </el-form-item>
      <el-form-item label="课程分类" prop="category">
        <el-select
          v-model="course.subjectParentId"
          placeholder="一级分类"
          @change="displayTwoCategroy"
        >
          <el-option
            v-for="category in subjectCategory"
            :key="category.id"
            :label="category.title"
            :value="category.id"
          ></el-option>
        </el-select>
        <el-select v-model="course.subjectId" placeholder="二级分类">
          <el-option
            v-for="twoCategory in twoSubjectCategory"
            :key="twoCategory.id"
            :label="twoCategory.title"
            :value="twoCategory.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程讲师">
        <el-select v-model="course.teacherId" placeholder="课程讲师">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number
          v-model="course.lessonNum"
          controls-position="left"
          :min="1"
          :max="10"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="课程简介" prop="name">
        <editor
          ref="toastuiEditor"
          @blur="onEditorBlur"
          :options="editorOptions"
          :initialValue="editorText"
          height="400px"
          initialEditType="markdown"
          previewStyle="vertical"
          style="width:700px"
        />
      </el-form-item>
      <el-form-item label="课程封面">
        <el-upload
          class="avatar-uploader"
          :action="BASE_API + '/oss/file/upload'"
          name="multipartFile"
          :show-file-list="false"
          :on-success="uploadCover"
        >
          <img v-if="course.cover" :src="course.cover" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="课程价格">
        <el-input-number
          v-model="course.price"
          controls-position="right"
          :min="10"
          :max="200"
        ></el-input-number
        >元
      </el-form-item>
    </el-form>
    <div class="button-style">
      <el-button style="text-align: center" @click="next"
        >保存并下一步</el-button
      >
    </div>
  </div>
</template>

<script>
import subject from "@/api/edu/subject";
import teacher from "@/api/edu/teacher";
import courseApi from "@/api/edu/course";
import { Editor } from "@toast-ui/vue-editor";
export default {
  components: {
    editor: Editor
  },
  data() {
    return {
      active: 1,
      course: {
        subjectParentId: "",
        subjectId: "",
        cover: "",
        description: ""
      },
      subjectCategory: [],
      twoSubjectCategory: [],
      teacherList: [],
      BASE_API: process.env.BASE_API,
      //markdown 编辑器初始值
      editorText: "",
      editorOptions: {
        language: "zh-CN",
        hideModeSwitch: true
      },
      courseId: ""
    };
  },
  created() {
    //获取url参数后面的id
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getCourseInfo();
    }
    this.listSubjectCate();
    this.listTeacher();
  },
  methods: {
    //获取课程信息
    getCourseInfo() {
      courseApi.getCourse(this.courseId).then(response => {
        this.course = response.data;
        //设置markdown值
        this.$refs.toastuiEditor.invoke("setMarkdown", this.course.description);
      });
    },
    //获取markdown里面的内容
    onEditorBlur() {
      this.course.description = this.$refs.toastuiEditor.invoke("getMarkdown");
    },
    //上传封面
    uploadCover(response) {
      this.course.cover = response.data.fileUrl;
    },
    //列出所有的讲师
    listTeacher() {
      teacher.listAllTeacher().then(response => {
        this.teacherList = response.data;
      });
    },
    //显示二级分类
    displayTwoCategroy(value) {
      this.twoSubjectCategory = this.subjectCategory.filter(
        subject => subject.id === value
      )[0].children;
      this.course.subjectId = "";
    },
    //显示一级分类
    listSubjectCate() {
      subject.listSubjectCategory().then(response => {
        this.subjectCategory = response.data;
        if (this.$route.params && this.$route.params.id) {
          this.twoSubjectCategory = this.subjectCategory.filter(
            oneCategory => oneCategory.id === this.course.subjectParentId
          )[0].children;
        }
      });
    },
    next() {
      //更新
      if (this.$route.params && this.$route.params.id) {
        this.course.id = this.$route.params.id;
        courseApi.updateCourse(this.course).then(response => {
          this.$message({
            type: "success",
            message: "更新课程信息成功!"
          });
          this.$router.push({
            path: `/edu/course/chapter/${this.course.id}`
          });
        });
      } else {
        //添加
        courseApi.addCourse(this.course).then(response => {
          console.log(response.code);
          if (response.code === 200) {
            this.$message({
              type: "success",
              message: "添加课程信息成功!"
            });
            this.$router.push({
              path: `/edu/course/chapter/${response.data}`
            });
          }
        });
      }
    }
  }
};
</script>

<style>
.step {
  margin-top: 65px;
}
.button-style {
  margin-top: 35px;
  margin-bottom: 30px;
  text-align: center;
}
.form-style {
  width: 50%;
  margin: 30px auto;
}
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
