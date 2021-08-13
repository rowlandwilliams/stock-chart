import { useState } from "react";
import { companyStockData } from "./data/companyStockData";
import { StockChartSvg } from "./StockChartSvg/StockChartSvg";
import { TimeLabels } from "./TimeLabels/TimeLabels";
import { timeLabels } from "./data/timeLabels";
import { capitalizeString } from "./StockChartSvg/utils/chart-utils";

interface Props {
  companyName: string;
}

export const StockChart = ({ companyName }: Props) => {
  const [chartIsHovered, setChartIsHovered] = useState(false);
  // define company data based on provided company name
  const stockData = companyStockData[companyName].map((stockObj) => ({
    ...stockObj,
    date: Date.parse(stockObj.date),
  }));

  // set initially active time period (1Y)
  const activeTimeLabelObject = timeLabels[timeLabels.length - 1];

  const latestDate = stockData.slice(-1)[0].date;

  return (
    <div
      className="block mx-auto max-w-4xl p-4 mb-2 text-white font-semibold bg-chart_background rounded-lg"
      id="chart-container"
      onMouseEnter={() => setChartIsHovered(true)}
      onMouseLeave={() => setChartIsHovered(false)}
    >
      <div className="flex justify-between">
        <div>{capitalizeString(companyName)}</div>
        <TimeLabels latestDate={latestDate} />
      </div>
      <StockChartSvg
        stockData={stockData}
        activeTimeLabelObject={activeTimeLabelObject}
        companyName={companyName}
        latestDate={latestDate}
        chartIsHovered={chartIsHovered}
      />
    </div>
  );
};
