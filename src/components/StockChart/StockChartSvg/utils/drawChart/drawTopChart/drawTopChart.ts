import * as d3 from "d3";
import { ConvertedData } from "../../../../../../types";
import { topChartHeight } from "../../utils";
import {
  getChartPlottingFunctions,
  plotTopChartAxes,
  plotTopChartStockLinesAndAreas,
} from "../common-utils";
import {
  addFocusLineCirclesAndText,
  getTopChartSelections,
  mousemove,
  updateTopChartAxesDomains,
} from "./utils";

export const drawTopChart = (
  xAxisGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  yAxisGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  linesGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  companyName: string,
  xTop: d3.ScaleTime<number, number, never>,
  yTop: d3.ScaleLinear<number, number, never>,
  activeDatesDomain: number[],
  activeStocksDomain: number[],
  svgWidth: number,
  xAxisTop: d3.Axis<d3.NumberValue | Date>,
  yAxisTop: d3.Axis<d3.NumberValue>,
  convertedData: ConvertedData[],
  margin: number,
  dates: number[],
  topChartGroup: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  latestStock: number
) => {
  // select lines g
  const {
    areaGroup,
    focusGroup,
    focusLine,
    focusCircles,
    focusText,
    focusTextRects,
    focusDateText,
    focusDateTextRect,
  } = getTopChartSelections(companyName, topChartGroup);

  // define line plotting function based on x and y scales
  const { plotStockLines, plotStockArea } = getChartPlottingFunctions(
    xTop,
    yTop,
    topChartHeight - margin
  );

  // set axes domains
  updateTopChartAxesDomains(
    xTop,
    yTop,
    activeDatesDomain,
    activeStocksDomain,
    svgWidth
  );

  // plot axes
  plotTopChartAxes(xAxisGroupTop, yAxisGroupTop, xAxisTop, yAxisTop);

  // plot lines and areas for stock data
  plotTopChartStockLinesAndAreas(
    areaGroup,
    convertedData,
    plotStockArea,
    linesGroupTop,
    plotStockLines
  );

  // add focus lines and tooltip
  addFocusLineCirclesAndText(
    focusLine,
    focusCircles,
    convertedData,
    focusText,
    focusDateText,
    focusDateTextRect
  );

  topChartGroup
    .on("mouseenter", () => {
      focusGroup.attr("stroke-opacity", 1).attr("opacity", 1);
    })
    .on("mouseleave", () => {
      focusGroup.attr("stroke-opacity", 0).attr("opacity", 0);
    })
    .on("mousemove", (event) =>
      mousemove(
        event,
        xTop,
        yTop,
        dates,
        focusLine,
        focusCircles,
        focusText,
        focusTextRects,
        focusDateText,
        focusDateTextRect,
        svgWidth,
        latestStock
      )
    );
};
