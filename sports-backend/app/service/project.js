'use strict';
const Service = require('egg').Service;

class ProjectService extends Service {
  async index(query) {
    const { app } = this;
    if (!query.typeName) {
      query.typeName = '';
    }
    const sql = `select * from project where type_name like '%${query.typeName}%'`;
    return await app.mysql.query(sql);
  }

  async create(data) {
    const { app } = this;
    const { typeName, typeIntroduction } = data;
    const allDatas = await app.mysql.select('project');
    const idx = allDatas.findIndex(item => {
      return item.type_name === typeName;
    });
    if (idx !== -1) {
      return false;
    }
    await app.mysql.insert('project', {
      type_name: typeName,
      type_introduction: typeIntroduction,
    });
    return true;
  }

  async update(data) {
    const { app } = this;
    const { typeId, typeName, typeIntroduction } = data;
    await app.mysql.update(
      'project',
      {
        type_name: typeName,
        type_introduction: typeIntroduction,
      },
      {
        where: {
          type_id: typeId,
        },
      }
    );
  }

  async destory(id) {
    const { app } = this;
    const competitions = await app.mysql.select('competition', {
      where: {
        schedule_itemid: id,
      },
    });
    const deletePlogId = competitions.map(item => {
      return item.schedule_id;
    });
    deletePlogId.push(-1);
    await app.mysql.delete('plog', {
      plog_scheduleid: deletePlogId,
    });
    await app.mysql.delete('competition', {
      schedule_itemid: id,
    });
    await app.mysql.delete('project', {
      type_id: id,
    });
  }
}

module.exports = ProjectService;
