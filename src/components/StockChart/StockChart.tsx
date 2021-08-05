import { useState } from "react";
import { companyStockData } from "./data/companyStockData";
import { StockChartSvg } from "./StockChartSvg/StockChartSvg";
import classNames from "classnames";

interface Props {
  companyName: string;
}

const labels = [
  { label: "1M", timescale: 2629800000 },
  { label: "1Y", timescale: 31556952000 },
];

export const StockChart = ({ companyName }: Props) => {
  const stockData = companyStockData[companyName].map((stockObj) => ({
    ...stockObj,
    date: Date.parse(stockObj.date),
  }));
  const latestDate = stockData.slice(-1)[0].date;

  const [activeTimeLabel, setActiveTimeLabel] = useState<string>("1Y");
  const [filteredChartData, setFilteredChartData] = useState(stockData);

  const reqKeys = ["open", "close", "adjClose", "low", "high"];
  const stockKeys = Object.keys(stockData[0]).filter((key) =>
    reqKeys.includes(key)
  );

  return (
    <div className="block mx-auto max-w-4xl h-96 p-4 mb-2 text-white font-semibold bg-chart_background rounded-lg">
      <div className="flex justify-between">
        <div>
          {companyName.charAt(0).toUpperCase() +
            companyName.toLowerCase().slice(1)}
        </div>
        <div className="flex">
          {labels.map((labelObject) => (
            <div
              className={classNames(
                "ml-2 px-2 rounded-lg bg-opacity-20 cursor-pointer",
                {
                  "bg-bar_colour text-white":
                    activeTimeLabel === labelObject.label,
                  "text-bar_colour text-opacity-20":
                    activeTimeLabel !== labelObject.label,
                }
              )}
              onClick={() => {
                setActiveTimeLabel(labelObject.label);
                setFilteredChartData(
                  stockData.filter(
                    (x) => x.date > latestDate - labelObject.timescale
                  )
                );
              }}
              id="suh"
            >
              {labelObject.label}
            </div>
          ))}
        </div>
      </div>
      <StockChartSvg
        stockData={filteredChartData}
        stockKeys={stockKeys}
        isMonth={activeTimeLabel === "1M"}
        companyName={companyName}
      />
    </div>
  );
};
