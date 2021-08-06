import { useState } from "react";
import { companyStockData } from "./data/companyStockData";
import classNames from "classnames";
import { TimeLabel } from "../../types";
import { StockChartSvg } from "./StockChartSvg/StockChartSvg";

interface Props {
  companyName: string;
}

const labels = [
  { label: "1W", timescale: 2629800000 / 4 },
  { label: "1M", timescale: 2629800000 },
  { label: "3M", timescale: 7889400000 },
  { label: "1Y", timescale: 31556952000 },
];

export const StockChart = ({ companyName }: Props) => {
  const stockData = companyStockData[companyName].map((stockObj) => ({
    ...stockObj,
    date: Date.parse(stockObj.date),
  }));

  const [activeTimeLabelObject, setActiveTimeLabelObject] = useState<TimeLabel>(
    labels[labels.length - 1]
  );

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
                    activeTimeLabelObject.label === labelObject.label,
                  "text-bar_colour text-opacity-20":
                    activeTimeLabelObject.label !== labelObject.label,
                }
              )}
              onClick={() => {
                setActiveTimeLabelObject(labelObject);
              }}
              id="suh"
            >
              {labelObject.label}
            </div>
          ))}
        </div>
      </div>
      <StockChartSvg
        stockData={stockData}
        stockKeys={stockKeys}
        activeTimeLabelObject={activeTimeLabelObject}
        companyName={companyName}
      />
    </div>
  );
};
