import * as d3 from "d3";
import { ConvertedData, StockValue } from "../../../../types";
import { bottomChartHeight, margin, supernovaColors } from "./chart-utils";

export const drawBottomChart = (
  companyName: string,
  width: number,
  bottomChartGroup: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  fullDatesDomain: number[],
  fullStocksDomain: number[],
  convertedData: ConvertedData[]
) => {
  const xAxisGroup = bottomChartGroup.select<SVGSVGElement>(
    `#x-axis-${companyName}`
  );

  const yAxisGroup = bottomChartGroup.select<SVGSVGElement>(
    `#y-axis-${companyName}`
  );

  const linesGroup = bottomChartGroup.selectAll<SVGSVGElement, unknown>(
    `#lines-${companyName}`
  );
  const xBottom = d3.scaleTime().domain(fullDatesDomain).range([0, width]);
  const yBottom = d3
    .scaleLinear()
    .domain(fullStocksDomain)
    .range([bottomChartHeight - margin, margin]);

  const xAxisBottom = d3.axisBottom(xBottom).tickSize(0);

  xAxisGroup
    .attr("transform", `translate(0, ${bottomChartHeight - margin})`)
    .call(xAxisBottom);

  const plotLinesBottom = d3
    .line<StockValue>()
    .x((d) => xBottom(d.date))
    .y((d) => yBottom(d.value));

  linesGroup
    .selectAll("path")
    .data(convertedData)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", (d, i) => supernovaColors[i])
    .attr("stroke-width", "0.5px")
    .transition()
    .duration(800)
    .attr("d", (d) => plotLinesBottom(d.values));
};
