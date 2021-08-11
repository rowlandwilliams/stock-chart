import { area, line } from "d3";
import { ConvertedData, StockValue } from "../../../../../types";
import { stockKeys, supernovaColors } from "../chart-utils";

export const getChartPlottingFunctions = (
  x: d3.ScaleTime<number, number, never>,
  y: d3.ScaleLinear<number, number, never>,
  y0Position: number
) => {
  return {
    plotStockLines: line<StockValue>()
      .x((d) => x(d.date))
      .y((d) => y(d.value)),
    plotStockArea: area<StockValue>()
      .x((d) => x(d.date))
      .y0(y0Position)
      .y1((d) => y(d.value)),
  };
};

export const plotChartStockLinesAndAreas = (
  areaGroup:
    | d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
    | d3.Selection<SVGSVGElement, unknown, SVGSVGElement, unknown>,
  convertedData: ConvertedData[],
  plotStockArea: d3.Area<StockValue>,
  linesGroup:
    | d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
    | d3.Selection<SVGSVGElement, unknown, SVGSVGElement, unknown>,
  plotStockLines: d3.Line<StockValue>
) => {
  areaGroup
    .selectAll("path")
    .data(convertedData)
    .join("path")
    .attr("fill", (d, i) => `url(#${stockKeys[i]}-top)`)
    .attr("stroke-svgWidth", 0)
    .transition()
    .duration(800)
    .attr("d", (d) => plotStockArea(d.values));

  linesGroup
    .selectAll("path")
    .data(convertedData)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", (d, i) => supernovaColors[i])
    .attr("stroke-svgWidth", "2px")
    .transition()
    .duration(800)
    .attr("d", (d) => plotStockLines(d.values));
};
