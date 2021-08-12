import { area, line, selectAll, timeWeek } from "d3";
import { ConvertedData, StockValue } from "../../../../../types";
import {
  margin,
  stockKeys,
  supernovaColors,
  topChartHeight,
} from "../chart-utils";

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

export const plotTopChartStockLinesAndAreas = (
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

export const plotTopChartAxes = (
  xAxisGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  yAxisGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  xAxisTop: d3.Axis<d3.NumberValue | Date>,
  yAxisTop: d3.Axis<d3.NumberValue>
) => {
  // transition x axis

  xAxisGroupTop
    .attr("transform", `translate(0, ${topChartHeight - margin})`)
    .transition()
    .duration(800)
    .call(xAxisTop.ticks(5))
    .attr("text-anchor", "end");

  yAxisGroupTop
    .attr("transform", `translate(0, ${0})`)
    .transition()
    .duration(800)
    .call(yAxisTop)
    .on("start", () => {
      yAxisGroupTop.select(".domain").remove(); // remove axis line
      yAxisGroupTop
        .selectAll(".tick > line")
        .attr("opacity", 0.5)
        .style("stroke-dasharray", "5 5");
    })
    .selectAll("text")
    .attr("transform", "translate(4, -8)")
    .attr("text-anchor", "start");
};
