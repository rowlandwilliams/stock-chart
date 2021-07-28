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
  return (
    <div className="block mx-auto max-w-4xl h-96 p-4 text-white font-semibold bg-blue-600 rounded-lg">
      <div>AAPL</div>
      <StockChartSvg stockData={stockData} />
    </div>
  );
};
