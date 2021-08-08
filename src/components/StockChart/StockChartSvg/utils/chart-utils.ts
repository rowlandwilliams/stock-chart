import { Console } from "console";
import * as d3 from "d3";
import { max, text } from "d3";
import { ConvertedData, StockData, TimeLabel } from "../../../../types";

// required keys for plotting lines
export const stockKeys = ["open", "high", "low", "close"];
export const supernovaColors = ["#52a866", "#FF715B", "#E9FEA5", "#E0D9FE"];

export const margin = 20;

export const capitalizeString = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// calculate min and max date in data for x axis
export const getDatesDomain = (
  stockData: StockData[],
  latestDate: number,
  activeTimeLabelObject: TimeLabel
) => {
  const dates = stockData.map((x) => x.date);

  return [
    Math.min(
      ...dates.filter(
        (date) => date > latestDate - activeTimeLabelObject.timescale
      )
    ),
    Math.max(
      ...dates.filter(
        (date) => date > latestDate - activeTimeLabelObject.timescale
      )
    ),
  ];
};

// calculate min and max stock value
export const getMinMaxStock = (
  stockValues: StockData[],
  latestDate: number,
  activeTimeLabelObject: TimeLabel
) => {
  // filter stockData based on clicked timescale
  const data: number[] = stockValues
    .filter(
      (stockObj) => stockObj.date > latestDate - activeTimeLabelObject.timescale
    )
    .map((stockObj: StockData) => stockKeys.map((key) => stockObj[key]))
    .flat();

  // return min max of filtered data
  return [Math.min.apply(null, data), Math.max.apply(null, data)];
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

  return xAxis.ticks(d3.timeMonth.every(1));
};

// mousmove function for when svg is hovered
export const mousemove = (
  event: PointerEvent,
  x: d3.ScaleTime<number, number, never>,
  y: d3.ScaleLinear<number, number, never>,
  dates: number[],
  datesDomain: number[],
  focusGroup: d3.Selection<SVGSVGElement, ConvertedData, HTMLElement, any>,
  width: number
) => {
  const textHeight = 20;
  const xMouse = d3.pointer(event)[0];
  console.log(xMouse / width);

  // convert mouse coordinate to date based on x scale
  const x0 = x.invert(d3.pointer(event)[0]).getTime();

  // determine the index of the date in dates array that is closest to x0
  const i = d3.bisect(dates, x0, 1);

  // define dates one before and at index
  const d0 = dates[i - 1];
  const d1 = dates[i];

  // determine date value that will be used to position x value of verticla line / tooltip
  const dFinal = x0 - d0 > d1 - x0 ? d1 : d0;
  const idxFinal = x0 - d0 > d1 - x0 ? i : i - 1;

  focusGroup
    .select("line")
    .attr("transform", "translate(" + x(dFinal) + "," + 0 + ")");

  focusGroup
    .selectAll("circle")
    .attr("cx", x(dFinal))
    .attr("cy", (d: any) => y(d.values[idxFinal].value) - margin);

  const sequentialLineData: number[] = [];

  focusGroup.selectAll("text").each((d: any) => {
    sequentialLineData.push(d.values[idxFinal].value);
  });

  // sort in descneding order
  sequentialLineData.sort().reverse();
  const length = sequentialLineData.length;

  // calulcate the mid of all four values for a given date
  const midStockValue =
    sequentialLineData[length - 1] -
    (sequentialLineData[length - 1] - sequentialLineData[0]) / 2;

  const getTextTranslationFromData = (d: any, i: number) => {
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
      (y(midStockValue) + index * textHeight - margin - 25) +
      ")"
    );
  };

  const getRectTranslationFromData = (
    d: any,
    i: number,
    maxTextWidthAndOffset: number
  ) => {
    return (
      "translate(" +
      (x(dFinal) +
        (xMouse > width - maxTextWidthAndOffset
          ? -maxTextWidthAndOffset - 5
          : margin / 2) +
        "," +
        (y(midStockValue) + i * textHeight - margin - 2 * textHeight) +
        ")")
    );
  };

  const textWidths: number[] = [];

  focusGroup.selectAll("text").each((d, i, nodes) => {
    const node = d3.select(nodes[i]).node() as SVGSVGElement;
    const width = node.getBBox().width;
    textWidths.push(width + 10);
  });

  const maxTextWidth = Math.max(...textWidths);
  const maxTextWidthAndOffset = maxTextWidth + 15;

  focusGroup
    .select("rect")
    .attr("rx", 2)
    .attr("fill", "#383862")
    .attr("width", maxTextWidth)
    .attr("height", "80px")
    .attr("transform", (d: any, i) =>
      getRectTranslationFromData(d, i, maxTextWidthAndOffset)
    );

  focusGroup
    .selectAll("text")
    .text(
      (d: any) =>
        capitalizeString(d.stockMetric) +
        ": " +
        d.values[idxFinal].value.toFixed(2)
    )
    .attr("font-size", "0.75rem")
    .attr("transform", (d: any, i) => getTextTranslationFromData(d, i))
    .attr("text-anchor", "start");
};
