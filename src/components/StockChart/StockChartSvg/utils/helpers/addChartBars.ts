import * as d3 from "d3";
import { StockData } from "../../../../../types";

export const addChartBars = (
  chart: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  stockData: StockData[],
  width: number,
  height: number,
  volumeDomain: number[],
  xScale: d3.ScaleTime<number, number, never>
) => {
  const xScaleBar = d3
    .scaleBand()
    .domain(stockData.map((x) => String(x.date)))
    .range([0, width])
    .padding(0.1);

  const yScaleBar = d3.scaleLinear().domain(volumeDomain).range([height, 0]);

  const bars = chart.selectAll("bar").data(stockData).enter().append("g");

  bars
    .append("rect")
    .attr("x", (d) => xScale(d.date))
    .attr("y", (d) => yScaleBar(d.volume))
    .attr("width", xScaleBar.bandwidth())
    .attr("height", function (d) {
      return height - yScaleBar(d.volume);
    })
    .attr("fill", "#B0A7FF")
    .attr("opacity", 0.2);
};
