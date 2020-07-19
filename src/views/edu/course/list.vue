<template>
  <div id="app-container">
    <el-form :inline="true" :model="courseQuery" class="demo-form-inline">
      <el-form-item label="课程名称">
        <el-input v-model="courseQuery.title" placeholder="课程名称"></el-input>
      </el-form-item>

      <el-form-item label="课程状态">
        <el-select v-model="courseQuery.status" placeholder="请选择">
          <el-option label="未发布" value="Draft"></el-option>
          <el-option label="已发布" value="Normal"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="listCourse(1)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clearCourse()">清空</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="courseInfo"
      style="width: 100%"
      :default-sort="{ prop: 'date', order: 'descending' }"
    >
      <el-table-column prop="index" label="序号" type="index" width="180">
      </el-table-column>
      <el-table-column prop="title" label="课程名称" width="180">
      </el-table-column>
      <el-table-column
        prop="status"
        label="课程状态"
        width="180"
        :formatter="getStatus"
      >
      </el-table-column>
      <el-table-column prop="lessonNum" label="课时数" width="180">
      </el-table-column>
      <el-table-column prop="gmtCreate" label="添加时间"> </el-table-column>
      <el-table-column prop="viewCount" label="浏览数量"> </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!-- 进行路由跳转 -->
          <router-link :to="'/edu/course/info/' + scope.row.id">
            <el-button size="mini">编辑</el-button>
          </router-link>
          <el-button
            size="mini"
            type="danger"
            @click="deleteCourse(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: right; padding: 10px 35px"
      @size-change="handleSizeChange"
      @current-change="listCourse"
      :current-page="page"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="row"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import courseApi from "@/api/edu/course";
export default {
  data() {
    return {
      courseInfo: [],
      courseQuery: {},
      page: 1,
      row: 5,
      total: 0
    };
  },
  created() {
    this.listCourse(1);
  },
  methods: {
    clearCourse() {
      this.courseQuery = {};
      this.listCourse(1);
    },
    getStatus(row, column, cellValue) {
      if (cellValue === "Draft") {
        return "未发布";
      } else {
        return "已发布";
      }
    },
    deleteCourse(index, data) {
      const courseId = data.id;
      this.$confirm("此操作将删除课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        courseApi.deleteCourseById(courseId).then(response => {
          this.$message({
            type: "success",
            message: "删除成功！"
          });
          this.listCourse(1);
        });
      });
    },
    listCourse(page) {
      this.page = page;
      courseApi
        .listCourseByCondition(this.page, this.row, this.courseQuery)
        .then(response => {
          this.courseInfo = response.data.items;
          this.total = response.data.total;
        });
    },
    handleSizeChange(row) {
      this.row = row;
      this.listCourse(1);
    }
  }
};
</script>

<style>
#app-container {
  padding: 20px;
}
</style>
