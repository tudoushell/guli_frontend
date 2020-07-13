<template>
  <div id="app-container">
    <div class="tree">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
      <el-tree
        class="filter-tree"
        :data="subjectList"
        :props="defaultProps"
        :default-expand-all="expandAll"
        :filter-node-method="filterNode"
        accordion
        ref="tree"
      ></el-tree>
    </div>
  </div>
</template>

<script>
import subject from "@/api/edu/subject";
export default {
  data() {
    return {
      filterText: "",
      subjectList: [],
      expandAll: false,
      renderafter: false,
      defaultProps: {
        children: "children",
        label: "title"
      }
    };
  },
  created() {
    this.listSubject();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.title.toLowerCase().indexOf(value) !== -1;
    },
    listSubject() {
      subject.listSubjectCategory().then(response => {
        this.subjectList = response.data;
      });
    }
  }
};
</script>

<style>
.tree {
  margin: 16px 0 10px 7px;
}
.filter-tree {
    margin-top: 10px;
}
</style>