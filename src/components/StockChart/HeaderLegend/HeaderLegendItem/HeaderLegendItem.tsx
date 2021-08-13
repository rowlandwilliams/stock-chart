import { useSelector } from "react-redux";
import { RootState } from "../../../../reducers";
import { capitalizeString } from "../../StockChartSvg/utils/utils";
import { GraphSvg } from "./GraphSvg";

interface Props {
  stockKey: string;
  textColor: string;
}

export const HeaderLegendItem = ({ stockKey, textColor }: Props) => {
  const { topChartIsHovered } = useSelector((state: RootState) => state);

  return (
    <div className="flex items-center mx-2" style={{ color: textColor }}>
      {topChartIsHovered ? <div>suh</div> : <GraphSvg svgColor={textColor} />}

      <div>{capitalizeString(stockKey)}</div>
    </div>
  );
};
