<template>
  <div id="app-container">
    <el-steps :active="active" align-center class="step">
      <el-step title="填写课程基本信息" description></el-step>
      <el-step title="创建课程大纲" description></el-step>
      <el-step title="提交审核" description></el-step>
    </el-steps>
    <div class="button-style">
      <el-button style="text-align: center" @click="previous">返回修改</el-button>
      <el-button style="text-align: center" @click="next">发布课程</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 3
    };
  },
  created() {},
  methods: {
    previous() {
      this.$router.go(-1)
    },
    next() {
      this.$router.push({
        path: "/edu/course/list"
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
</style>