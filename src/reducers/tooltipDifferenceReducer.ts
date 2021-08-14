import { AnyAction } from "redux";
import { TooltipDifferenceObject } from "../types";

const intialState: TooltipDifferenceObject = {
  high: 0,
  open: 0,
  close: 0,
  low: 0,
};

export const tooltipDifferenceReducer = (
  state = intialState,
  action: AnyAction
) => {
  switch (action.type) {
    case "CHANGETOOLTIPDIFFERENCE":
      return {
        ...state,
        high: action.tooltipDifferences.high,
        open: action.tooltipDifferences.open,
        close: action.tooltipDifferences.close,
        low: action.tooltipDifferences.low,
      };
    default:
      return state;
  }
};
