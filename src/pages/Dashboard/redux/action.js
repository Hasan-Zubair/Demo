import {
  GET_REQUEST_DASHBOARD,
  GET_REQUEST_DASHBOARD_SUCCESS,
  GET_REQUEST_DASHBOARD_FAILURE,
} from "./type";

// POST_PAYMENT_INFORMATION
export const getRequestHome = () => ({
  type: GET_REQUEST_DASHBOARD,
});

export const getRequestHomeSuccess = (data) => ({
  type: GET_REQUEST_DASHBOARD_SUCCESS,
  data,
});

export const getRequestHomeFailure = (data) => ({
  type: GET_REQUEST_DASHBOARD_FAILURE,
  data,
});
