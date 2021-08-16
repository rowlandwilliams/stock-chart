import { select } from "d3";

// chart dimensions
export const svgHeight = 520;
export const topChartHeight = 350;
export const bottomChartHeight = 130;
export const margin = 20;

// required keys for plotting lines
export const stockKeys = ["high", "close", "open", "low"];
export const supernovaColors = [
  "#ff0082",
  "#ff793a",
  "#ffda01",
  "#0092f4",
].reverse();

export const brushColor = "#383862";
export const chartBackgroudColor = "#1a1b3e";

export const capitalizeString = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getInitialChartSelections = (companyName: string) => {
  const topChartGroup = select<SVGSVGElement, unknown>(
    `#top-chart-group-${companyName}`
  );
  return {
    topChartGroup: topChartGroup,
    bottomChartGroup: select<SVGSVGElement, unknown>(
      `#bottom-chart-group-${companyName}`
    ),
    xAxisGroup: topChartGroup.select<SVGSVGElement>(`#x-axis-${companyName}`),
    yAxisGroup: topChartGroup.select<SVGSVGElement>(`#y-axis-${companyName}`),
    linesGroup: topChartGroup.select<SVGSVGElement>(`#lines-${companyName}`),
    areaGroup: topChartGroup.select<SVGSVGElement>(`#area-${companyName}`),
  };
};


