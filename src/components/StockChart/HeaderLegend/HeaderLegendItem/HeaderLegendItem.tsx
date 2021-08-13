import { capitalizeString } from "../../StockChartSvg/utils/utils";
import { GraphSvg } from "./GraphSvg";

interface Props {
  stockKey: string;
  textColor: string;
}

export const HeaderLegendItem = ({ stockKey, textColor }: Props) => {
  return (
    <div className="flex items-center mx-2" style={{ color: textColor }}>
      <GraphSvg svgColor={textColor} />
      <div>{capitalizeString(stockKey)}</div>
    </div>
  );
};
