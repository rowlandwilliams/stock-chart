import * as d3 from "d3";
import { ConvertedData, TimeLabel } from "../../../../types";

export const margin = 20;

// chart dimensions
export const svgHeight = 500;
export const topChartHeight = 320;
export const bottomChartHeight = 180;

// required keys for plotting lines
export const stockKeys = ["open", "high", "low", "close"];
export const supernovaColors = ["#52a866", "#FF715B", "#E9FEA5", "#E0D9FE"];

export const capitalizeString = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// scaling function for x axis
export const xAxisScale = (datesDomain: number[], width: number) => {
  return d3.scaleTime().domain(datesDomain).range([0, width]);
};

// determing axis labels based on activeTimeLabel
export const getAxisLabels = (
  activeTimeLabelObject: TimeLabel,
  xAxis: d3.Axis<Date | d3.NumberValue>
) => {
  if (activeTimeLabelObject.label === "1W") {
    return xAxis.ticks(d3.timeDay.every(1));
  }

  if (activeTimeLabelObject.label === "1M") {
    return xAxis.ticks(d3.timeWeek.every(1));
  }

  if (activeTimeLabelObject.label === "1Y" && window.innerWidth < 600) {
    return xAxis.ticks(d3.timeYear.every(1));
  }

  return xAxis.ticks(d3.timeMonth.every(1));
};

export const getYAxisLabels = (
  activeTimeLabelObject: TimeLabel,
  yAxis: d3.Axis<d3.NumberValue>
) => {
  if (activeTimeLabelObject.label === "1W") {
    return yAxis.ticks(4);
  }

  if (activeTimeLabelObject.label === "1M") {
    return yAxis.ticks(2);
  }

  return yAxis.ticks(5);
};

// mousmove function for when svg is hovered
export const mousemove = (
  event: PointerEvent,
  x: d3.ScaleTime<number, number, never>,
  y: d3.ScaleLinear<number, number, never>,
  dates: number[],
  focusLine: d3.Selection<d3.BaseType, ConvertedData, HTMLElement, any>,
  focusCircles: d3.Selection<
    d3.BaseType,
    unknown,
    SVGSVGElement,
    ConvertedData
  >,
  focusText: d3.Selection<d3.BaseType, unknown, SVGSVGElement, ConvertedData>,
  focusTextRects: d3.Selection<
    d3.BaseType,
    unknown,
    SVGSVGElement,
    ConvertedData
  >,
  width: number
) => {
  // height of one label
  const textHeight = 20;

  // get x mouse position
  const xMouse = d3.pointer(event)[0];

  // convert mouse coordinate to date based on x scale
  const x0 = x.invert(d3.pointer(event)[0]).getTime();

  // determine the index of the date in dates array that is closest to x0
  const idx = d3.bisect(dates, x0, 1);

  // define dates one before and at index
  const d0 = dates[idx - 1];
  const d1 = dates[idx];

  // determine date value that will be used to position x value of verticla line / tooltip
  const dFinal = x0 - d0 > d1 - x0 ? d1 : d0;
  const idxFinal = x0 - d0 > d1 - x0 ? idx : idx - 1;

  // translate line based on current x value
  focusLine.attr("transform", "translate(" + x(dFinal) + ",0)");

  // translate circle based on current x and y value
  focusCircles
    .attr("cx", x(dFinal))
    .attr("cy", (d: any) => y(d.values[idxFinal].value));

  // for the given date get the value for each stockMetric
  const sequentialLineData: number[] = [];

  // for each label grab data value associated with it and push to array
  focusText.each((d: any) => {
    sequentialLineData.push(d.values[idxFinal].value);
  });

  // sort in descneding order (for y positioning)
  sequentialLineData.sort().reverse();
  const length = sequentialLineData.length;

  // calulcate the mid of all four values for a given date (for mid positioning of tooltip box)
  const midStockValue =
    sequentialLineData[length - 1] -
    (sequentialLineData[length - 1] - sequentialLineData[0]) / 2;

  const textWidths: number[] = [];

  focusText.each((d, i, nodes) => {
    const node = d3.select(nodes[i]).node() as SVGSVGElement;
    const width = node.getBBox().width;
    textWidths.push(width + 10);
  });

  const maxTextWidth = Math.max(...textWidths);
  const maxTextWidthAndOffset = maxTextWidth + 5;

  focusTextRects
    .attr("rx", 2)
    .attr("fill", "#383862")
    .attr("width", maxTextWidth)
    .attr("height", "80px")
    .attr("transform", (d: any, i) =>
      getRectTranslationFromData(
        x,
        dFinal,
        xMouse,
        width,
        maxTextWidthAndOffset,
        y,
        midStockValue,
        i,
        textHeight
      )
    );

  focusText
    .text(
      (d: any) =>
        capitalizeString(d.stockMetric) +
        ": " +
        d.values[idxFinal].value.toFixed(2)
    )
    .attr("font-size", "0.75rem")
    .attr("transform", (d: any, i) =>
      getTextTranslationFromData(
        sequentialLineData,
        d,
        idxFinal,
        x,
        xMouse,
        width,
        maxTextWidthAndOffset,
        y,
        midStockValue,
        textHeight,
        dFinal
      )
    )
    .attr("text-anchor", "start");
};

// translate text labels based on value at a given date
const getTextTranslationFromData = (
  sequentialLineData: number[],
  d: any,
  idxFinal: number,
  x: d3.ScaleTime<number, number, never>,
  xMouse: number,
  width: number,
  maxTextWidthAndOffset: number,
  y: d3.ScaleLinear<number, number, never>,
  midStockValue: number,
  textHeight: number,
  dFinal: number
) => {
  // distance between tooltip and point
  const offset = 15;

  // determine position of rectangle based on y value
  const index = sequentialLineData.indexOf(d.values[idxFinal].value);

  return (
    "translate(" +
    (x(dFinal) +
      (xMouse > width - maxTextWidthAndOffset
        ? -maxTextWidthAndOffset
        : offset)) +
    "," + // multiply index by textheight to determine vertical position of each label in tooltip
    (y(midStockValue) + index * textHeight - 25) +
    ")"
  );
};

// translate text rectablges based on value at a given date
const getRectTranslationFromData = (
  x: d3.ScaleTime<number, number, never>,
  dFinal: number,
  xMouse: number,
  width: number,
  maxTextWidthAndOffset: number,
  y: d3.ScaleLinear<number, number, never>,
  midStockValue: number,
  i: number,
  textHeight: number
) => {
  return (
    "translate(" +
    (x(dFinal) +
      (xMouse > width - maxTextWidthAndOffset
        ? -maxTextWidthAndOffset - 5
        : margin / 2) +
      "," +
      (y(midStockValue) + i * textHeight - 2 * textHeight) +
      ")")
  );
};
