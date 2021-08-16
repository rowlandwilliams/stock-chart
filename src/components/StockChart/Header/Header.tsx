import { companyStockData } from "../data/companyStockData";
import { stockKeys } from "../StockChartSvg/utils/utils";
import { HeaderLegend } from "./HeaderLegend/HeaderLegend";
import { HeaderText } from "./HeaderText/HeaderText";
import { TimeLabels } from "./TimeLabels/TimeLabels";

interface Props {
  companyTicker: string;
  latestStock: number;
  latestDate: number;
}

export const Header = ({ companyTicker, latestStock, latestDate }: Props) => {
  return (
    <>
      <div className="flex justify-between sm:items-end">
        <div className="flex flex-col sm:flex-row">
          <HeaderText
            boldText={companyTicker.toUpperCase()}
            subText={companyStockData[companyTicker].name}
          />
          <HeaderText
            boldText={latestStock.toFixed(2)}
            subText="USD"
            boldTextMarginRight={2}
          />
        </div>

        <div className="hidden sm:flex">
          <HeaderLegend stockKeys={stockKeys} />
        </div>

        <TimeLabels latestDate={latestDate} />
      </div>
      <div className="flex sm:hidden mt-2">
        <HeaderLegend stockKeys={stockKeys} />
      </div>
    </>
  );
};
