import * as d3 from "d3";
import { ConvertedData, StockValue } from "../../../../types";
import { mousemove } from "./chart-utils";

const supernovaColors = ["#52a866", "#FF715B", "#E9FEA5", "#A0FCAD", "#E0D9FE"];

export const drawLines = (
  xAxisGroup: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  yAxisGroup: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  companyName: string,
  x: d3.ScaleTime<number, number, never>,
  y: d3.ScaleLinear<number, number, never>,
  datesDomain: number[],
  stocksDomain: number[],
  width: number,
  height: number,
  xAxis: d3.Axis<d3.NumberValue | Date>,
  yAxis: d3.Axis<d3.NumberValue>,
  convertedData: ConvertedData[],
  margin: number,
  dates: number[]
) => {
  // select lines g
  const linesGroup = d3.select(`#chart-group-${companyName}`);

  const svgGroup = d3.select<SVGSVGElement, unknown>(
    `#chart-svg-${companyName}`
  );

  const focusGroup = d3.select<SVGSVGElement, unknown>(`#focus-${companyName}`);

  const focusLine = d3.select<SVGSVGElement, unknown>(
    `#focus-${companyName} > line`
  );

  const focusCircles = d3.selectAll<SVGSVGElement, unknown>(
    `#focus-${companyName} > circle`
  );

  focusCircles.attr("stroke", "#1a1b3e").attr("stroke-width", 2);
  // define line plotting function based on x and y scales
  const plotLine = d3
    .line<StockValue>()
    .x((d) => x(d.date))
    .y((d) => y(d.value));

  // set axes domains
  x.domain(datesDomain).range([0, width]);
  y.domain(stocksDomain).range([height, 50]);

  // transition x axis
  xAxisGroup
    .attr("transform", `translate(0, ${height})`)
    .transition()
    .duration(1000)
    .call(xAxis)
    .attr("text-anchor", "end")
    .on("start", () => {
      xAxisGroup.select(".domain").remove(); // remove axis line
    });

  yAxisGroup
    .attr("transform", `translate(0, ${0})`)
    .attr("opacity", "0.1")
    .transition()
    .duration(1000)
    .call(yAxis)
    .on("start", () => {
      yAxisGroup.select(".domain").remove(); // remove axis line
    });

  // add lines
  linesGroup
    .selectAll("path")
    .data(convertedData)
    .join("path")
    .attr("transform", `translate(0, ${-margin})`)
    .attr("fill", "none")
    .attr("stroke", (d, i) => supernovaColors[i])
    .attr("stroke-width", "1.5px")
    .transition()
    .duration(1000)
    .attr("d", (d) => plotLine(d.values));

  focusLine
    .select("line")
    .style("stroke", "white")
    .attr("stroke-width", 1)
    .style("shape-rendering", "crispEdges")
    .style("opacity", 1)
    .attr("y1", 0)
    .attr("y2", height);

  focusCircles
    .selectAll("circle")
    .data(convertedData)
    .join("circle")
    .attr("r", "4")
    .attr("fill", (d, i) => supernovaColors[i]);

  svgGroup
    .on("mouseenter", () => {
      focusGroup.attr("stroke-opacity", 1).attr("opacity", 1);
    })
    .on("mouseleave", () => {
      focusGroup.attr("stroke-opacity", 0).attr("opacity", 0);
    })
    .on("mousemove", (event) => mousemove(event, x, y, dates, focusGroup));
};
