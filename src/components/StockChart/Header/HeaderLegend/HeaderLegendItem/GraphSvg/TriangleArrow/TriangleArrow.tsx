import { getTriangleCoordinatesFromTooltipDifference } from "./utils";

interface Props {
  tooltipDifferenceIsPositive: boolean;
}

export const TriangleArrow = ({ tooltipDifferenceIsPositive }: Props) => {
  return (
    <polygon
      points={getTriangleCoordinatesFromTooltipDifference(
        tooltipDifferenceIsPositive
      )}
      fill={tooltipDifferenceIsPositive ? "#54f054" : "#f0453c"}
      stroke={tooltipDifferenceIsPositive ? "#54f054" : "#f0453c"}
      strokeWidth="10"
    />
  );
};
