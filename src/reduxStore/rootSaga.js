import { all } from "redux-saga/effects";
import home from "../pages/Dashboard/redux/saga";

export function* rootSaga() {
  yield all([home]);
}
