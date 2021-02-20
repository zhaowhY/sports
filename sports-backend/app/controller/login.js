'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
  async index() {
    const { ctx } = this;
    this.app.config.timer = {};
    ctx.redirect('/index.html');
  }
  async login() {
    const { ctx } = this;
    try {
      const result = await ctx.service.login.login(ctx.request.body);
      if (result) {
        ctx.status = 200;
        ctx.body = {
          code: 200,
          data: result,
        };
      } else {
        ctx.status = 403;
        ctx.body = {
          code: -1,
          data: '账号或密码错误',
        };
      }
    } catch (error) {
      console.log(error);
      ctx.status = 500;
      ctx.body = {
        code: -2,
        data: '登陆失败',
      };
    }
  }
}

module.exports = LoginController;
