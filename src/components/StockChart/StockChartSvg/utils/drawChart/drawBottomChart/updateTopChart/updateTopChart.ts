import {
  Axis,
  BrushBehavior,
  NumberValue,
  ScaleLinear,
  ScaleTime,
  Selection,
} from "d3";
import { store } from "../../../../../../..";
import { changeVisibleDatesDomain } from "../../../../../../../actions";
import { ConvertedData, StockData } from "../../../../../../../types";
import { margin, topChartHeight } from "../../../utils";
import {
  getBrushedMinMaxStock,
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
  xBottom: ScaleTime<number, number, never>,
  stockData: StockData[],
  xAxisGroupTop: Selection<SVGSVGElement, unknown, HTMLElement, any>,
  xTop: ScaleTime<number, number, never>,
  xAxisTop: Axis<NumberValue | Date>,
  linesGroupTop: Selection<SVGSVGElement, unknown, HTMLElement, any>,
  convertedData: ConvertedData[],
  yAxisGroupTop: Selection<SVGSVGElement, unknown, HTMLElement, any>,
  yTop: ScaleLinear<number, number, never>,
  yAxisTop: Axis<NumberValue>,
  brushGroup: Selection<SVGSVGElement, unknown, HTMLElement, any>,
  brush: BrushBehavior<unknown>,
  svgWidth: number,
  areaGroupTop: Selection<SVGSVGElement, unknown, HTMLElement, any>,
  offsetLeft: number
) => {
  // get extent of brush selection
  const selection = { event };
  var extent = selection.event.selection;

  if (!extent) {
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

  //clip the shaded under bottom chart line to brush
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

  // updates datesdomain when brush event has finsihed
  const { sourceEvent } = event;

  if (sourceEvent) {
    store.dispatch(changeVisibleDatesDomain(brushedDatesDomain));
  }
};
