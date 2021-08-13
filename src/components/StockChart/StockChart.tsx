import { useState } from "react";
import { companyStockData } from "./data/companyStockData";
import { timeLabels } from "./data/timeLabels";
import { HeaderLegend } from "./HeaderLegend/HeaderLegend";
import { HeaderText } from "./HeaderText/HeaderText";
import { StockChartSvg } from "./StockChartSvg/StockChartSvg";
import { stockKeys } from "./StockChartSvg/utils/utils";
import { TimeLabels } from "./TimeLabels/TimeLabels";

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
      className="block mx-auto max-w-4xl p-4 mb-2 text-white font-semibold bg-chart_background rounded-lg"
      id="chart-container"
      onMouseEnter={() => setChartIsHovered(true)}
      onMouseLeave={() => setChartIsHovered(false)}
    >
      <div className="flex justify-between">
        <div className="flex flex-col sm:flex-row">
          <HeaderText
            boldText={companyStockData[companyTicker].name}
            subText={companyStockData[companyTicker].name}
          />
          <HeaderText
            boldText={high.toFixed(2)}
            subText="USD"
            boldTextMarginRight={2}
          />
          <HeaderLegend stockKeys={stockKeys} />
        </div>

        <TimeLabels latestDate={date} />
      </div>
      <StockChartSvg
        stockData={stockData}
        activeTimeLabelObject={activeTimeLabelObject}
        companyTicker={companyTicker}
        latestDate={date}
        chartIsHovered={chartIsHovered}
      />
    </div>
  );
};
