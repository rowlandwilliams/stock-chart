import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { changeVisibleDatesDomain } from "../../../actions";
import { RootState } from "../../../reducers";
import { timeLabels } from "../data/timeLabels";

interface Props {
  latestDate: number;
}

export const TimeLabels = ({ latestDate }: Props) => {
  const dispatch = useDispatch();
  const { visibleDatesDomain } = useSelector((state: RootState) => state);

  return (
    <div className="flex">
      {timeLabels.map((labelObject) => (
        <div
          className={classNames(
            "w-10 ml-2 text-center rounded-lg bg-opacity-20 cursor-pointer",
            {
              "bg-bar_colour text-white":
                labelObject.domain[0] === visibleDatesDomain[0],
              "text-bar_colour text-opacity-20  hover:bg-bar_colour hover:bg-opacity-20 hover:text-chart_background":
                labelObject.domain[0] !== visibleDatesDomain[0],
            }
          )}
          onClick={() => {
            dispatch(
              changeVisibleDatesDomain([
                latestDate - labelObject.timescale,
                latestDate,
              ])
            );
          }}
          key={labelObject.label}
        >
          {labelObject.label}
        </div>
      ))}
    </div>
  );
};
