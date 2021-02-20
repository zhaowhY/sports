'use strict';
const Service = require('egg').Service;

class LoginService extends Service {
  async login(data) {
    const { app } = this;
    const { name, password } = data;
    const res = await app.mysql.select('admin', {
      where: {
        admin_username: name,
        admin_password: password,
      },
    });
    if (res) {
      return res[0];
    }
    return false;
  }
}

module.exports = LoginService;
