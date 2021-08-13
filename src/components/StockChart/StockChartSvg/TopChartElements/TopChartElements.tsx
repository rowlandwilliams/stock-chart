import { useDispatch } from "react-redux";
import { setTopChartIsHovered } from "../../../../actions";
import { margin, topChartHeight } from "../utils/utils";

interface Props {
  companyTicker: string;
  getClassFromChartHover: () => string;
}

export const TopChartElements = ({
  companyTicker,
  getClassFromChartHover,
}: Props) => {
  const dispatch = useDispatch();
  return (
    <g
      id={`top-chart-group-${companyTicker}`}
      height={topChartHeight}
      transform={`translate(0,${margin})`}
      onMouseOver={() => dispatch(setTopChartIsHovered(true))}
      onMouseOut={() => dispatch(setTopChartIsHovered(false))}
    >
      <g
        id={`x-axis-${companyTicker}`}
        className={getClassFromChartHover()}
      ></g>
      <g
        id={`y-axis-${companyTicker}`}
        className={getClassFromChartHover()}
      ></g>
      <g id={`area-${companyTicker}`}></g>
      <g id={`lines-${companyTicker}`}></g>
      <g id={`focus-${companyTicker}`}>
        <line></line>
        <rect></rect>
      </g>
    </g>
  );
};
