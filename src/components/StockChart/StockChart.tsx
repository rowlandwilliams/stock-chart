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
      className="w-full max-w-5xl p-4 mb-2 text-white font-semibold bg-chart_background rounded-lg"
      id="chart-container"
      onMouseEnter={() => setChartIsHovered(true)}
      onMouseLeave={() => setChartIsHovered(false)}
    >
      <div className="flex justify-between">
        <div>
          <div className="flex flex-col sm:flex-row">
            <HeaderText
              boldText={companyTicker.toUpperCase()}
              subText={companyStockData[companyTicker].name}
            />
            <HeaderText
              boldText={high.toFixed(2)}
              subText="USD"
              boldTextMarginRight={2}
            />
          </div>
          {/* <HeaderLegend stockKeys={stockKeys} /> */}
        </div>

        <div className="hidden sm:flex">
          <HeaderLegend stockKeys={stockKeys} />
        </div>

        <div>
          <TimeLabels latestDate={date} />
        </div>
      </div>
      <div className="flex sm:hidden mt-2">
        <HeaderLegend stockKeys={stockKeys} />
      </div>
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
