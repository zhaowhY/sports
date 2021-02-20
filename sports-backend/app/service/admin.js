'use strict';
const Service = require('egg').Service;

class AdminService extends Service {
  async index(query) {
    const { app } = this;
    query.adminName = query.adminName || '';
    const sql = `select * from admin where admin_name like '%${query.adminName}%'`;
    return await app.mysql.query(sql);
  }

  async create(data) {
    const { app } = this;
    const {
      adminUsername,
      adminPassword,
      adminType,
      adminName,
      adminSex,
    } = data;
    const allDatas = await app.mysql.select('admin');
    const idx = allDatas.findIndex(item => {
      return item.admin_username === adminUsername;
    });
    if (idx !== -1) {
      return false;
    }
    await app.mysql.insert('admin', {
      admin_username: adminUsername,
      admin_password: adminPassword,
      admin_type: adminType,
      admin_name: adminName,
      admin_sex: adminSex,
    });
    return true;
  }

  async update(data) {
    const { app } = this;
    const {
      adminId,
      adminUsername,
      adminPassword,
      adminType,
      adminName,
      adminSex,
    } = data;
    await app.mysql.update(
      'admin',
      {
        admin_id: adminId,
        admin_username: adminUsername,
        admin_password: adminPassword,
        admin_type: adminType,
        admin_name: adminName,
        admin_sex: adminSex,
      },
      {
        where: {
          admin_id: adminId,
        },
      }
    );
  }

  async destory(id) {
    const { app } = this;
    await app.mysql.delete('plog', {
      plog_adminid: id,
    });
    await app.mysql.delete('admin', {
      admin_id: id,
    });
  }
}

module.exports = AdminService;
