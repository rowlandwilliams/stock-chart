import { margin, topChartHeight } from "../utils/utils";

interface Props {
  companyName: string;
  getClassFromChartHover: () => string;
}

export const TopChartElements = ({
  companyName,
  getClassFromChartHover,
}: Props) => {
  return (
    <g
      id={`top-chart-group-${companyName}`}
      height={topChartHeight}
      transform={`translate(0,${margin})`}
    >
      <g id={`x-axis-${companyName}`} className={getClassFromChartHover()}></g>
      <g id={`y-axis-${companyName}`} className={getClassFromChartHover()}></g>
      <g id={`area-${companyName}`}></g>
      <g id={`lines-${companyName}`}></g>
      <g id={`focus-${companyName}`}>
        <line></line>
        <rect></rect>
      </g>
    </g>
  );
};
