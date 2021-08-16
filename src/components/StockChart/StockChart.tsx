import { useState } from "react";
import { companyStockData } from "./data/companyStockData";
import { timeLabels } from "./data/timeLabels";
import { StockChartSvg } from "./StockChartSvg/StockChartSvg";
import { Header } from "./Header/Header";

interface Props {
  companyTicker: string;
}

export const StockChart = ({ companyTicker }: Props) => {
  const [chartIsHovered, setChartIsHovered] = useState(false);

  // define company data based on provided company name
  const stockData = companyStockData[companyTicker].data.map((stockObj) => ({
    ...stockObj,
    date: Date.parse(stockObj.date),
  }));

  // set initially active time period (1Y)
  const activeTimeLabelObject = timeLabels[timeLabels.length - 1];

  const { date, high } = stockData.slice(-1)[0];
  return (
    <div
      className="w-full max-w-5xl p-4 mb-2 text-white font-semibold bg-chart_background rounded-lg"
      id="chart-container"
      onMouseEnter={() => setChartIsHovered(true)}
      onMouseLeave={() => setChartIsHovered(false)}
    >
      <Header
        companyTicker={companyTicker}
        latestStock={high}
        latestDate={date}
      />
      <StockChartSvg
        stockData={stockData}
        activeTimeLabelObject={activeTimeLabelObject}
        companyTicker={companyTicker}
        latestDate={date}
        chartIsHovered={chartIsHovered}
        latestStock={high}
      />
    </div>
  );
};
