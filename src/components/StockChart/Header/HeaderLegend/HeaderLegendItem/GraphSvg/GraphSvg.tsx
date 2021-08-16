import { GraphIconG } from "./GraphIconG/GraphIconG";
import { TriangleArrow } from "./TriangleArrow/TriangleArrow";

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
        height={topChartIsHovered ? "0.75rem" : "0.65rem"}
        width="0.75rem"
      >
        {topChartIsHovered ? (
          <TriangleArrow
            tooltipDifferenceIsPositive={tooltipDifferenceIsPositive}
          />
        ) : (
          <GraphIconG svgColor={svgColor} />
        )}
      </svg>
    </div>
  );
};
