import * as d3 from "d3";
import { StockKey, StockValue } from "../../../../../types";
import { convertStockDataForChart } from "./convertStockDataForChart";
import { StockData } from "../../../../../types";
const supernovaColors = ["#52a866", "#FF715B", "#E9FEA5", "#A0FCAD", "#E0D9FE"];

export const addChartLines = (
  chart: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  stockData: StockData[],
  stockKeys: StockKey[],
  plotLine: d3.Line<StockValue>,
 
) => {
  // convert stock data to long format for plotting
  const convertedData = convertStockDataForChart(stockData, stockKeys);

  // add lines to chart
  const lines = chart
    .selectAll("lines")
    .data(convertedData)
    .enter()
    .append("g");

  lines
    .append("path")
    .attr("fill", "none")
    .attr("stroke", (d, i) => supernovaColors[i])
    .attr("stroke-width", 3)
    .attr("d", (d) => plotLine(d.values))
    .on("mouseover", (e) => {
      const mouse = d3.pointer(e, this);
      focus.attr(
        "transform", 
        "translate(" +
          mouse[0] +
          "," + // 
          (mouse[1] - 10) +
          ")"
      );
    });

  const focus = chart
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 10)
    .attr("r", 6)
    .attr("fill", "white")
    .attr("stroke", supernovaColors[0])
    .attr("stroke-width", "3px");
};
