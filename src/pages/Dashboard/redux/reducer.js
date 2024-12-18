import {
  GET_REQUEST_DASHBOARD,
  GET_REQUEST_DASHBOARD_SUCCESS,
  GET_REQUEST_DASHBOARD_FAILURE,
} from "./type";

const initialState = {
  getHomeInfo: false,
  error: false,
  requesting: false,
};

const home = (state = initialState, action) => {
  switch (action.type) {
    case GET_REQUEST_DASHBOARD:
      return {
        ...state,
        requesting: true,
      };
    case GET_REQUEST_DASHBOARD_SUCCESS:
      return {
        ...state,
        requesting: false,
        getHomeInfo: action.data,
      };
    case GET_REQUEST_DASHBOARD_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.data,
      };
    default:
      return state;
  }
};
export default home;
