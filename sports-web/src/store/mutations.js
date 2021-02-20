export const SYNC_CURRENT_TIME = (state) => {
  state.currentTime = Date.now();
};
export const SET_ADMIN_TYPE = (state, data) => {
  state.adminType = data;
};
export const SET_USER_NAME = (state, data) => {
  state.userName = data;
};
