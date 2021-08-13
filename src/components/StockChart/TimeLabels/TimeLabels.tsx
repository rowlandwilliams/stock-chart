import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { changeVisibleDatesDomain } from "../../../actions";
import { RootState } from "../../../reducers";
import { TimeLabel } from "../../../types";
import { timeLabels } from "../data/timeLabels";

interface Props {
  activeTimeLabelObject: TimeLabel;
  onTimeLabelClick: (labelObject: TimeLabel) => void;
  latestDate: number;
}

export const TimeLabels = ({
  activeTimeLabelObject,
  onTimeLabelClick,
  latestDate,
}: Props) => {
  const dispatch = useDispatch();
  
  return (
    <div className="flex">
      {timeLabels.map((labelObject) => (
        <div
          className={classNames(
            "w-10 ml-2 text-center rounded-lg bg-opacity-20 cursor-pointer",
            {
              "bg-bar_colour text-white":
                activeTimeLabelObject.label === labelObject.label,
              "text-bar_colour text-opacity-20  hover:bg-bar_colour hover:bg-opacity-20 hover:text-chart_background":
                activeTimeLabelObject.label !== labelObject.label,
            }
          )}
          onClick={() => {
            onTimeLabelClick(labelObject);
            dispatch(
              changeVisibleDatesDomain([
                latestDate - labelObject.timescale,
                latestDate,
              ])
            );
          }}
        >
          {labelObject.label}
        </div>
      ))}
    </div>
  );
};
