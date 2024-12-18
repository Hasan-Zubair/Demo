import { combineReducers } from "redux";
import home from "../pages/Dashboard/redux/reducer";

// const presistConfig = {
//   key: "login",
//   storage
// }

export const combinedReducers = combineReducers({
  // login: persistReducer(presistConfig, login),
  home,
});
