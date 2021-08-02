import { StockData } from "../../../../../types";

export const getMinMaxStock = (
  stockValues: StockData[],
  stockKeys: string[]
) => {
  const data: number[] = stockValues
    .map((stockObj: StockData) => stockKeys.map((key) => stockObj[key]))
    .flat();
  return [0, Math.max.apply(null, data) + 2];
};

export const getMinMaxVolume = (stockValues: StockData[]) => {
  const data: number[] = stockValues.map(
    (stockObj: StockData) => stockObj.volume
  );
  return [0, Math.max.apply(null, data) * 2];
};
