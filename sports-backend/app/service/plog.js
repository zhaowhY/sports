'use strict';
const Service = require('egg').Service;

class PlogService extends Service {
  async index(query) {
    const { app } = this;
    let { plogSearch } = query;
    plogSearch = plogSearch || '';
    const playerSql = `select * from player where  
    player_name like '%${plogSearch}%' or
    player_number like '%${plogSearch}%'`;
    const playerIds = (await app.mysql.query(playerSql)).map(item => {
      return item.player_id;
    });

    const competitionSql = `select * from competition where  
    schedule_name like '%${plogSearch}%'`;
    const competitionIds = (await app.mysql.query(competitionSql)).map(item => {
      return item.schedule_id;
    });
    let resSql = 'select * from plog';
    const middle = [];
    if (playerIds.length > 0) {
      middle.push(`plog_playerid in (${playerIds.join(',')})`);
    }
    if (competitionIds.length > 0) {
      middle.push(`plog_scheduleid in (${competitionIds.join(',')})`);
    }
    if (middle.length > 0) resSql += ` where ${middle.join(' or ')}`;
    const res = await app.mysql.query(resSql);

    const players = await app.mysql.select('player');
    const competitions = await app.mysql.select('competition');
    const admins = await app.mysql.select('admin');
    return res.map(resItem => {
      const playElement = players.find(player => {
        return resItem.plog_playerid === player.player_id;
      });
      const comElement = competitions.find(com => {
        return resItem.plog_scheduleid === com.schedule_id;
      });
      const adminElement = admins.find(admin => {
        return resItem.plog_adminid === admin.admin_id;
      });
      return {
        plog_playernumber: playElement.player_number,
        plog_playername: playElement.player_name,
        plog_schedulename: comElement.schedule_name,
        plog_adminname: adminElement.admin_name,
        ...resItem,
      };
    });
  }

  async create(data) {
    const { app } = this;
    const { plogPlayerid, plogScheduleid, plogScore, plogAdminid } = data;
    const allDatas = await app.mysql.select('plog');
    const idx = allDatas.findIndex(item => {
      return (
        item.plog_scheduleid === plogScheduleid &&
        item.plog_playerid === plogPlayerid
      );
    });
    if (idx !== -1) {
      return false;
    }
    await app.mysql.insert('plog', {
      plog_playerid: plogPlayerid,
      plog_scheduleid: plogScheduleid,
      plog_score: plogScore,
      plog_adminid: plogAdminid,
    });
    return true;
  }

  async update(data) {
    const { app } = this;
    const {
      plogId,
      plogPlayerid,
      plogScheduleid,
      plogScore,
      plogAdminid,
    } = data;
    await app.mysql.update(
      'plog',
      {
        plog_id: plogId,
        plog_playerid: plogPlayerid,
        plog_scheduleid: plogScheduleid,
        plog_score: plogScore,
        plog_adminid: plogAdminid,
      },
      {
        where: {
          plog_id: plogId,
        },
      }
    );
  }

  async destory(id) {
    const { app } = this;
    return await app.mysql.delete('plog', {
      plog_id: id,
    });
  }
}

module.exports = PlogService;
