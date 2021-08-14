import { GraphIconG } from "../GraphIconG/GraphIconG";
import { getTriangleCoordinatesFromTooltipDifference } from "./utils/utils";

interface Props {
  svgColor: string;
  topChartIsHovered: boolean;
  tooltipDifferenceIsPositive: boolean;
}

export const GraphSvg = ({
  svgColor,
  topChartIsHovered,
  tooltipDifferenceIsPositive,
}: Props) => {
  return (
    <div className="mr-2">
      <svg
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 511.9 511.9"
        xmlSpace="preserve"
        height="0.75rem"
        width="0.75rem"
      >
        {topChartIsHovered ? (
          <polygon
            points={getTriangleCoordinatesFromTooltipDifference(
              tooltipDifferenceIsPositive
            )}
            fill={tooltipDifferenceIsPositive ? "#54f054" : "#f0453c"}
            stroke={tooltipDifferenceIsPositive ? "#54f054" : "#f0453c"}
            stroke-width="10"
          />
        ) : (
          <GraphIconG svgColor={svgColor} />
        )}
      </svg>
    </div>
  );
};