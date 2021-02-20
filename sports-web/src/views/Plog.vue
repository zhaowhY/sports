<template>
  <div class="wrapper"
       v-loading="loading">
    <span class="margin-left-10 title-condition">快速查询:</span>
    <el-input placeholder="请根据运动员编号、姓名或赛程名称"
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
               @click="addProject">新增参赛记录</el-button>
    <el-table :data="tableData"
              class="table">
      <el-table-column prop="order"
                       label="序号">
      </el-table-column>
      <el-table-column prop="competition"
                       label="比赛项目">
      </el-table-column>
      <el-table-column prop="date"
                       label="比赛日期">
      </el-table-column>
      <el-table-column prop="playerName"
                       label="运动员姓名">
      </el-table-column>
      <el-table-column prop="playerNumber"
                       label="运动员编号">
      </el-table-column>
      <el-table-column prop="playerGrade"
                       label="成绩">
        <template slot-scope="scope">
          {{scope.row.playerGrade === -1? '无':scope.row.playerGrade}}
        </template>
      </el-table-column>

      <el-table-column label="登记人"
                       prop="adminName">

      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     @click="modify(scope.row)">登记成绩</el-button>
          <el-button type="text"
                     @click="destroy(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增参赛记录"
               :visible.sync="projectDialogVisible"
               width="40%">
      <el-form :model="projectForm"
               :rules="rules"
               label-width="100px"
               ref="projectForm"
               label-position="right"
               v-if="projectDialogVisible">
        <template v-if="handleType !== 'modify'">
          <el-form-item label="赛程: "
                        prop="plogScheduleid">
            <el-select v-model="projectForm.plogScheduleid"
                       placeholder="请选择">
              <el-option v-for="item of options.competitions"
                         :key="item.schedule_id"
                         :label="item.schedule_name"
                         :value="item.schedule_id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="运动员: "
                        prop="plogPlayerid">
            <el-select v-model="projectForm.plogPlayerid"
                       placeholder="请选择">
              <el-option v-for="item of options.players"
                         :key="item.player_id"
                         :label="`${item.player_number}-${item.player_name}`"
                         :value="item.player_id">
              </el-option>
            </el-select>
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item label="赛程: "
                        prop="plogSchedulename">
            {{projectForm.plogSchedulename}}
          </el-form-item>

          <el-form-item label="运动员编号: "
                        prop="plogPlayernumber">
            {{projectForm.plogPlayernumber}}
          </el-form-item>

          <el-form-item label="运动员姓名: "
                        prop="plogPlayername">
            {{projectForm.plogPlayername}}
          </el-form-item>
          <el-form-item label="运动员成绩: "
                        prop="plogScore">
            <el-input v-model.trim="projectForm.plogScore"
                      placeholder="请输入成绩"></el-input>
          </el-form-item>

        </template>
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
  getCompetitions,
  getPlayers,
  getPlogs,
  postPlogs,
  putPlogs,
  deletePlogs
} from '@/api/demo.js';

export default {
  data: () => ({
    projectForm: {
      plogId: null,
      plogOrder: null,
      plogPlayernumber: '',
      plogPlayername: '',
      plogSchedulename: '',
      plogScore: null,
      plogAdminname: '',
    },
    loading: false,
    options: {
      competitions: [],
      players: []
    },
    allPlayers: '',
    searchName: '',
    handleType: '',
    rules: {
      plogScheduleid: [
        { required: true, message: '请选择赛程', trigger: 'change' }
      ],
      plogPlayerid: [
        { required: true, message: '请选择运动员', trigger: 'change' }
      ],
      plogScore: [
        { required: true, message: '请输入成绩', trigger: 'change' }
      ],
    },
    projectDialogVisible: false,
    tableData: []
  }),
  async  created() {
    this.loading = true;
    this.allPlayers = await getPlayers();
    const competitions = await getCompetitions();
    this.$set(this.options, 'competitions', competitions);
    this.getPorjects();
  },
  computed: {
    plogScheduleid() {
      return this.projectForm.plogScheduleid;
    }
  },
  watch: {
    plogScheduleid() {
      const players = this.allPlayers.filter((item) => {
        const idx = this.tableData.findIndex((tableItem) => {
          if (tableItem.scheduleId === this.plogScheduleid &&
            tableItem.playerId === item.player_id) {
            return true;
          }
          return false;
        });
        if (idx !== -1) {
          return false;
        }
        return true;
      });
      this.$set(this.options, 'players', players);
    }
  },

  methods: {
    async  getPorjects(params) {
      this.loading = true;
      const data = await getPlogs(params || {});
      this.loading = false;
      this.tableData = data.map((item, index) => {
        const curCompetition =
          this.options.competitions.find(com =>
            com.schedule_name === item.plog_schedulename);
        // if (!curCompetition) {
        //   curCompetition = {
        //     schedule_starttime: ''
        //   };
        // }
        return {
          plogId: item.plog_id,
          order: index + 1,
          scheduleId: item.plog_scheduleid,
          competition: item.plog_schedulename,
          date: curCompetition.schedule_date,
          playerId: item.plog_playerid,
          playerName: item.plog_playername,
          playerNumber: item.plog_playernumber,
          playerGrade: item.plog_score,
          adminId: item.plog_adminid,
          adminName: item.plog_adminname
        };
      });
    },
    addProject() {
      this.handleType = 'add';
      this.projectForm = {
        plogId: null,
        plogOrder: null,
        plogPlayerid: null,
        plogScheduleid: null,
        plogScore: null,
        plogAdminid: null,
      };
      this.projectDialogVisible = true;
    },
    search() {
      this.getPorjects({ plogSearch: this.searchName });
    },
    modify(row) {
      this.handleType = 'modify';
      this.projectDialogVisible = true;
      const {
        plogId,
        competition,
        playerName,
        playerNumber,
        playerGrade,
        adminName,
        scheduleId,
        playerId,
        adminId
      } = row;
      this.projectForm = {
        plogId,
        plogPlayerid: playerId,
        plogScheduleid: scheduleId,
        plogPlayernumber: playerNumber,
        plogPlayername: playerName,
        plogSchedulename: competition,
        plogScore: playerGrade === -1 ? '' : playerGrade,
        plogAdminname: adminName,
        plogAdminid: adminId
      };
    },
    destroy(row) {
      this.$confirm('确定要删除该人员吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deletePlogs(row.plogId);
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
    async addSubmit() {
      this.$refs.projectForm.validate(async (valid) => {
        if (valid) {
          const {
            plogId,
            plogPlayerid,
            plogScheduleid,
            plogScore,
            plogAdminid,
          } = this.projectForm;

          let func = null;
          let data = {};
          let admin = {};
          if (this.handleType === 'add') {
            admin = (await getAdmins()).find(item =>
              item.admin_name === this.$store.state.userName);
          }
          switch (this.handleType) {
            case 'add':
              data = {
                plogScheduleid,
                plogPlayerid,
                plogScore: -1,
                plogAdminid: admin.admin_id
              };
              func = postPlogs(data);
              break;

            case 'modify':
              data = {
                plogId,
                plogScheduleid,
                plogPlayerid,
                plogScore: plogScore || -1,
                plogAdminid,
              };
              func = putPlogs(plogId, data);
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
