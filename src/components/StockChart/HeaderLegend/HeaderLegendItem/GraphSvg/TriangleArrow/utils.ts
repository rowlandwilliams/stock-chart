export const getTriangleCoordinatesFromTooltipDifference = (
  tooltipDifferenceIsPositive: boolean
) => {
  return `275,${tooltipDifferenceIsPositive ? 90 : 400} 50,${
    tooltipDifferenceIsPositive ? 400 : 90
  } 500,${tooltipDifferenceIsPositive ? 400 : 90}`;
};
