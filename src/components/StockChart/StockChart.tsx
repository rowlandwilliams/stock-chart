import { useState } from "react";
import { companyStockData } from "./data/companyStockData";
import { TimeLabel } from "../../types";
import { StockChartSvg } from "./StockChartSvg/StockChartSvg";
import { TimeLabels } from "./TimeLabels/TimeLabels";
import { timeLabels } from "./data/timeLabels";

interface Props {
  companyName: string;
}

export const StockChart = ({ companyName }: Props) => {
  // define company data based on provided company name
  const stockData = companyStockData[companyName].map((stockObj) => ({
    ...stockObj,
    date: Date.parse(stockObj.date),
  }));

  // set initially active time period (1Y)
  const [activeTimeLabelObject, setActiveTimeLabelObject] = useState<TimeLabel>(
    timeLabels[timeLabels.length - 1]
  );

  const handleTimeLabelClick = (labelObject: TimeLabel) => {
    return setActiveTimeLabelObject(labelObject);
  };

  return (
    <div className="block mx-auto max-w-4xl h-96 p-4 mb-2 text-white font-semibold bg-chart_background rounded-lg">
      <div className="flex justify-between">
        <div>
          {companyName.charAt(0).toUpperCase() +
            companyName.toLowerCase().slice(1)}
        </div>
        <TimeLabels
          activeTimeLabelObject={activeTimeLabelObject}
          onTimeLabelClick={handleTimeLabelClick}
        />
      </div>
      <StockChartSvg
        stockData={stockData}
        activeTimeLabelObject={activeTimeLabelObject}
        companyName={companyName}
      />
    </div>
  );
};
