import { AnyAction } from "redux";

export const visibleDatesReducer = (state = [100, 100], action: AnyAction) => {
  switch (action.type) {
    case "CHANGEDOMAIN":
      return state.map((x) => x + 1);

    default:
      return state;
  }
};
