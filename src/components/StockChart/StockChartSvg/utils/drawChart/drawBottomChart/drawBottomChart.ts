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
  const xAxisGroupBottom = bottomChartGroup.select<SVGSVGElement>(
    `#x-axis-${companyName}`
  );
  const linesGroupBottom = bottomChartGroup.selectAll(`#lines-${companyName}`);
  const areaGroupBottom = bottomChartGroup.selectAll(`#area-${companyName}`);
  const brushGroup = bottomChartGroup.select<SVGSVGElement>(
    `#brush-${companyName}`
  );

  // define x and y scale for bottom graph
  const xBottom = scaleTime().domain(fullDatesDomain).range([0, width]);
  const yBottom = scaleLinear()
    .domain(fullStocksDomain)
    .range([bottomChartHeight - margin, margin]);

  // define x axis for bottom graph
  const xAxisBottom = axisBottom(xBottom).tickSize(0);

  // plot bottom x axis
  xAxisGroupBottom
    .attr("transform", `translate(0, ${bottomChartHeight - margin})`)
    .call(xAxisBottom);

  const xBottomArea = scaleTime().domain(activeDatesDomain);
  xBottomArea.range([0, width / 2]);

  //[xBottom(activeDatesDomain[0]), xBottom(activeDatesDomain[1])]);

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

  // define line function for bottom chart
  const plotLinesBottom = line<StockValue>()
    .x((d) => xBottom(d.date))
    .y((d) => yBottom(d.value));

  // plot bottom chart lines
  linesGroupBottom
    .selectAll("path")
    .data(convertedData)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", (d, i) => supernovaColors[i])
    .attr("stroke-width", "0.5px")
    .transition()
    .duration(800)
    .attr("d", (d) => plotLinesBottom(d.values));

  const plotAreaBottom = area<StockValue>()
    .x((d) => xBottom(d.date))
    .y0(bottomChartHeight - margin)
    .y1((d) => yBottom(d.value));

  areaGroupBottom
    .selectAll("path")
    .data(convertedData)
    .join("path")
    .attr("fill", (d, i) => `url(#${stockKeys[i]}-bottom)`)
    .attr("stroke-width", 0)
    .transition()
    .duration(800)
    .attr("d", (d) => plotAreaBottom(d.values));

  selectAll(".domain").remove();
};

const updateTopChart = (
  event: any,
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
  width: number,
  areaGroupTop: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
) => {
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

  //
  xAxisGroupTop
    .transition()
    .duration(800)
    .call(xAxisTop)
    .attr("text-anchor", "end");

  yAxisGroupTop
    .transition()
    .duration(800)
    .call(yAxisTop)
    .on("start", () => {
      yAxisGroupTop.select(".domain").remove(); // remove axis line
      yAxisGroupTop
        .selectAll(".tick > line")
        .attr("opacity", 0.5)
        .style("stroke-dasharray", "5 5");
    })
    .selectAll("text")
    .attr("transform", "translate(4, -8)")
    .attr("text-anchor", "start");

  const plotLine = line<StockValue>()
    .x((d) => xTop(d.date))
    .y((d) => yTop(d.value));

  linesGroupTop
    .selectAll("path")
    .data(convertedData)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", (d, i) => supernovaColors[i])
    .attr("stroke-width", "2px")
    .transition()
    .duration(800)
    .attr("d", (d) => plotLine(d.values));

  const plotArea = area<StockValue>()
    .x((d) => xTop(d.date))
    .y0(topChartHeight - margin)
    .y1((d) => yTop(d.value));

  areaGroupTop
    .selectAll("path")
    .data(convertedData)
    .join("path")
    .attr("fill", (d, i) => `url(#${stockKeys[i]}-top)`)
    .attr("stroke-width", 0)
    .transition()
    .duration(800)
    .attr("d", (d) => plotArea(d.values));
};
