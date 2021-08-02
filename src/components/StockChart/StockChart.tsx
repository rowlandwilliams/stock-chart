import { companyStockData } from "./data/companyStockData";
import { StockChartSvg } from "./StockChartSvg/StockChartSvg";

interface Props {
  companyName?: string;
}

export const StockChart = ({ companyName = "apple" }: Props) => {
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
      <div>AAPL</div>
      <StockChartSvg stockData={stockData} stockKeys={stockKeys} />
    </div>
  );
};
