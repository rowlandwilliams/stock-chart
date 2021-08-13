import {
  bottomChartHeight,
  chartBackgroudColor,
  margin,
  topChartHeight,
} from "../utils/utils";

interface Props {
  companyName: string;
  getClassFromChartHover: () => string;
}

export const BottomChartElements = ({
  companyName,
  getClassFromChartHover,
}: Props) => {
  return (
    <g
      id={`bottom-chart-group-${companyName}`}
      transform={`translate(0,${topChartHeight + margin * 2})`}
    >
      <rect
        width="100%"
        height={bottomChartHeight}
        fill={chartBackgroudColor}
      ></rect>
      <g id={`x-axis-${companyName}`} className={getClassFromChartHover()}></g>
      <g id={`y-axis-${companyName}`} className="opacity-80"></g>
      <g id={`area-${companyName}`} clipPath="url(#area-crop-left)"></g>
      <g id={`lines-${companyName}`}></g>
      <g id={`brush-${companyName}`}></g>
    </g>
  );
};
