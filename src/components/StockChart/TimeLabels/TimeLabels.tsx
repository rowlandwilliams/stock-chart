import classNames from "classnames";
import { TimeLabel } from "../../../types";
import { timeLabels } from "../data/timeLabels";

interface Props {
  activeTimeLabelObject: TimeLabel;
  onTimeLabelClick: (labelObject: TimeLabel) => void;
}

export const TimeLabels = ({
  activeTimeLabelObject,
  onTimeLabelClick,
}: Props) => {
  return (
    <div className="flex">
      {timeLabels.map((labelObject) => (
        <div
          className={classNames(
            "ml-2 px-2 rounded-lg bg-opacity-20 cursor-pointer",
            {
              "bg-bar_colour text-white":
                activeTimeLabelObject.label === labelObject.label,
              "text-bar_colour text-opacity-20  hover:bg-bar_colour hover:bg-opacity-20 hover:text-chart_background":
                activeTimeLabelObject.label !== labelObject.label,
            }
          )}
          onClick={() => onTimeLabelClick(labelObject)}
        >
          {labelObject.label}
        </div>
      ))}
    </div>
  );
};
