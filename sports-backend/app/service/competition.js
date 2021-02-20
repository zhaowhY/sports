'use strict';
const Service = require('egg').Service;

class CompetitionService extends Service {
  async index(query) {
    const { app } = this;
    query.scheduleName = query.scheduleName || '';
    const sql = `select * from competition where schedule_name like '%${query.scheduleName}%'`;
    const res = await app.mysql.query(sql);
    const projects = await app.mysql.select('project');
    return res.map(item => {
      const element = projects.find(pro => {
        return pro.type_id === item.schedule_itemid;
      });
      return {
        schedule_itemname: element.type_name,
        ...item,
      };
    });
  }

  async create(data) {
    const { app } = this;
    const { scheduleItemid, scheduleName, scheduleIntroduction } = data;
    const allDatas = await app.mysql.select('competition');
    const idx = allDatas.findIndex(item => {
      return item.schedule_name === scheduleName;
    });
    if (idx !== -1) {
      return false;
    }
    await app.mysql.insert('competition', {
      schedule_itemid: scheduleItemid,
      schedule_name: scheduleName,
      schedule_introduction: scheduleIntroduction,
    });
    return true;
  }

  async update(data) {
    const { app } = this;
    const {
      scheduleId,
      scheduleItemid,
      scheduleName,
      scheduleDate,
      scheduleStarttime,
      scheduleEndtime,
      scheduleIntroduction,
    } = data;
    await app.mysql.update(
      'competition',
      {
        schedule_id: scheduleId,
        schedule_itemid: scheduleItemid,
        schedule_name: scheduleName,
        schedule_date: scheduleDate,
        schedule_starttime: scheduleStarttime,
        schedule_endtime: scheduleEndtime,
        schedule_introduction: scheduleIntroduction,
      },
      {
        where: {
          schedule_id: scheduleId,
        },
      }
    );
  }

  async plan(data) {
    const { app } = this;
    // aiData: {
    //   date: [],
    //   startTime:'',
    //   endTime: '',
    //   projects: [
    //         {
    //           id: null,
    //           data: [
    //             {
    //               id: null,
    //               duration: ''
    //             }
    //           ]
    //         }
    //       ]
    // },
    // console.log(data);
    const { date, startTime, endTime, projects, code, isWeather } = data;
    const start =
      Number(startTime.split(':')[0]) * 60 + Number(startTime.split(':')[1]);
    const end =
      Number(endTime.split(':')[0]) * 60 + Number(endTime.split(':')[1]);
    const curDate = new Date(date[0]);
    let curTime = start;
    projects.forEach(project => {
      project.data.forEach(item => {
        let previous = curTime;
        curTime = curTime + Number(item.duration); // 结束时间
        if (curTime > end) {
          curDate.setDate(curDate.getDate() + 1);
          previous = start;
          curTime = previous + Number(item.duration);
        }
        // 执行sql语句
        app.mysql.update(
          'competition',
          {
            schedule_date: curDate,
            schedule_starttime: `${parseInt(previous / 60)}:${previous % 60}`,
            schedule_endtime: `${parseInt(curTime / 60)}:${curTime % 60}`,
          },
          {
            where: {
              schedule_id: item.id,
            },
          }
        );
      });
    });
    clearTimeout(this.app.config.timer);
    if (isWeather) {
      await this.weather(code);
      this.app.config.timer = setInterval(() => {
        this.weather(code);
      }, 60 * 60 * 60 * 24);
    }
  }

  async weather(code) {
    const { app, ctx } = this;
    let comData = await app.mysql.select('competition');
    const {
      data: {
        data: { forecast },
      },
    } = await ctx.curl(`http://t.weather.sojson.com/api/weather/city/${code}`, {
      dataType: 'json',
    });
    forecast.forEach(item => {
      if (item.type.includes('雨')) {
        const flag = comData.findIndex(com => {
          return com.schedule_date === item.ymd;
        });
        if (flag !== -1) {
          comData = comData.map(com => {
            if (com.schedule_date >= item.ymd) {
              com.schedule_date = new Date(com.schedule_date);
              com.schedule_date.setDate(com.schedule_date.getDate() + 1);
              com.schedule_date = ctx.helper.timeFormat(
                com.schedule_date,
                'YYYY-MM-DD'
              );
              // 执行sql语句
            }
            return com;
          });
        }
      }
    });
    comData.forEach(com => {
      app.mysql.update(
        'competition',
        {
          schedule_date: com.schedule_date,
        },
        {
          where: {
            schedule_id: com.schedule_id,
          },
        }
      );
    });
  }

  async destory(id) {
    const { app } = this;
    await app.mysql.delete('plog', {
      plog_scheduleid: id,
    });
    await app.mysql.delete('competition', {
      schedule_id: id,
    });
  }
}

module.exports = CompetitionService;
