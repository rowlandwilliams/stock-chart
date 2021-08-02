import { useEffect } from "react";
import { StockData, StockKey } from "../../../types";
import { addChartAxesAndLines } from "./utils/addChartAxesAndLines";
import { initializeStockChart } from "./utils/initializeStockChart";

interface Props {
  stockData: StockData[];
  stockKeys: StockKey[];
}

export const StockChartSvg = ({ stockData, stockKeys }: Props) => {
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
    addChartAxesAndLines(stockData, stockKeys, margin);
  };

  return <div className="h-80" id="stock-chart"></div>;
};
