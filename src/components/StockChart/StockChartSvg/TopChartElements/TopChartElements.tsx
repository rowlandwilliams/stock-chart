import { margin, topChartHeight } from "../utils/utils";

interface Props {
  companyTicker: string;
  getClassFromChartHover: () => string;
}

export const TopChartElements = ({
  companyTicker,
  getClassFromChartHover,
}: Props) => {
  return (
    <g
      id={`top-chart-group-${companyTicker}`}
      height={topChartHeight}
      transform={`translate(0,${margin})`}
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
