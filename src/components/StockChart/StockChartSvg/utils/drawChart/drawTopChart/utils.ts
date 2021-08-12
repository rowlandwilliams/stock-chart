import { area, line, select } from "d3";
import { ConvertedData, StockValue } from "../../../../../../types";
import { margin, supernovaColors, topChartHeight } from "../../chart-utils";

export const getTopChartSelections = (
  companyName: string,
  topChartGroup: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
) => {
  const focusGroup = topChartGroup.select<SVGSVGElement>(
    `#focus-${companyName}`
  );
  return {
    areaGroup: select<SVGSVGElement, unknown>(`#area-${companyName}`),
    focusGroup: focusGroup,
    focusLine: focusGroup.select<SVGSVGElement>("line"),
    focusCircles: focusGroup.selectAll<SVGSVGElement, unknown>("circle"),
    focusText: focusGroup.selectAll<SVGSVGElement, unknown>("text"),
    focusTextRects: focusGroup.selectAll<SVGSVGElement, unknown>("rect"),
  };
};

export const updateTopChartAxesDomains = (
  x: d3.ScaleTime<number, number, never>,
  y: d3.ScaleLinear<number, number, never>,
  activeDatesDomain: number[],
  activeStocksDomain: number[],
  svgWidth: number
) => {
  x.domain(activeDatesDomain).range([0, svgWidth]);
  y.domain(activeStocksDomain).range([topChartHeight - margin, margin]);
};

const chartBackgroundColor = "#1a1b3e";

export const addFocusLineCirclesAndText = (
  focusLine: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  focusCircles: d3.Selection<SVGSVGElement, unknown, SVGSVGElement, unknown>,
  convertedData: ConvertedData[],
  focusText: d3.Selection<SVGSVGElement, unknown, SVGSVGElement, unknown>
) => {
  focusLine
    .attr("stroke", "white")
    .attr("stroke-svgWidth", 1)
    .attr("shape-rendering", "crispEdges")
    .attr("opacity", 0)
    .attr("y2", topChartHeight - margin);

  focusCircles
    .data(convertedData)
    .join("circle")
    .attr("opacity", 0)
    .attr("r", "4")
    .attr("fill", (d, i) => supernovaColors[i])
    .attr("stroke", chartBackgroundColor)
    .attr("stroke-svgWidth", 2);

  focusText
    .data(convertedData)
    .join("text")
    .attr("fill", (d, i) => supernovaColors[i]);
};
