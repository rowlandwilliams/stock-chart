import { StockValue, StockData, ConvertedData } from "../../../../types";
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
