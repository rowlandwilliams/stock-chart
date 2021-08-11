import {
  area,
  axisBottom,
  BrushBehavior,
  brushX,
  line,
  scaleLinear,
  ScaleTime,
  scaleTime,
  select,
  selectAll,
} from "d3";
import { ConvertedData, StockData, StockValue } from "../../../../../../types";
import {
  bottomChartHeight,
  margin,
  stockKeys,
  supernovaColors,
  topChartHeight,
} from "../../chart-utils";
import { getBrushedMinMaxStock } from "../../data-utils";
import {
  getChartPlottingFunctions,
  plotChartStockLinesAndAreas,
} from "../common-utils";
import { updateTopChart } from "./updateTopChart/updateTopChart";
import { getBottomChartScalesAndAxes, getBottomChartSelections } from "./utils";

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
  areaGroupTop: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
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
      // get extent of brush selection
      const selection = { event };
      const extent = selection.event.selection;

      if (!extent) return;

      // calculate new dates domain based on brushed dates
      const brushedDatesDomain = extent.map((x: number) =>
        xBottom.invert(x).getTime()
      );

      // update top chart x axis with new domain
      xTop.domain(brushedDatesDomain);

      // calculate new stocks domain based on brushed dates
      const brushedStocksDomain = getBrushedMinMaxStock(
        stockData,
        brushedDatesDomain[1],
        brushedDatesDomain[0]
      );

      const clipLeft = select("#area-crop-left > rect");
      clipLeft
        .attr(
          "width",
          xBottom(brushedDatesDomain[1]) - xBottom(brushedDatesDomain[0])
        )
        .attr("x", xBottom(brushedDatesDomain[0]));

      // update top chart y axis with new domain
      yTop.domain(brushedStocksDomain);
    })
    .on("end", (event) =>
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
        areaGroupTop
      )
    );

  // call brush function and set initial position / position on time label click
  brushGroup
    .call(brush as any)
    .transition()
    .duration(800)
    .call(brush.move as any, [
      xBottom(activeDatesDomain[0]),
      xBottom(activeDatesDomain[1]),
    ]);

  plotChartStockLinesAndAreas(
    areaGroupBottom,
    convertedData,
    plotStockArea,
    linesGroupBottom,
    plotStockLines
  );

  selectAll(".domain").remove();
};
