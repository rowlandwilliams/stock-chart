import * as d3 from "d3";
import { StockData, TimeLabel } from "../../../../types";

export const margin = 20;

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
  stockKeys: string[],
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

  if (activeTimeLabelObject.label === "3M") {
    return xAxis.ticks(d3.timeMonth.every(1));
  }

  return xAxis.ticks(d3.timeYear.every(1));
};
