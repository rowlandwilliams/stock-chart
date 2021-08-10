import {
  axisBottom,
  brushX,
  line,
  scaleLinear,
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
import { getActiveMinMaxStock } from "./data-utils";

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
  yTop: d3.ScaleLinear<number, number, never>
) => {
  const xAxisGroupBottom = bottomChartGroup.select<SVGSVGElement>(
    `#x-axis-${companyName}`
  );

  const yAxisGroup = bottomChartGroup.select(`#y-axis-${companyName}`);

  const linesGroup = bottomChartGroup.selectAll(`#lines-${companyName}`);

  const brushGroup = bottomChartGroup.select<SVGSVGElement>(
    `#brush-${companyName}`
  );

  // A function that set idleTimeOut to null
  var idleTimeout: any;
  function idled() {
    idleTimeout = null;
  }

  const updateTopChart = (event: any) => {
    const selection = { event };
    const extent = selection.event.selection;
    console.log(extent.map((x: number) => xTop.invert(x)));

    const brushedDatesDomain = extent.map((x: number) =>
      xBottom.invert(x).getTime()
    );
    xTop.domain(brushedDatesDomain);

    const newYDomain = getActiveMinMaxStock(
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

  var brush = brushX()
    .extent([
      [0, 0],
      [width, bottomChartHeight - margin],
    ])
    .on("end", updateTopChart);

  var zoomTest: any = zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([
      [0, 0],
      [width, topChartHeight],
    ])
    .extent([
      [0, 0],
      [width, topChartHeight],
    ]);

  const xBottom = scaleTime().domain(fullDatesDomain).range([0, width]);
  const yBottom = scaleLinear()
    .domain(fullStocksDomain)
    .range([bottomChartHeight - margin, margin]);

  const xAxisBottom = axisBottom(xBottom).tickSize(0);

  xAxisGroupBottom
    .attr("transform", `translate(0, ${bottomChartHeight - margin})`)
    .call(xAxisBottom);

  brushGroup.call(brush as any).call(brush.move as any, xBottom.range());

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
