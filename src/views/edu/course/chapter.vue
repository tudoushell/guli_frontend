<template>
  <div id="app-container">
    <el-steps :active="active" align-center class="step">
      <el-step title="填写课程基本信息" description></el-step>
      <el-step title="创建课程大纲" description></el-step>
      <el-step title="最终发布" description></el-step>
    </el-steps>
    <div class="tree-style">
      <el-button @click="showDialog" type="primary">添加章节</el-button>
      <ul class="chapter-style">
        <li v-for="chapter in chapterDtoList" :key="chapter.id">
          <div class="main">
            <div class="item-style">
              {{ chapter.title }}
            </div>
            <div class="button-collect-style">
              <el-button @click="showSectionDialog(chapter.id)" type="primary"
                >添加小节</el-button
              >
              <el-button type="primary" icon="el-icon-edit"></el-button>
              <el-button type="primary" icon="el-icon-delete"></el-button>
            </div>
          </div>
          <ul>
            <li
              v-for="sectionChapter in chapter.children"
              :key="sectionChapter.id"
            >
              <div class="main">
                <div class="item-style">
                  {{ sectionChapter.title }}
                </div>
                <div class="button-collect-style">
                  <!-- 编辑小节 -->
                  <el-button type="primary" icon="el-icon-edit"></el-button>
                  <!-- 删除小节 -->
                  <el-button
                    type="primary"
                    @click="deleteSectionChapter(sectionChapter.id)"
                    icon="el-icon-delete"
                  ></el-button>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <!-- 章节弹窗 -->
      <el-dialog title="添加章节" :visible.sync="dialogFormVisible">
        <el-form :model="chapterDto">
          <el-form-item label="章节名称">
            <el-input v-model="chapterDto.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="顺序">
            <el-input-number
              v-model="chapterDto.sort"
              controls-position="left"
              :min="1"
              :max="100"
            ></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveChapter">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 小节弹窗 -->
      <el-dialog title="添加小节" :visible.sync="sectionDialog">
        <el-form :model="sectionChapter">
          <el-form-item label="小节名称">
            <el-input
              v-model="sectionChapter.title"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="顺序">
            <el-input-number
              v-model="sectionChapter.sort"
              controls-position="left"
              :min="1"
              :max="100"
            ></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="sectionDialog = false">取 消</el-button>
          <el-button type="primary" @click="saveOrUpdateSectionChapter"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <div class="button-style">
      <el-button style="text-align: center" @click="previous">上一步</el-button>
      <el-button style="text-align: center" @click="next"
        >保存并下一步</el-button
      >
    </div>
  </div>
</template>

<script>
import chapterApi from "@/api/edu/chapter";
import videoApi from "@/api/edu/video";
export default {
  data() {
    return {
      active: 2,
      courseId: "",
      dialogFormVisible: false,
      sectionDialog: false,
      chapterDto: {
        courseId: "",
        title: "",
        sort: 1
      },
      chapterDtoList: [],
      //小节
      sectionChapter: {
        courseId: "",
        chapterId: "",
        title: "",
        sort: 1
      },
      //章节ID
      chapterId: ""
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.listChapter();
    }
  },
  methods: {
    //删除小节
    deleteSectionChapter(sectionChapterId) {
      console.log(sectionChapterId);
      this.$confirm("此操作将删除该小节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        videoApi.deleteVideo(sectionChapterId).then(response => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          //刷新页面
          this.listChapter();
        });
      });
    },
    //保存或更新小节
    saveOrUpdateSectionChapter() {
      this.sectionChapter.courseId = this.courseId;
      this.sectionChapter.chapterId = this.chapterId;
      videoApi.addVideo(this.sectionChapter).then(response => {
        this.$message({
          type: "success",
          message: "添加小节成功!"
        });
        this.sectionDialog = false;
        this.listChapter();
        this.sectionChapter = {};
      });
    },
    //弹出小节dialog
    showSectionDialog(chapterId) {
      this.sectionDialog = true;
      this.chapterId = chapterId;
    },
    //显示章节和小节
    listChapter() {
      chapterApi.listChapter(this.courseId).then(response => {
        this.chapterDtoList = response.data;
      });
    },
    //添加章节
    saveChapter() {
      this.chapterDto.courseId = this.courseId;
      chapterApi.addChapter(this.chapterDto).then(response => {
        this.$message({
          type: "success",
          message: "添加章节成功!"
        });
        this.dialogFormVisible = false;
        this.listChapter();
        this.chapterDto = "";
      });
    },
    showDialog() {
      this.dialogFormVisible = true;
    },
    previous() {
      this.$router.push({
        path: `/edu/course/info/${this.courseId}`
      });
    },
    next() {
      this.$router.push({
        path: "/edu/course/publish/1"
      });
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
  text-align: center;
}
.tree-style {
  margin: 40px 141px;
  text-align: left;
}
.chapter-style {
  /* list-style-type: none; */
  padding: 0;
  font-size: 30px;
  line-height: 42px;
}
.chapter-style li {
  /* list-style-type: none; */
  padding-top: 10px;
}
.main {
  display: flex;
  flex-wrap: nowrap;
}
.item-style {
  flex: 1;
  margin-bottom: 6px;
}
</style>
