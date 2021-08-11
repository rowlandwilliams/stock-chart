import { area, BrushBehavior, line, ScaleTime, select } from "d3";
import {
  ConvertedData,
  StockData,
  StockValue,
} from "../../../../../../../types";
import {
  margin,
  stockKeys,
  supernovaColors,
  topChartHeight,
} from "../../../chart-utils";
import { getBrushedMinMaxStock } from "../../../data-utils";
import {
  clipBottomChartAreaToBrush,
  updateTopChartAxesFromBrush,
} from "./utils";

export const updateTopChart = (
  event: any,
  xBottom: ScaleTime<number, number, never>,
  stockData: StockData[],
  xAxisGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  xTop: d3.ScaleTime<number, number, never>,
  xAxisTop: d3.Axis<d3.NumberValue | Date>,
  linesGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  convertedData: ConvertedData[],
  yAxisGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  yTop: d3.ScaleLinear<number, number, never>,
  yAxisTop: d3.Axis<d3.NumberValue>,
  brushGroup: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  brush: BrushBehavior<unknown>,
  width: number,
  areaGroupTop: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
) => {
  // get extent of brush selection
  const selection = { event };
  const extent = selection.event.selection;

  if (!extent) return;

  const brushedDatesDomain = extent.map((x: number) =>
    xBottom.invert(x).getTime()
  );

  clipBottomChartAreaToBrush(xBottom, brushedDatesDomain);

  // calculate new stocks domain based on brushed dates
  const brushedStocksDomain = getBrushedMinMaxStock(
    stockData,
    brushedDatesDomain[1],
    brushedDatesDomain[0]
  );

  updateTopChartAxesFromBrush(
    xTop,
    brushedDatesDomain,
    yTop,
    brushedStocksDomain,
    xAxisGroupTop,
    yAxisGroupTop,
    xAxisTop,
    yAxisTop
  );

  //
  xAxisGroupTop
    .transition()
    .duration(800)
    .call(xAxisTop)
    .attr("text-anchor", "end");

  yAxisGroupTop
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

  const plotLine = line<StockValue>()
    .x((d) => xTop(d.date))
    .y((d) => yTop(d.value));

  linesGroupTop
    .selectAll("path")
    .data(convertedData)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", (d, i) => supernovaColors[i])
    .attr("stroke-width", "2px")
    .transition()
    .duration(800)
    .attr("d", (d) => plotLine(d.values));

  const plotArea = area<StockValue>()
    .x((d) => xTop(d.date))
    .y0(topChartHeight - margin)
    .y1((d) => yTop(d.value));

  areaGroupTop
    .selectAll("path")
    .data(convertedData)
    .join("path")
    .attr("fill", (d, i) => `url(#${stockKeys[i]}-top)`)
    .attr("stroke-width", 0)
    .transition()
    .duration(800)
    .attr("d", (d) => plotArea(d.values));
};
