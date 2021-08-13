import {
  bottomChartHeight,
  chartBackgroudColor,
  margin,
  topChartHeight,
} from "../utils/utils";

interface Props {
  companyTicker: string;
  getClassFromChartHover: () => string;
}

export const BottomChartElements = ({
  companyTicker,
  getClassFromChartHover,
}: Props) => {
  return (
    <g
      id={`bottom-chart-group-${companyTicker}`}
      transform={`translate(0,${topChartHeight + margin * 2})`}
    >
      <rect
        width="100%"
        height={bottomChartHeight}
        fill={chartBackgroudColor}
      ></rect>
      <g
        id={`x-axis-${companyTicker}`}
        className={getClassFromChartHover()}
      ></g>
      <g id={`y-axis-${companyTicker}`} className="opacity-80"></g>
      <g id={`area-${companyTicker}`} clipPath="url(#area-crop-left)"></g>
      <g id={`lines-${companyTicker}`}></g>
      <g id={`brush-${companyTicker}`}></g>
    </g>
  );
};
