'use strict';
// 赛程管理

const Controller = require('egg').Controller;

class CompetitionController extends Controller {
  async index() {
    const { ctx } = this;
    try {
      const result = await ctx.service.competition.index(ctx.query);
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
      const result = await ctx.service.competition.create(ctx.request.body);
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
          data: '该赛程已经存在',
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
      await ctx.service.competition.update(ctx.request.body);
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

  async plan() {
    const { ctx } = this;
    try {
      await ctx.service.competition.plan(ctx.request.body);
      ctx.status = 200;
      ctx.body = {
        code: 200,
        data: '成功',
      };
    } catch (error) {
      console.log(error);
      ctx.status = 500;
      ctx.body = {
        code: -2,
        data: '失败',
      };
    }
  }

  async weather() {
    const { ctx } = this;
    const data = await ctx.curl(
      'http://t.weather.sojson.com/api/weather/city/101110101',
      {
        dataType: 'json',
      }
    );
    ctx.body = data;
    // ctx.service.competition.weather();
  }

  async destory() {
    const { ctx } = this;
    try {
      await ctx.service.competition.destory(ctx.params.id);
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

module.exports = CompetitionController;
