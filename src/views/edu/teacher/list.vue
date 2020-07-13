<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryTeacher" class="demo-form-inline">
      <el-form-item label="讲师姓名">
        <el-input v-model="queryTeacher.name" placeholder="讲师姓名"></el-input>
      </el-form-item>

      <el-form-item label="头衔">
        <el-select v-model="queryTeacher.level" placeholder="请选择">
          <el-option label="高级讲师" value="1"></el-option>
          <el-option label="首席讲师" value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="开始时间">
         <el-date-picker
            v-model="queryTeacher.startTime"
            type="datetime"
            format= "yyyy-MM-dd HH:mm:ss"
            value-format= "yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间"> 
         <el-date-picker
            v-model="queryTeacher.endTime"
            type="datetime"
            format= "yyyy-MM-dd HH:mm:ss"
            value-format= "yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTeacherList(1)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clearForm()">清空</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      style="width: 100%"
      :default-sort = "{prop: 'date', order: 'descending'}"
      >
      <el-table-column
        prop="index"
        label="序号"
        type="index"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="讲师姓名"
        width="180">
      </el-table-column>

      <el-table-column
        prop="level"
        label="头衔"
        width="180"
        :formatter="getLevel">
      </el-table-column>
      
        <el-table-column
        prop="career"
        label="资历"
        width="180">
      </el-table-column>

      <el-table-column
        prop="gmtCreate"
        label="添加时间">
      </el-table-column>
      <el-table-column
          prop="sort"
          label="排序"
        >
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!-- 进行路由跳转 -->
          <router-link :to="'/edu/teacher/edit/' + scope.row.id">
            <el-button
              size="mini"
            >编辑</el-button>
          </router-link>
          <el-button
            size="mini"
            type="danger"
            @click="deleteTeacher(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: right; padding: 10px 35px"
      @size-change="handleSizeChange"
      @current-change="getTeacherList"
      :current-page="page"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="row"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import teacher from '@/api/edu/teacher'

export default {
  data() {
    return {
      page: 1,
      row: 5,
      total: 0,
      queryTeacher: {},
      list: null,
    }
  },
  created() {
    this.getTeacherList(1)
  },
  methods: {
    //删除讲师
    deleteTeacher(index, row) {
       this.$confirm('此操作将永久删除讲师, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          teacher.deleteTeacherById(row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getTeacherList(1)
          })
          .catch(error => {
            console.log(error)
          })
        })
    },
    //分页获取讲师
    getTeacherList(page) {
      this.page = page
      teacher.getTeacherListByPage(this.page, this.row, this.queryTeacher)
            .then(response => {
              this.list = response.data.items
              this.total = response.data.total
            })
            .catch(error => {
              console.log(error)
            })
    },
    //判断头衔名称
    getLevel(row, column, cellValue) {
      if(cellValue === 1) {
        return '高级讲师'
      } else if(cellValue === 2) {
        return '首席讲师'
      }
    },
    //每页显示条数
    handleSizeChange(row) {
      this.row = row
      this.getTeacherList(this.page)
    },
    clearForm() {
      this.queryTeacher = {},
      this.getTeacherList(1)
    }
  }

}
</script>

<style>

</style>