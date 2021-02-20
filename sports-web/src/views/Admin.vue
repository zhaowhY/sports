<template>
  <div class="wrapper"
       v-loading="loading">
    <span class="margin-left-10 title-condition">快速查询:</span>
    <el-input placeholder="请输入人员姓名"
              class="margin-left-10"
              size="medium"
              v-model.trim="searchName"></el-input>
    <el-button size="small"
               class="margin-left-10"
               type="primary"
               @click="search">查询</el-button>
    <el-button type="primary"
               size="small"
               class="add-button margin-left-10"
               @click="addProject">新增人员</el-button>
    <el-table :data="tableData"
              class="table">
      <el-table-column prop="adminName"
                       label="姓名">
      </el-table-column>
      <el-table-column prop="adminUsername"
                       label="用户名">
      </el-table-column>
      <el-table-column prop="adminPassword"
                       label="密码">
      </el-table-column>
      <el-table-column prop="adminSex"
                       label="性别">
      </el-table-column>

      <el-table-column label="身份类型"
                       prop="adminType">
        <template slot-scope="scope">
          {{scope.row.adminType === '1'? '操作员': '管理员'}}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     @click="modify(scope.row)">修改</el-button>
          <el-button type="text"
                     @click="destroy(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增操作员"
               :visible.sync="projectDialogVisible"
               width="40%">
      <el-form :model="projectForm"
               :rules="rules"
               label-width="100px"
               ref="projectForm"
               label-position="right"
               v-if="projectDialogVisible">
        <el-form-item label="姓名: "
                      prop="adminName">
          <el-input v-model="projectForm.adminName"
                    placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item label="用户名: "
                      prop="adminUsername">
          <el-input v-model="projectForm.adminUsername"
                    placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码: "
                      prop="adminPassword">
          <el-input v-model="projectForm.adminPassword"
                    placeholder="请输入密码"
                    show-password></el-input>
        </el-form-item>

        <el-form-item label="性别: "
                      prop="adminSex">
          <el-select v-model="projectForm.adminSex"
                     placeholder="请选择">
            <el-option label="男"
                       value="男">
            </el-option>
            <el-option label="女"
                       value="女">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份类型: "
                      prop="adminType">
          <el-select v-model="projectForm.adminType"
                     placeholder="请选择">
            <el-option label="管理员"
                       value="2">
            </el-option>
            <el-option label="操作员"
                       value="1">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <div class="submit-button">
            <el-button type="primary"
                       @click="addSubmit">确认</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAdmins,
  postAdmins,
  putAdmins,
  deleteAdmins
} from '@/api/demo.js';

export default {
  data: () => ({
    projectForm: {
      adminId: null,
      adminUsername: '',
      adminPassword: '',
      adminType: '',
      adminName: '',
      adminSex: '',
    },
    loading: false,
    searchName: '',
    handleType: '',
    rules: {
      adminName: [
        { required: true, message: '请输入姓名', trigger: 'change' }
      ],
      adminSex: [
        { required: true, message: '请选择性别', trigger: 'change' }
      ],

      adminUsername: [
        { required: true, message: '请输入用户名', trigger: 'change' }
      ],
      adminPassword: [
        { required: true, message: '请输入密码', trigger: 'change' }
      ],
      adminType: [
        { required: true, message: '请选择身份类别', trigger: 'change' }
      ],
    },
    projectDialogVisible: false,
    tableData: []
  }),
  async  created() {
    this.getPorjects();
  },
  methods: {
    async  getPorjects(params) {
      this.loading = true;
      const data = await getAdmins(params || {});
      this.loading = false;
      this.tableData = data.map(item => ({
        adminId: item.admin_id,
        adminUsername: item.admin_username,
        adminPassword: item.admin_password,
        adminType: item.admin_type,
        adminName: item.admin_name,
        adminSex: item.admin_sex,
      }));
    },
    addProject() {
      this.handleType = 'add';
      this.projectForm = {
        adminId: null,
        adminUsername: '',
        adminPassword: '',
        adminType: '',
        adminName: '',
        adminSex: '',
      };
      this.projectDialogVisible = true;
    },
    search() {
      this.getPorjects({ adminName: this.searchName });
    },
    modify(row) {
      this.handleType = 'modify';
      this.projectDialogVisible = true;
      this.projectForm = { ...row };
    },
    destroy(row) {
      this.$confirm('确定要删除该人员吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deleteAdmins(row.adminId);
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
          const {
            adminId,
            adminUsername,
            adminPassword,
            adminType,
            adminName,
            adminSex,
          } = this.projectForm;

          let func = null;
          let data = {};
          switch (this.handleType) {
            case 'add':
              data = {
                adminUsername,
                adminPassword,
                adminType,
                adminName,
                adminSex,
              };
              func = postAdmins(data);
              break;

            case 'modify':
              data = {
                adminId,
                adminUsername,
                adminPassword,
                adminType,
                adminName,
                adminSex,
              };
              func = putAdmins(adminId, data);
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
              message: '该人员已经存在',
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
.wrapper
  position relative

.title-condition
  font-size 20px
  font-weight bold
  margin-left 40px

.add-button
  position absolute
  right 60px

.table
  margin-top 20px
</style>
