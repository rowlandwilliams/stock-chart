import * as d3 from "d3";
import { StockData, Margin } from "../../../../types";

export const addChartAxes = (stockData: StockData[], margin: Margin) => {
  const chart = d3.select(".stock-chart-group");
  const width = parseInt(d3.select("#stock-chart").style("width"));
  const height =
    parseInt(d3.select("#stock-chart").style("height")) - margin.bottom;

  // x axis
  // calculate domain of dates
  const dates = stockData.map((x) => x.date);
  const datesDomain = [
    Math.min.apply(null, dates),
    Math.max.apply(null, dates),
  ];

  // define xScale based on date domain
  const xScale = d3.scaleTime().domain(datesDomain).range([0, width]);
  const xAxis = d3.axisBottom(xScale);
  xAxis.ticks(d3.timeYear.every(1)).tickSize(0);

  // add x axis
  chart
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis)
    .call((g) => g.select(".domain").remove());
};
