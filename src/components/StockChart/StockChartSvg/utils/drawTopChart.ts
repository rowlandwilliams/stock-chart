import * as d3 from "d3";
import { ConvertedData, StockValue } from "../../../../types";
import {
  mousemove,
  stockKeys,
  supernovaColors,
  topChartHeight,
} from "./chart-utils";

const chartBackgroundColor = "#1a1b3e";

export const drawTopChart = (
  xAxisGroup: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  yAxisGroup: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  linesGroup: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  companyName: string,
  x: d3.ScaleTime<number, number, never>,
  y: d3.ScaleLinear<number, number, never>,
  datesDomain: number[],
  stocksDomain: number[],
  width: number,
  xAxis: d3.Axis<d3.NumberValue | Date>,
  yAxis: d3.Axis<d3.NumberValue>,
  convertedData: ConvertedData[],
  margin: number,
  dates: number[],
  focusGroup: d3.Selection<SVGSVGElement, ConvertedData, HTMLElement, any>
) => {
  // select lines g
  const areaGroup = d3.select(`#area-${companyName}`);

  // const linesGroup = topChartGroup.select(`#lines-${companyName}`);

  const svgGroup = d3.select<SVGSVGElement, unknown>(
    `#chart-svg-${companyName}`
  );

  const focusLine = focusGroup.select("line");

  const focusCircles = focusGroup.selectAll("circle");

  const focusText = focusGroup.selectAll("text");

  const focusTextRects = focusGroup.selectAll("rect");

  // define line plotting function based on x and y scales
  const plotLine = d3
    .line<StockValue>()
    .x((d) => x(d.date))
    .y((d) => y(d.value));

  const plotArea = d3
    .area<StockValue>()
    .x((d) => x(d.date))
    .y0(topChartHeight - margin)
    .y1((d) => y(d.value));

  // set axes domains
  x.domain(datesDomain).range([0, width]);
  y.domain(stocksDomain).range([topChartHeight - margin, margin]);

  // transition x axis
  xAxisGroup
    .attr("transform", `translate(0, ${topChartHeight - margin})`)
    .transition()
    .duration(800)
    .call(xAxis)
    .attr("text-anchor", "end");

  yAxisGroup
    .attr("transform", `translate(0, ${0})`)
    .transition()
    .duration(800)
    .call(yAxis)
    .on("start", () => {
      yAxisGroup.select(".domain").remove(); // remove axis line
      yAxisGroup
        .selectAll(".tick > line")
        .attr("opacity", 0.5)
        .style("stroke-dasharray", "5 5");
    })
    .selectAll("text")
    .attr("transform", "translate(4, -8)")
    .attr("text-anchor", "start");

  // add lines
  // areaGroup
  //   .selectAll("path")
  //   .data(convertedData)
  //   .join("path")
  //   .attr("fill", (d, i) => `url(#${stockKeys[i]})`)
  //   .attr("stroke-width", 0)
  //   .transition()
  //   .duration(800)
  //   .attr("d", (d) => plotArea(d.values));

  linesGroup
    .selectAll("path")
    .data(convertedData)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", (d, i) => supernovaColors[i])
    .attr("stroke-width", "2px")
    .transition()
    .duration(800)
    .attr("d", (d) => plotLine(d.values));

  focusLine
    .style("stroke", "white")
    .attr("stroke-width", 1)
    .style("shape-rendering", "crispEdges")
    .style("opacity", 1)
    .attr("y1", 0)
    .attr("y2", topChartHeight - margin);

  focusCircles
    .data(convertedData)
    .join("circle")
    .attr("r", "4")
    .attr("fill", (d, i) => supernovaColors[i])
    .attr("stroke", chartBackgroundColor)
    .attr("stroke-width", 2);

  focusText
    .data(convertedData)
    .join("text")
    .attr("fill", (d, i) => supernovaColors[i]);

  svgGroup
    .on("mouseenter", () => {
      focusGroup.attr("stroke-opacity", 1).attr("opacity", 1);
    })
    .on("mouseleave", () => {
      focusGroup.attr("stroke-opacity", 0).attr("opacity", 0);
    })
    .on("mousemove", (event) =>
      mousemove(
        event,
        x,
        y,
        dates,
        focusLine,
        focusCircles,
        focusText,
        focusTextRects,
        width
      )
    );
};
