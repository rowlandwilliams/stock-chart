import { brushX, scaleTime } from "d3";
import { ConvertedData, StockData } from "../../../../../../types";
import { bottomChartHeight, margin } from "../../utils";
import {
  getChartPlottingFunctions,
  plotTopChartStockLinesAndAreas,
} from "../common-utils";
import { updateTopChart } from "./updateTopChart/updateTopChart";
import {
  getBottomChartScalesAndAxes,
  getBottomChartSelections,
  updateBottomAreaWhileBrushing,
  updateBrushOnMove,
} from "./utils";

export const drawBottomChart = (
  companyName: string,
  stockData: StockData[],
  width: number,
  bottomChartGroup: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  fullDatesDomain: number[],
  fullStocksDomain: number[],
  convertedData: ConvertedData[],
  xTop: d3.ScaleTime<number, number, never>,
  xAxisGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  xAxisTop: d3.Axis<d3.NumberValue | Date>,
  linesGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  yTop: d3.ScaleLinear<number, number, never>,
  yAxisGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  yAxisTop: d3.Axis<d3.NumberValue>,
  activeDatesDomain: number[],
  areaGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  offsetLeft: number
) => {
  const { xAxisGroupBottom, linesGroupBottom, areaGroupBottom, brushGroup } =
    getBottomChartSelections(companyName, bottomChartGroup);

  const { xBottom, yBottom, xAxisBottom } = getBottomChartScalesAndAxes(
    fullDatesDomain,
    fullStocksDomain,
    width
  );

  // plot bottom x axis
  xAxisGroupBottom
    .attr("transform", `translate(0, ${bottomChartHeight - margin})`)
    .call(xAxisBottom);

  const xBottomArea = scaleTime().domain(activeDatesDomain);
  xBottomArea.range([0, width / 2]);

  // define line and area functions
  const { plotStockLines, plotStockArea } = getChartPlottingFunctions(
    xBottom,
    yBottom,
    bottomChartHeight - margin
  );

  // define brush function for bottom graph
  var brush: any = brushX()
    .extent([
      // area that we want the brush to be available for (whole bottom graph)
      [0, 0],
      [width, bottomChartHeight - margin],
    ]) // upon brush change, update top chart
    .on("brush", (event) => {
      updateBottomAreaWhileBrushing(event, xBottom);
    })
    .on("end", (event) => {
      updateTopChart(
        event,
        xBottom,
        stockData,
        xAxisGroupTop,
        xTop,
        xAxisTop,
        linesGroupTop,
        convertedData,
        yAxisGroupTop,
        yTop,
        yAxisTop,
        brushGroup,
        brush,
        width,
        areaGroupTop,
        offsetLeft
      );
    });

  updateBrushOnMove(brushGroup, brush, xBottom, activeDatesDomain, width);

  plotTopChartStockLinesAndAreas(
    areaGroupBottom,
    convertedData,
    plotStockArea,
    linesGroupBottom,
    plotStockLines
  );
};
