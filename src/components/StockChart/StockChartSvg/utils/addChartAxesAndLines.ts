import * as d3 from "d3";
import { StockData, Margin, StockValue, StockKey } from "../../../../types";
import { addChartBars } from "./helpers/addChartBars";
import { addChartLines } from "./helpers/addChartLines";
import { getMinMaxStock, getMinMaxVolume } from "./helpers/getMinMaxStock";

export const addChartAxesAndLines = (
  stockData: StockData[],
  stockKeys: StockKey[],
  margin: Margin
) => {
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
  // xAxis.ticks(0);
  xAxis.ticks(d3.timeMonth.every(1)).tickSize(0);

  // add x axis
  chart
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis)
    .call((g) => g.select(".domain").remove());

  // y axis
  // calculate domain of stocks
  const stocksDomain = getMinMaxStock(stockData, stockKeys);
  const volumeDomain = getMinMaxVolume(stockData);

  // define yScale based on stocks
  const yScale = d3.scaleLinear().domain(stocksDomain).range([height, 0]);

  // define line plotting function
  const plotLine = d3
    .line<StockValue>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value));

  addChartLines(chart, stockData, stockKeys, plotLine);
  // addChartBars(chart, stockData, width, height, volumeDomain, xScale);
};
