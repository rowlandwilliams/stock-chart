import {
  active,
  axisBottom,
  brushX,
  line,
  scaleLinear,
  ScaleTime,
  scaleTime,
  timeMonth,
  zoom,
} from "d3";
import { ConvertedData, StockData, StockValue } from "../../../../types";
import {
  bottomChartHeight,
  margin,
  supernovaColors,
  topChartHeight,
} from "./chart-utils";
import { getActiveMinMaxStock, getBrushedMinMaxStock } from "./data-utils";

export const drawBottomChart = (
  companyName: string,
  stockData: StockData[],
  width: number,
  bottomChartGroup: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  fullDatesDomain: number[],
  fullStocksDomain: number[],
  convertedData: ConvertedData[],
  xTop: d3.ScaleTime<number, number, never>,
  xAxisGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  xAxisTop: d3.Axis<d3.NumberValue | Date>,
  linesGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  yTop: d3.ScaleLinear<number, number, never>,
  yAxisGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  yAxisTop: d3.Axis<d3.NumberValue>,
  activeDatesDomain: number[]
) => {
  const xAxisGroupBottom = bottomChartGroup.select<SVGSVGElement>(
    `#x-axis-${companyName}`
  );

  const linesGroup = bottomChartGroup.selectAll(`#lines-${companyName}`);

  const brushGroup = bottomChartGroup.select<SVGSVGElement>(
    `#brush-${companyName}`
  );

  const xBottom = scaleTime().domain(fullDatesDomain).range([0, width]);
  const yBottom = scaleLinear()
    .domain(fullStocksDomain)
    .range([bottomChartHeight - margin, margin]);
  console.log(
    xBottom(activeDatesDomain[0]),
    xBottom(activeDatesDomain[1]),
    width
  );

  const xAxisBottom = axisBottom(xBottom).tickSize(0);

  xAxisGroupBottom
    .attr("transform", `translate(0, ${bottomChartHeight - margin})`)
    .call(xAxisBottom);

  var brush = brushX()
    .extent([
      [0, 0],
      [width, bottomChartHeight - margin],
    ])
    .on("end", (event) =>
      updateTopChart(
        event,
        xBottom,
        stockData,
        xAxisGroupTop,
        xTop,
        xAxisTop,
        linesGroupTop,
        convertedData,
        yAxisGroupTop,
        yTop,
        yAxisTop
      )
    );

  brushGroup
    .call(brush as any)
    .call(brush.move as any, [
      xBottom(activeDatesDomain[0]),
      xBottom(activeDatesDomain[1]),
    ]);
  console.log(xTop.range());
  const plotLinesBottom = line<StockValue>()
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

const updateTopChart = (
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
  yAxisTop: d3.Axis<d3.NumberValue>
) => {
  const selection = { event };
  const extent = selection.event.selection;
  const brushedDatesDomain = extent.map((x: number) =>
    xBottom.invert(x).getTime()
  );
  xTop.domain(brushedDatesDomain);

  const newYDomain = getBrushedMinMaxStock(
    stockData,
    brushedDatesDomain[1],
    brushedDatesDomain[1] - brushedDatesDomain[0]
  );

  yTop.domain(newYDomain);

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
};
