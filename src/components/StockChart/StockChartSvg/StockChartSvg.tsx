import { useEffect } from "react";
import { StockData } from "../../../types";
import { addChartAxes } from "./utils/addChartAxes";
import { initializeStockChart } from "./utils/initializeStockChart";

interface Props {
  stockData: StockData[];
}

export const StockChartSvg = ({ stockData }: Props) => {
  useEffect(() => {
    plotChart();
  });

  useEffect(() => {
    window.addEventListener("resize", () => plotChart());
    return () => {
      window.removeEventListener("resize", () => plotChart());
    };
  });

  const plotChart = () => {
    const margin = { top: 10, right: 0, bottom: 20, left: 0 };

    initializeStockChart(margin);
    addChartAxes(stockData, margin);
  };

  return <div className="h-80" id="stock-chart"></div>;
};
