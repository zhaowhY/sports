'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 登陆模块
  router.get('/', controller.login.index);
  router.post('/login', controller.login.login);

  // 运动员管理
  router.get('/players', controller.player.index);
  router.post('/players', controller.player.create);
  router.put('/players/:id', controller.player.update);
  router.delete('/players/:id', controller.player.destory);

  // 管理员管理
  router.get('/admins', controller.admin.index);
  router.post('/admins', controller.admin.create);
  router.put('/admins/:id', controller.admin.update);
  router.delete('/admins/:id', controller.admin.destory);

  // 项目管理
  router.get('/projects', controller.project.index);
  router.post('/projects', controller.project.create);
  router.put('/projects/:id', controller.project.update);
  router.delete('/projects/:id', controller.project.destory);

  // 赛程管理
  router.get('/competitions', controller.competition.index);
  router.post('/competitions', controller.competition.create);
  router.put('/competitions/aiplan', controller.competition.plan);
  router.put('/competitions/:id', controller.competition.update);
  router.delete('/competitions/:id', controller.competition.destory);

  // 参赛管理
  router.get('/plogs', controller.plog.index);
  router.post('/plogs', controller.plog.create);
  router.put('/plogs/:id', controller.plog.update);
  router.delete('/plogs/:id', controller.plog.destory);

  router.get('/test', controller.competition.weather);
};
