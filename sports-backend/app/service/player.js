'use strict';
const Service = require('egg').Service;

class PlayerService extends Service {
  async index(query) {
    const { app } = this;
    query.playerName = query.playerName || '';
    const sql = `select * from player where player_name like '%${query.playerName}%'`;
    return await app.mysql.query(sql);
  }

  async create(data) {
    const { app } = this;
    const {
      playerName,
      playerSex,
      playerBirthday,
      playerClass,
      playerStudentid,
      playerNumber,
    } = data;
    const allDatas = await app.mysql.select('player');
    const idx = allDatas.findIndex(item => {
      return item.player_number === playerNumber;
    });
    if (idx !== -1) {
      return false;
    }
    await app.mysql.insert('player', {
      player_name: playerName,
      player_sex: playerSex,
      player_birthday: playerBirthday,
      player_class: playerClass,
      player_studentid: playerStudentid,
      player_number: playerNumber,
    });
    return true;
  }

  async update(data) {
    const { app } = this;
    const {
      playerId,
      playerName,
      playerSex,
      playerBirthday,
      playerClass,
      playerStudentid,
      playerNumber,
    } = data;
    await app.mysql.update(
      'player',
      {
        player_id: playerId,
        player_name: playerName,
        player_sex: playerSex,
        player_birthday: playerBirthday,
        player_class: playerClass,
        player_studentid: playerStudentid,
        player_number: playerNumber,
      },
      {
        where: {
          player_id: playerId,
        },
      }
    );
  }

  async destory(id) {
    const { app } = this;
    await app.mysql.delete('plog', {
      plog_playerid: id,
    });
    await app.mysql.delete('player', {
      player_id: id,
    });
  }
}

module.exports = PlayerService;
