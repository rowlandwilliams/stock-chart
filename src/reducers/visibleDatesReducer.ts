import { AnyAction } from "redux";

const intialState = [1595808000000, 1627344000000];

export const visibleDatesReducer = (state = intialState, action: AnyAction) => {
  switch (action.type) {
    case "CHANGEDOMAIN":
      return action.visibleDatesDomain;

    default:
      return state;
  }
};
