import { combineReducers } from "redux";
import { topChartIsHoveredReducer } from "./topChartIsHoveredReducer";
import { visibleDatesReducer } from "./visibleDatesReducer";

export const allReducers = combineReducers({
  visibleDatesDomain: visibleDatesReducer,
  topChartIsHovered: topChartIsHoveredReducer,
});

export type RootState = ReturnType<typeof allReducers>;
