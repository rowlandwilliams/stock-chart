export const getTriangleCoordinatesFromTooltipDifference = (
  tooltipDifferenceIsPositive: boolean
) => {
  return `275,${tooltipDifferenceIsPositive ? 90 : 500} 50,${
    tooltipDifferenceIsPositive ? 500 : 90
  } 500,${tooltipDifferenceIsPositive ? 500 : 90}`;
};
