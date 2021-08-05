import { StockData } from "../../../../../types";

export const getMinMaxStock = (
  stockValues: StockData[],
  stockKeys: string[]
) => {
  const data: number[] = stockValues
    .map((stockObj: StockData) => stockKeys.map((key) => stockObj[key]))
    .flat();
  return [Math.min.apply(null, data) - 10, Math.max.apply(null, data)];
};

export const getMinMaxVolume = (stockValues: StockData[]) => {
  const data: number[] = stockValues.map(
    (stockObj: StockData) => stockObj.volume
  );
  return [0, Math.max.apply(null, data)];
};
