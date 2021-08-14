import { useSelector } from "react-redux";
import { RootState } from "../../../../reducers";
import { TooltipDifferenceObject } from "../../../../types";
import { capitalizeString } from "../../StockChartSvg/utils/utils";
import { GraphSvg } from "./GraphSvg/GraphSvg";

interface Props {
  stockKey: string;
  textColor: string;
}

export const HeaderLegendItem = ({ stockKey, textColor }: Props) => {
  const { topChartIsHovered } = useSelector((state: RootState) => state);

  const tooltipDifferences = useSelector((state: RootState) => state)
    .tooltipDifferences as TooltipDifferenceObject;

  const tooltipDifference = Number(tooltipDifferences[stockKey].toFixed(2));
  return (
    <div className="flex items-center mx-2" style={{ color: textColor }}>
      <GraphSvg
        svgColor={textColor}
        topChartIsHovered={topChartIsHovered}
        tooltipDifferenceIsPositive={tooltipDifference > 0}
      />

      <div className='w-10'>
        {topChartIsHovered
          ? (tooltipDifference > 0 ? "+" : '') + tooltipDifference
          : capitalizeString(stockKey)}
      </div>
    </div>
  );
};
