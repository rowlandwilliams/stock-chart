import { useState } from "react";
import { companyStockData } from "./data/companyStockData";
import { StockChartSvg } from "./StockChartSvg/StockChartSvg";
import classNames from "classnames";

interface Props {
  companyName?: string;
}

const labels = [{ label: "1M" }, { label: "1Y" }];

export const StockChart = ({ companyName = "apple" }: Props) => {
  const [activeTimeLabel, setActiveTimeLabel] = useState<string>("1Y");

  const stockData = companyStockData[companyName].map((stockObj) => ({
    ...stockObj,
    date: Date.parse(stockObj.date),
  }));

  const reqKeys = ["open", "close", "adjClose", "low", "high"];
  const stockKeys = Object.keys(stockData[0]).filter((key) =>
    reqKeys.includes(key)
  );

  return (
    <div className="block mx-auto max-w-4xl h-96 p-4 text-white font-semibold bg-chart_background rounded-lg">
      <div className="flex justify-between">
        <div>AAPL</div>
        <div className="flex">
          {labels.map((labelObject) => (
            <div
              className={classNames("mx-2 px-2 rounded-lg bg-opacity-20 cursor-pointer", {
                "bg-bar_colour text-white":
                  activeTimeLabel === labelObject.label,
                "text-bar_colour text-opacity-20":
                  activeTimeLabel !== labelObject.label,
              })}
              onClick={() => setActiveTimeLabel(labelObject.label)}
            >
              {labelObject.label}
            </div>
          ))}
        </div>
      </div>
      <StockChartSvg stockData={stockData} stockKeys={stockKeys} />
    </div>
  );
};
