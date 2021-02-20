<template>
  <div
    class="wrapper"
    v-loading="false"
  >
    <span class="margin-left-10 title-condition">快速查询:</span>
    <el-input
      placeholder="请输入项目名称"
      class="margin-left-10"
      size="medium"
      v-model.trim="searchName"
    ></el-input>
    <el-button
      size="small"
      class="margin-left-10"
      type="primary"
      @click="search"
    >查询</el-button>
    <el-button
      type="primary"
      size="small"
      class="add-button margin-left-10"
      @click="addProject"
    >新增项目类型</el-button>
    <el-table
      :data="tableData"
      class="table"
    >
      <el-table-column
        prop="name"
        label="名称"
        width="240"
      >
      </el-table-column>
      <el-table-column
        prop="introduction"
        label="说明"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="240"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="modify(scope.row)"
          >修改</el-button>
          <el-button
            type="text"
            @click="destroy(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="新增项目类型"
      :visible.sync="projectDialogVisible"
      width="30%"
    >
      <el-form
        :model="projectForm"
        :rules="rules"
        label-width="70px"
        ref="projectForm"
        label-position="right"
        v-if="projectDialogVisible"
      >
        <el-form-item
          label="名称: "
          prop="name"
        >
          <el-input
            v-model="projectForm.name"
            placeholder="请输入项目名称"
            class="input"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="项目介绍: "
          prop="introduction"
        >
          <el-input
            v-model="projectForm.introduction"
            placeholder="请输入项目介绍"
            type="textarea"
            :rows="5"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class="submit-button">
            <el-button
              type="primary"
              @click="addSubmit"
            >确认</el-button>
          </div>

        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getProjects,
  postProjects,
  putProjects,
  deleteProjects
} from '@/api/demo.js';

export default {
  data: () => ({
    projectForm: {
      name: '',
      introduction: ''
    },
    loading: false,
    searchName: '',
    handleType: '',
    rules: {
      name: [
        { required: true, message: '请输入名称', trigger: 'change' }
      ],
      introduction: [
        { required: true, message: '请输入项目介绍', trigger: 'change' }
      ],
    },
    projectDialogVisible: false,
    tableData: []
  }),
  created() {
    this.getPorjects();
  },
  methods: {
    async  getPorjects(params) {
      this.loading = true;
      const data = await getProjects(params || {});
      this.loading = false;
      this.tableData = data.map(item => ({
        id: item.type_id,
        name: item.type_name,
        introduction: item.type_introduction
      }));
    },
    addProject() {
      this.handleType = 'add';
      this.projectForm = {
        id: null,
        name: '',
        introduction: ''
      };
      this.projectDialogVisible = true;
    },
    search() {
      this.getPorjects({ typeName: this.searchName });
    },
    modify(row) {
      this.handleType = 'modify';
      this.projectDialogVisible = true;
      this.projectForm = { ...row };
    },
    destroy(row) {
      this.$confirm('确定要删除该项目吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deleteProjects(row.id);
        this.$message({
          type: 'success',
          message: '删除成功!',
          duration: 2000
        });
        this.getPorjects();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addSubmit() {
      this.$refs.projectForm.validate(async (valid) => {
        if (valid) {
          const { name, introduction, id } = this.projectForm;

          let func = null;
          let data = {};
          switch (this.handleType) {
            case 'add':
              data = {
                typeName: name,
                typeIntroduction: introduction
              };
              func = postProjects(data);
              break;

            case 'modify':
              data = {
                typeId: id,
                typeName: name,
                typeIntroduction: introduction
              };
              func = putProjects(id, data);
              break;

            default:
              break;
          }
          func.then(() => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.getPorjects();
            this.projectDialogVisible = false;
          }).catch(() => {
            this.$message({
              message: '该项目已经存在',
              type: 'error',
              duration: 2000
            });
          });
        } else {
          return false;
        }
        return true;
      });
    },

  }
};
</script>

<style lang="stylus" scoped>
.wrapper {
  position: relative;
}

.title-condition {
  font-size: 20px;
  font-weight: bold;
  margin-left: 40px;
}

.add-button {
  position: absolute;
  right: 60px;
}

.table {
  margin-top: 20px;
}
</style>
