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
              <!-- 章节修改 -->
              <el-button
                type="primary"
                @click="eidtorChapter(chapter.id)"
                icon="el-icon-edit"
              ></el-button>
              <!-- 章节删除 -->
              <el-button
                type="primary"
                @click="deleteChapter(chapter.id)"
                icon="el-icon-delete"
              ></el-button>
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
                  <el-button
                    type="primary"
                    @click="editorSectionChapter(chapter.id, sectionChapter.id)"
                    icon="el-icon-edit"
                  ></el-button>
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
      <el-dialog
        :title="isShowAddOrUpdateChapter ? '添加章节' : '修改章节'"
        :visible.sync="dialogFormVisible"
      >
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
          <el-button type="primary" @click="saveOrUpdateChapter"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 小节弹窗 -->
      <el-dialog
        :title="isShowAddOrUpdateSectionChapter ? '添加课时' : '修改课时'"
        :visible.sync="sectionDialog"
      >
        <el-form :model="sectionChapter">
          <el-form-item label="课时名称">
            <el-input
              v-model="sectionChapter.title"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="课时排序">
            <el-input-number
              v-model="sectionChapter.sort"
              controls-position="left"
              :min="1"
              :max="100"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="是否免费">
            <el-radio v-model="sectionChapter.isFree" label="1">免费</el-radio>
            <el-radio v-model="sectionChapter.isFree" label="0">收费</el-radio>
          </el-form-item>
          <el-form-item label="上传视频">
            <el-upload
              class="upload-demo"
              :action="baseURL + '/vod'"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-success="fileUploadSuccess"
              name="file"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div> -->
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeSectionChapterDialog">取 消</el-button>
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
        id: "",
        courseId: "",
        title: "",
        sort: 1
      },
      chapterDtoList: [],
      //小节
      sectionChapter: {
        id: "",
        courseId: "",
        chapterId: "",
        title: "",
        sort: 1
      },
      //用于显示添加或修改小节的名称
      isShowAddOrUpdateSectionChapter: true,
      isShowAddOrUpdateChapter: true,
      fileList: [],
      baseURL: process.env.BASE_API
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.listChapter();
    }
  },
  methods: {
    //文件上传成功
    fileUploadSuccess(response, file, fileList) {
      //获取上传成功的视频ID
      this.sectionChapter.videoSourceId = response.data;
      this.sectionChapter.videoOriginalName = file.name.split(".")[0];
      this.sectionChapter.size = file.size;
      console.log(response.data)
    },
    //文件超出个数限制时
    handleExceed(files, fileList) {
      if (fileList.lenght > 1) {
        this.$message.warning("最多只能上传一个文件！");
      }
    },
    //弹出章节信息
    eidtorChapter(chapterId) {
      this.chapterDto.id = chapterId;
      this.isShowAddOrUpdateChapter = false;
      this.dialogFormVisible = true;
      chapterApi.getChapter(chapterId).then(response => {
        this.chapterDto = response.data;
      });
    },
    //删除章节
    deleteChapter(chapterId) {
      this.$confirm("此操作将删除章节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        chapterApi.deleteChapter(chapterId).then(response => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          //刷新页面
          this.listChapter();
        });
      });
    },
    //编辑小节信息
    editorSectionChapter(chapterId, sectionChapterId) {
      this.sectionChapter.id = sectionChapterId;
      this.chapterDto.id = chapterId;
      this.sectionDialog = true;
      this.isShowAddOrUpdateSectionChapter = false;
      videoApi.getVideo(sectionChapterId).then(response => {
        this.sectionChapter = response.data;
      });
    },
    //删除小节
    deleteSectionChapter(sectionChapterId) {
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
      this.sectionChapter.chapterId = this.chapterDto.id;
      //添加小节信息
      if (this.sectionChapter.id === "") {
        videoApi.addVideo(this.sectionChapter).then(response => {
          this.$message({
            type: "success",
            message: "添加小节成功!"
          });
          this.sectionDialog = false;
          this.listChapter();
          this.sectionChapter = {
            id: "",
            courseId: "",
            chapterId: "",
            title: "",
            sort: 1
          };
        });
      } else {
        //修改小节信息
        videoApi.updateVideo(this.sectionChapter).then(response => {
          this.$message({
            type: "success",
            message: "小节成功!"
          });
          this.sectionDialog = false;
          this.listChapter();
          this.sectionChapter = {
            id: "",
            courseId: "",
            chapterId: "",
            title: "",
            sort: 1
          };
        });
      }
    },
    //关闭小节dialog
    closeSectionChapterDialog() {
      this.sectionDialog = false;
      this.sectionChapter = {};
    },
    //弹出小节dialog
    showSectionDialog(chapterId) {
      this.sectionDialog = true;
      this.chapterDto.id = chapterId;
    },
    //显示章节和小节
    listChapter() {
      chapterApi.listChapter(this.courseId).then(response => {
        this.chapterDtoList = response.data;
      });
    },
    //添加或修改章节
    saveOrUpdateChapter() {
      this.isShowAddOrUpdateChapter = true;
      this.chapterDto.courseId = this.courseId;
      //添加章节
      if (this.chapterDto.id === "") {
        chapterApi.addChapter(this.chapterDto).then(response => {
          this.$message({
            type: "success",
            message: "添加章节成功!"
          });
          this.dialogFormVisible = false;
          this.listChapter();
          this.chapterDto = { id: "", courseId: "", title: "", sort: 1 };
        });
      } else {
        //修改章节
        chapterApi.updateChapter(this.chapterDto).then(response => {
          this.$message({
            type: "success",
            message: "修改章节成功!"
          });
          this.dialogFormVisible = false;
          this.listChapter();
          this.chapterDto = { id: "", courseId: "", title: "", sort: 1 };
        });
      }
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
        path: `/edu/course/publish/${this.courseId}`
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
