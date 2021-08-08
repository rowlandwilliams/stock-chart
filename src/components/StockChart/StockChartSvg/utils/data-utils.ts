import {
  StockValue,
  StockData,
  ConvertedData,
  TimeLabel,
} from "../../../../types";
import { stockKeys } from "./chart-utils";

export const convertStockDataForChart = (stockData: StockData[]) => {
  // wide format to long format
  // convert from [{date: ..., close: ..., ....}, {date: ..., close: ..., ....}....] to
  // [close: [{date: ..., value: ....}, {date: ..., value: ....}...], open: [{date: ..., value: ....}, {date: ..., value: ....}......]
  const convertedData = [] as ConvertedData[];

  stockKeys.forEach((key) => {
    const stockKeyData = [] as StockValue[];

    stockData.map((stockObj: StockData) => {
      const stockValueObj = {} as StockValue;
      stockValueObj.date = stockObj.date;
      stockValueObj.value = stockObj[key];
      return stockKeyData.push(stockValueObj);
    });

    const stockKeyObj = {} as ConvertedData;
    stockKeyObj.stockMetric = key;
    stockKeyObj.values = stockKeyData;
    convertedData.push(stockKeyObj);
  });

  return convertedData;
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
