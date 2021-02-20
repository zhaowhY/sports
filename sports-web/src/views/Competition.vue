<template>
  <div class="wrapper"
       v-loading="loading">
    <span class="margin-left-10 title-condition">快速查询:</span>
    <el-input placeholder="请输入项目名称"
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
               @click="addProject">新增项目</el-button>
    <el-button type="primary"
               size="small"
               class="plan-button"
               @click="aiPlan">智能安排项目</el-button>
    <el-table :data="tableData"
              class="table">
      <el-table-column prop="scheduleDate"
                       label="日期">
      </el-table-column>
      <el-table-column prop="scheduleName"
                       label="名称">
      </el-table-column>
      <el-table-column prop="scheduleItemname"
                       label="项目类型">
      </el-table-column>
      <el-table-column prop="scheduleStarttime"
                       label="开始时间">
      </el-table-column>
      <el-table-column prop="scheduleEndtime"
                       label="结束时间">
      </el-table-column>
      <el-table-column prop="scheduleIntroduction"
                       label="说明">
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

    <el-dialog title="新增赛程"
               :visible.sync="projectDialogVisible"
               width="40%">
      <el-form :model="projectForm"
               :rules="rules"
               label-width="100px"
               ref="projectForm"
               label-position="right"
               v-if="projectDialogVisible">
        <el-form-item label="所属项目: "
                      prop="scheduleItemid">
          <el-select v-model="projectForm.scheduleItemid"
                     placeholder="请选择项目">
            <el-option v-for="item of allPorjects"
                       :key="item.type_id"
                       :label="item.type_name"
                       :value="item.type_id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="名称: "
                      prop="scheduleName">
          <el-input v-model="projectForm.scheduleName"
                    placeholder="请输入赛程名称"></el-input>
        </el-form-item>

        <el-form-item label="日期: "
                      prop="scheduleDate"
                      v-if="handleType!='add'">
          <el-date-picker v-model="projectForm.scheduleDate"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开始时间: "
                      prop="scheduleStarttime"
                      v-if="handleType!='add'">
          <el-time-select v-model="projectForm.scheduleStarttime"
                          :picker-options="{
                            start: '09:00',
                            step: '00:15',
                            end: '18:00'
                          }"
                          placeholder="选择时间">
          </el-time-select>
        </el-form-item>
        <el-form-item label="结束时间: "
                      prop="scheduleEndtime"
                      v-if="handleType!='add'">
          <el-time-select v-model="projectForm.scheduleEndtime"
                          :picker-options="{
                            start: '09:00',
                            step: '00:15',
                            end: '18:00'
                          }"
                          placeholder="选择时间">
          </el-time-select>
        </el-form-item>

        <el-form-item label="赛程说明: "
                      prop="scheduleIntroduction">
          <el-input v-model="projectForm.scheduleIntroduction"
                    placeholder="请输入赛程名称"
                    type="textarea"
                    :rows="7"></el-input>
        </el-form-item>

        <el-form-item>
          <div class="submit-button">
            <el-button type="primary"
                       @click="addSubmit">确认</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="智能安排赛事"
               :visible.sync="planDialogVisible"
               width="40%">
      <el-form :model="aiData"
               :rules="rules"
               label-width="100px"
               ref="projectForm"
               label-position="right"
               v-if="planDialogVisible">

        <el-form-item label="比赛日期: "
                      prop="">
          <el-date-picker v-model="aiData.date"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="比赛时间: "
                      prop="">
          <el-time-select placeholder="起始时间"
                          v-model="aiData.startTime"
                          :picker-options="{
                          start: '08:30',
                          step: '00:15',
                          end: '19:30'
                        }">
          </el-time-select>
          <el-time-select placeholder="结束时间"
                          v-model="aiData.endTime"
                          :picker-options="{
                          start: '08:30',
                          step: '00:15',
                          end: '19:30'
                        }">
          </el-time-select>
        </el-form-item>

        <el-form-item label="是否根据天气: "
                      prop="">
          <el-switch v-model="aiData.isWeather"
                     active-color="#13ce66"
                     inactive-color="#ff4949">
          </el-switch>

        </el-form-item>

        <el-form-item label="选择城市: "
                      prop=""
                      v-show="aiData.isWeather">
          <el-select v-model="aiData.code"
                     filterable
                     placeholder="请选择城市">
            <el-option v-for="(item, index) in citycode"
                       :key="index"
                       :label="item.city_name"
                       :value="item.city_code">
            </el-option>
          </el-select>
        </el-form-item>

        <div v-for="(item,index) of tableData"
             :key="index">
          <el-form-item :label="item.scheduleName">
            <el-input v-model="item.duration"
                      placeholder="请输入比赛持续时间（单位为分钟),如90"></el-input>
          </el-form-item>
        </div>
        <el-form-item>
          <div class="submit-button">
            <el-button type="primary"
                       @click="planSubmit">确认</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getProjects,
  getCompetitions,
  postCompetitions,
  putCompetitions,
  deleteCompetitions,
  putPlans
} from '@/api/demo.js';
import citycode from '@/assets/json/citycode.json';

