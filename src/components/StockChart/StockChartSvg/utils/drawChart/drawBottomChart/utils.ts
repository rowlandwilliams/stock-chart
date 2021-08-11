import { axisBottom, scaleLinear, scaleTime } from "d3";
import { bottomChartHeight, margin } from "../../chart-utils";

export const getBottomChartSelections = (
  companyName: string,
  bottomChartGroup: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
) => {
  return {
    xAxisGroupBottom: bottomChartGroup.select<SVGSVGElement>(
      `#x-axis-${companyName}`
    ),
    linesGroupBottom: bottomChartGroup.selectAll<SVGSVGElement, unknown>(
      `#lines-${companyName}`
    ),
    areaGroupBottom: bottomChartGroup.selectAll<SVGSVGElement, unknown>(
      `#area-${companyName}`
    ),
    brushGroup: bottomChartGroup.select<SVGSVGElement>(`#brush-${companyName}`),
  };
};

export const getBottomChartScalesAndAxes = (
  fullDatesDomain: number[],
  fullStocksDomain: number[],
  width: number
) => {
  // define x and y scale for bottom graph
  const xBottom = scaleTime().domain(fullDatesDomain).range([0, width]);

  return {
    xBottom: xBottom,
    yBottom: scaleLinear()
      .domain(fullStocksDomain)
      .range([bottomChartHeight - margin, margin]),
    xAxisBottom: axisBottom(xBottom).tickSize(0),
  };
};