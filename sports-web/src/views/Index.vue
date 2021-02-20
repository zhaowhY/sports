<template>
  <el-container>
    <el-header class="header">
      <span class="header-title">体育赛事管理系统</span>
      <span class="header-name">{{$store.state.userName}}</span>
      <span class="header-logout"
            @click="logout">退出</span>
    </el-header>
    <el-container class="container">
      <el-aside width="140px"
                class="container-aside">
        <el-menu default-active="/project"
                 @open="handleOpen"
                 router
                 @close="handleClose">
          <el-menu-item index="/project">
            <span slot="title">项目类型</span>
          </el-menu-item>
          <el-menu-item index="/competition">
            <span slot="title">比赛项目</span>
          </el-menu-item>
          <el-menu-item index="/plog">
            <span slot="title">参赛记录</span>
          </el-menu-item>
          <el-menu-item index="/player">
            <span slot="title">运动员管理</span>
          </el-menu-item>
          <el-menu-item index="/admin"
                        v-if="adminType === '2'">
            <span slot="title">操作员管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  data: () => ({

  }),
  computed: {
    adminType() {
      return this.$store.state.adminType;
    }
  },
  created() {
    if (this.$store.state.userName === '') {
      this.$router.push('/');
    }
  },
  methods: {
    handleOpen() {

    },
    handleClose() {

    },
    logout() {
      this.$router.push('/');
    }
  }
};
</script>

<style lang="stylus" scoped>
.header
  height 60px !important
  line-height 60px
  font-size 22px
  position relative

.header-title
  font-weight bold
  color rgba(47, 84, 201, 1)

.header-name
  position absolute
  right 130px

.header-logout
  position absolute
  right 80px
  font-size 16px
  line-height 63px
  cursor pointer

  &:hover
    color blue

.container
  background rgba(245, 247, 250, 0.54) !important
  height 93.5vh

.container-aside
  height 100% !important
  background #EBEEF5
  font-size 18px
  font-weight bold

.el-menu
  border 0px
  background #EBEEF5
</style>
