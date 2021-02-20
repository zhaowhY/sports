'use strict';

const Controller = require('egg').Controller;

class ProjectController extends Controller {
  async index() {
    const { ctx } = this;
    try {
      const result = await ctx.service.project.index(ctx.query);
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
      const result = await ctx.service.project.create(ctx.request.body);
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
          data: '该项目已经存在',
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
      await ctx.service.project.update(ctx.request.body);
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
      await ctx.service.project.destory(ctx.params.id);
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

module.exports = ProjectController;