export default {
  data: () => ({
    projectForm: {
      scheduleDate: '',
      scheduleName: '',
      scheduleItemid: '',
      scheduleStarttime: '',
      scheduleEndtime: '',
      scheduleIntroduction: '',
    },
    citycode,
    aiData: {
      date: [],
      startTime: '',
      endTime: '',
      isWeather: false,
      code: '101110101',
      projects: [
        {
          id: null,
          data: [
            {
              id: null,
              duration: ''
            }
          ]
        }
      ]
    },
    planDialogVisible: false,
    loading: false,
    allPorjects: [],
    searchName: '',
    handleType: '',
    rules: {
      scheduleItemid: [
        { required: true, message: '请选择项目', trigger: 'change' }
      ],
      scheduleName: [
        { required: true, message: '请输入名称', trigger: 'change' }
      ],
      scheduleDate: [
        { required: true, message: '请选择创建日期', trigger: 'change' }
      ],
      scheduleStarttime: [
        { required: true, message: '请选择开始时间', trigger: 'change' }
      ],
      scheduleEndtime: [
        { required: true, message: '请选择结束时间', trigger: 'change' }
      ],
      scheduleIntroduction: [
        { required: true, message: '请输入赛程说明', trigger: 'change' }
      ],
    },
    projectDialogVisible: false,
    tableData: []
  }),
  async  created() {
    this.loading = true;
    this.allPorjects = await getProjects();
    this.getPorjects();
  },
  methods: {
    async  getPorjects(params) {
      this.loading = true;
      const data = await getCompetitions(params || {});
      this.loading = false;
      this.tableData = data.map(item => ({
        scheduleId: item.schedule_id,
        scheduleItemid: item.schedule_itemid,
        scheduleItemname: item.schedule_itemname,
        scheduleName: item.schedule_name,
        scheduleDate: item.schedule_date || '',
        scheduleStarttime: (item.schedule_starttime || '').slice(0, 5),
        scheduleEndtime: (item.schedule_endtime || '').slice(0, 5),
        scheduleIntroduction: item.schedule_introduction
      }));
      // eslint-disable-next-line
      this.tableData.sort((a, b) => Number(a.scheduleItemid) - Number(b.scheduleItemid));
    },
    async  planSubmit() {
      this.aiData.projects = this.allPorjects.map((project) => {
        const data = [];
        this.tableData.forEach((com) => {
          if (com.scheduleItemid === project.type_id) {
            data.push({
              id: com.scheduleId,
              duration: com.duration
            });
          }
        });
        return {
          id: project.type_id,
          data
        };
      });
      try {
        this.loading = true;
        await putPlans(this.aiData);
        this.$message({
          type: 'success',
          message: '智能安排成功!',
          duration: 2000
        });
      } catch (error) {
        this.$message({
          type: 'error',
          message: '安排失败，可能因为填写时间格式不对!',
          duration: 2000
        });
      }
      this.loading = false;
      this.getPorjects();
      this.planDialogVisible = false;
    },
    addProject() {
      this.handleType = 'add';
      this.projectForm = {
        scheduleId: null,
        scheduleItemid: '',
        scheduleName: '',
        scheduleDate: '',
        scheduleStarttime: '',
        scheduleEndtime: '',
        scheduleIntroduction: ''
      };
      this.projectDialogVisible = true;
    },
    aiPlan() {
      this.planDialogVisible = true;
    },
    search() {
      this.getPorjects({ scheduleName: this.searchName });
    },
    modify(row) {
      this.handleType = 'modify';
      this.projectDialogVisible = true;
      this.projectForm = { ...row };
    },
    destroy(row) {
      this.$confirm('确定要删除该赛程吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deleteCompetitions(row.scheduleId);
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
            scheduleId,
            scheduleItemid,
            scheduleName,
            scheduleDate,
            scheduleStarttime,
            scheduleEndtime,
            scheduleIntroduction
          } = this.projectForm;

          let func = null;
          let data = {};
          switch (this.handleType) {
            case 'add':
              data = {
                scheduleItemid,
                scheduleName,
                scheduleDate,
                scheduleStarttime,
                scheduleEndtime,
                scheduleIntroduction
              };
              func = postCompetitions(data);
              break;

            case 'modify':
              data = {
                scheduleId,
                scheduleItemid,
                scheduleName,
                scheduleDate,
                scheduleStarttime,
                scheduleEndtime,
                scheduleIntroduction
              };
              func = putCompetitions(scheduleId, data);
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
              message: '该赛程已经存在',
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

.plan-button
  position absolute
  right 190px

.table
  margin-top 20px
</style>
