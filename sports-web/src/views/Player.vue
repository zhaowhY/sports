<template>
  <div class="wrapper"
       v-loading="loading">
    <span class="margin-left-10 title-condition">快速查询:</span>
    <el-input placeholder="请输入运动员姓名"
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
               @click="addProject">新增运动员 </el-button>
    <el-table :data="tableData"
              class="table">
      <el-table-column prop="playerNumber"
                       label="运动员编号">
      </el-table-column>
      <el-table-column prop="playerName"
                       label="姓名">
      </el-table-column>
      <el-table-column prop="playerSex"
                       label="性别">
      </el-table-column>
      <el-table-column prop="playerBirthday"
                       label="生日">
      </el-table-column>

      <el-table-column prop="playerStudentid"
                       label="学号">
      </el-table-column>
      <el-table-column prop="playerClass"
                       label="班级">
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

    <el-dialog title="新增运动员"
               :visible.sync="projectDialogVisible"
               width="40%">
      <el-form :model="projectForm"
               :rules="rules"
               label-width="100px"
               ref="projectForm"
               label-position="right"
               v-if="projectDialogVisible">
        <el-form-item label="运动员编号: "
                      prop="playerNumber">
          <el-input v-model="projectForm.playerNumber"
                    placeholder="请输入编号"></el-input>
        </el-form-item>

        <el-form-item label="姓名: "
                      prop="playerName">
          <el-input v-model="projectForm.playerName"
                    placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item label="性别: "
                      prop="playerSex">
          <el-select v-model="projectForm.playerSex"
                     placeholder="请选择">
            <el-option label="男"
                       value="男">
            </el-option>
            <el-option label="女"
                       value="女">
            </el-option>
          </el-select>

        </el-form-item>

        <el-form-item label="学号: "
                      prop="playerStudentid">
          <el-input v-model="projectForm.playerStudentid"
                    placeholder="请输入学号"></el-input>
        </el-form-item>
        <el-form-item label="班级: "
                      prop="playerClass">
          <el-input v-model="projectForm.playerClass"
                    placeholder="请输入班级"></el-input>
        </el-form-item>
        <el-form-item label="生日: "
                      prop="playerBirthday">
          <el-date-picker v-model="projectForm.playerBirthday"
                          type="date"
                          placeholder="选择生日"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
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
  getPlayers,
  postPlayers,
  putPlayers,
  deletePlayers
} from '@/api/demo.js';

export default {
  data: () => ({
    projectForm: {
      playerId: null,
      playerName: '',
      playerSex: '',
      playerBirthday: '',
      playerClass: '',
      playerStudentid: '',
      playerNumber: '',
    },
    loading: false,
    searchName: '',
    handleType: '',
    rules: {
      playerName: [
        { required: true, message: '请输入姓名', trigger: 'change' }
      ],
      playerSex: [
        { required: true, message: '请选择性别', trigger: 'change' }
      ],
      playerBirthday: [
        { required: true, message: '请选择生日', trigger: 'change' }
      ],
      playerClass: [
        { required: true, message: '请输入班级', trigger: 'change' }
      ],
      playerStudentid: [
        { required: true, message: '请输入学号', trigger: 'change' }
      ],
      playerNumber: [
        { required: true, message: '请输入编号', trigger: 'change' }
      ],
    },
    projectDialogVisible: false,
    tableData: [],
  }),
  async  created() {
    this.getPorjects();
  },
  methods: {
    async  getPorjects(params) {
      this.loading = true;
      const data = await getPlayers(params || {});
      this.loading = false;
      this.tableData = data.map(item => ({
        playerId: item.player_id,
        playerName: item.player_name,
        playerSex: item.player_sex,
        playerBirthday: item.player_birthday,
        playerClass: item.player_class,
        playerStudentid: item.player_studentid,
        playerNumber: item.player_number
      }));
    },
    addProject() {
      this.handleType = 'add';
      this.projectForm = {
        playerId: null,
        playerName: '',
        playerSex: '',
        playerBirthday: '',
        playerClass: '',
        playerStudentid: '',
        playerNumber: ''
      };
      this.projectDialogVisible = true;
    },
    search() {
      this.getPorjects({ playerName: this.searchName });
    },
    modify(row) {
      this.handleType = 'modify';
      this.projectDialogVisible = true;
      this.projectForm = { ...row };
    },
    destroy(row) {
      this.$confirm('确定要删除该运动员吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deletePlayers(row.playerId);
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
            playerId,
            playerName,
            playerSex,
            playerBirthday,
            playerClass,
            playerStudentid,
            playerNumber
          } = this.projectForm;

          let func = null;
          let data = {};
          switch (this.handleType) {
            case 'add':
              data = {
                playerName,
                playerSex,
                playerBirthday,
                playerClass,
                playerStudentid,
                playerNumber
              };
              func = postPlayers(data);
              break;

            case 'modify':
              data = {
                playerId,
                playerName,
                playerSex,
                playerBirthday,
                playerClass,
                playerStudentid,
                playerNumber
              };
              func = putPlayers(playerId, data);
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
              message: '该运动员已经存在',
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
