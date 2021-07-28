import * as d3 from "d3";
import { Margin } from "../../../../types";

export const initializeStockChart = (margin: Margin) => {
  d3.select("#stock-chart svg").remove();

  // append svg (full container width)
  const svg = d3
    .select("#stock-chart")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%");

  // append group for chart and apply margins
  svg
    .append("g")
    .attr("class", "stock-chart-group")
    .attr("transform", `translate(${margin.left},${margin.top})`);
};
