import { AnyAction } from "redux";

const intialState = false;

export const topChartIsHoveredReducer = (
  state = intialState,
  action: AnyAction
) => {
  switch (action.type) {
    case "CHANGECHARTHOVER":
      return action.topChartIsHovered;

    default:
      return state;
  }
};
