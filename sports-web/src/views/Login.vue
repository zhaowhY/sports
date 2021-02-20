<template>
  <div class="wrapper">
    <div class="login">
      <p class="login-title">登陆</p>
      <el-form ref="form"
               :model="form"
               label-width="0"
               :rules="rules"
               size="medium">
        <el-form-item prop="name"
                      class="login-input">
          <el-input v-model.trim="form.name"
                    placeholder="请输入用户名"
                    style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item prop="password"
                      class="login-input">
          <el-input v-model.trim="form.password"
                    placeholder="请输入密码"
                    show-password
                    style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item class="login-button">
          <el-button type="primary"
                     @click="handleLogin">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { postLogin } from '@/api/demo.js';

export default {
  data: () => ({
    form: {
      name: 'admin',
      password: '123'
    },
    rules: {
      name: [
        { required: true, message: '请输入名称', trigger: 'change' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'change' }
      ],
    }
  }),
  methods: {
    handleLogin() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const {
            admin_type: type,
            admin_name: name
          } = await postLogin(this.form);
          if (type === '1' || type === '2') {
            this.$store.commit('SET_ADMIN_TYPE', type);
            this.$store.commit('SET_USER_NAME', name);
            this.$router.push('/project');
          } else {
            this.$message({
              message: '账号或密码错误',
              type: 'error',
              duration: 2000
            });
          }
        } else {
          return false;
        }
        return true;
      });
    }
  }
};
</script>


<style lang="stylus" scoped>
.wrapper
  width 100%
  height 100vh
  background #666
  position relative
  background url('../assets/backgrounImg.png') no-repeat
  background-size 100% 100%

.login
  position absolute
  width 100%
  top 25%

.login-title
  font-size 24px
  font-weight bold
  color rgba(0, 6, 32, 0.65)
  text-align center
  margin-bottom 24px

.login-input
  display block
  width 300px
  margin 0 auto
  margin-top 20px

.login-button
  text-align center
  margin-top 35px
</style>
