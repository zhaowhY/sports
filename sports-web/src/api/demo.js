import { demo } from './adapter';

export const getPing = async () => await demo.get('./ping');

// 登陆模块
export const postLogin = async data => await demo.post('/login', data);

// 项目管理模块
export const getProjects = async params =>
  await demo.get('/projects', { params });
export const postProjects = async data => await demo.post('/projects', data);
export const putProjects = async (id, data) =>
  await demo.put(`/projects/${id}`, data);
export const deleteProjects = async id => await demo.delete(`/projects/${id}`);

// 赛程管理模块
export const getCompetitions = async params =>
  await demo.get('/competitions', { params });
export const postCompetitions = async data =>
  await demo.post('/competitions', data);
export const putCompetitions = async (id, data) =>
  await demo.put(`/competitions/${id}`, data);

export const putPlans = async data =>
  await demo.put('/competitions/aiplan', data);
export const deleteCompetitions = async id =>
  await demo.delete(`/competitions/${id}`);

// 运动员管理模块
export const getPlayers = async params =>
  await demo.get('/players', {
    params
  });
export const postPlayers = async data => await demo.post('/players', data);
export const putPlayers = async (id, data) =>
  await demo.put(`/players/${id}`, data);
export const deletePlayers = async id => await demo.delete(`/players/${id}`);

// 管理员管理模块
export const getAdmins = async params => await demo.get('/admins', { params });
export const postAdmins = async data => await demo.post('/admins', data);
export const putAdmins = async (id, data) =>
  await demo.put(`/admins/${id}`, data);
export const deleteAdmins = async id => await demo.delete(`/admins/${id}`);

// 参赛管理模块
export const getPlogs = async params => await demo.get('/plogs', { params });
export const postPlogs = async data => await demo.post('/plogs', data);
export const putPlogs = async (id, data) =>
  await demo.put(`/plogs/${id}`, data);
export const deletePlogs = async id => await demo.delete(`/plogs/${id}`);
