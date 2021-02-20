'use strict';
// 操作员管理

const Controller = require('egg').Controller;

class PlogController extends Controller {
  async index() {
    const { ctx } = this;
    try {
      const result = await ctx.service.plog.index(ctx.query);
      ctx.status = 200;
      ctx.body = {
        code: 200,
        data: result,
      };
    } catch (error) {
      console.log(error);
      ctx.status = 500;
      ctx.body = {
        code: -2,
        data: '获取失败',
      };
    }
  }

  async create() {
    const { ctx } = this;
    try {
      const result = await ctx.service.plog.create(ctx.request.body);
      if (result) {
        ctx.status = 200;
        ctx.body = {
          code: 200,
          data: '添加成功',
        };
      } else {
        ctx.status = 403;
        ctx.body = {
          code: -1,
          data: '该参赛记录已经存在',
        };
      }
    } catch (error) {
      console.log(error);
      ctx.status = 500;
      ctx.body = {
        code: -2,
        data: '添加失败',
      };
    }
  }

  async update() {
    const { ctx } = this;
    try {
      await ctx.service.plog.update(ctx.request.body);
      ctx.status = 200;
      ctx.body = {
        code: 200,
        data: '修改成功',
      };
    } catch (error) {
      console.log(error);
      ctx.status = 500;
      ctx.body = {
        code: -2,
        data: '修改失败',
      };
    }
  }

  async destory() {
    const { ctx } = this;
    try {
      await ctx.service.plog.destory(ctx.params.id);
      ctx.status = 200;
      ctx.body = {
        code: 200,
        data: '删除成功',
      };
    } catch (error) {
      console.log(error);
      ctx.status = 500;
      ctx.body = {
        code: -2,
        data: '删除失败',
      };
    }
  }
}

module.exports = PlogController;
