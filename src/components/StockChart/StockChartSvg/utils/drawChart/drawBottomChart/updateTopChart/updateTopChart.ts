import { BrushBehavior, ScaleTime } from "d3";
import { ConvertedData, StockData } from "../../../../../../../types";
import { margin, topChartHeight } from "../../../chart-utils";
import { getBrushedMinMaxStock } from "../../../data-utils";
import {
  getChartPlottingFunctions,
  plotTopChartStockLinesAndAreas,
} from "../../common-utils";
import { updateBrushOnMove } from "../utils";
import {
  clipBottomChartAreaToBrush,
  getNewViewExtentOnBrushClick,
  updateTopChartAxesFromBrush,
} from "./utils";

export const updateTopChart = (
  event: any,
  touch: any,
  xBottom: ScaleTime<number, number, never>,
  stockData: StockData[],
  xAxisGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  xTop: d3.ScaleTime<number, number, never>,
  xAxisTop: d3.Axis<d3.NumberValue | Date>,
  linesGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  convertedData: ConvertedData[],
  yAxisGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  yTop: d3.ScaleLinear<number, number, never>,
  yAxisTop: d3.Axis<d3.NumberValue>,
  brushGroup: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  brush: BrushBehavior<unknown>,
  svgWidth: number,
  areaGroupTop: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  offsetLeft: number
) => {
  // get extent of brush selection
  const selection = { event };
  const { sourceEvent } = event;
  var extent = selection.event.selection;

  if (sourceEvent && sourceEvent.type === "touchend") return;

  if (!extent) {
    // return;
    // touch;
    extent = getNewViewExtentOnBrushClick(event, offsetLeft, svgWidth);

    const brushedDatesDomain = extent.map((x: number) =>
      xBottom.invert(x).getTime()
    );

    updateBrushOnMove(brushGroup, brush, xBottom, brushedDatesDomain, svgWidth);
  }

  // get dates domain of brush
  const brushedDatesDomain = extent.map((x: number) =>
    xBottom.invert(x).getTime()
  );

  console.log("here");
  // clip the shaded under bottom chart line to brush
  clipBottomChartAreaToBrush(xBottom, brushedDatesDomain);

  // calculate new stocks domain based on brushed dates
  const brushedStocksDomain = getBrushedMinMaxStock(
    stockData,
    brushedDatesDomain[1],
    brushedDatesDomain[0]
  );

  // update top chart axes
  updateTopChartAxesFromBrush(
    xTop,
    brushedDatesDomain,
    yTop,
    brushedStocksDomain,
    xAxisGroupTop,
    yAxisGroupTop,
    xAxisTop,
    yAxisTop
  );

  //define plotting functions based on x and y axis rescaled in above block
  const { plotStockLines, plotStockArea } = getChartPlottingFunctions(
    xTop,
    yTop,
    topChartHeight - margin
  );

  // plot lines and areas based on updated plotting fns
  plotTopChartStockLinesAndAreas(
    areaGroupTop,
    convertedData,
    plotStockArea,
    linesGroupTop,
    plotStockLines
  );
};
