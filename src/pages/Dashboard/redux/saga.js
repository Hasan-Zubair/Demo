import { all, call, put, takeLatest } from "redux-saga/effects";
// import AsyncStorage from '@react-native-community/async-storage';

// utils
import XHR from "../../../utils/XHR";
// types
import { GET_REQUEST_DASHBOARD } from "./type";
// actions
import { getRequestHomeSuccess, getRequestHomeFailure } from "./action";
// config
const BASE_URL = "www.some.com/";

async function getHomeAPI() {
  const URL = `${BASE_URL}api/v1/home/`;
  const token = await localStorage.getItem("token");

  const options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    method: "GET",
  };
  return XHR(URL, options);
}

function* getRequestHome() {
  try {
    const response = yield call(getHomeAPI);
    yield put(getRequestHomeSuccess(response.data));
  } catch (e) {
    const { response } = e;
    yield put(getRequestHomeFailure(response.data));
  }
}

export default all([takeLatest(GET_REQUEST_DASHBOARD, getRequestHome)]);
