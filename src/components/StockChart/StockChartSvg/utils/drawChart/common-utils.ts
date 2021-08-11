import { area, line } from "d3";
import { StockValue } from "../../../../../types";

export const getChartPlottingFunctions = (
  x: d3.ScaleTime<number, number, never>,
  y: d3.ScaleLinear<number, number, never>,
  y0Position: number
) => {
  return {
    plotStockLines: line<StockValue>()
      .x((d) => x(d.date))
      .y((d) => y(d.value)),
    plotStockArea: area<StockValue>()
      .x((d) => x(d.date))
      .y0(y0Position)
      .y1((d) => y(d.value)),
  };
};
