import { combineReducers } from "redux";
import { visibleDatesReducer } from "./visibleDatesReducer";

export const allReducers = combineReducers({
  visibleDatesDomain: visibleDatesReducer,
});

export type RootState = ReturnType<typeof allReducers>;
