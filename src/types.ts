export interface StockData {
  [key: string]: number;
  date: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface StockValue {
  [key: string]: string | number;
  stockMetric: string;
  date: number;
  value: number;
}

export interface ConvertedData {
  [key: string]: string | StockValue[] | number;
  stockMetric: string;
  values: StockValue[];
}

export type StockKey = string;

export interface TimeLabel {
  label: string;
  timescale: number;
  domain: number[];
}

export interface StockDataObj {
  [key: string]: number | string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TooltipDifferenceObject {
  [key: string]: number;
  high: number;
  open: number;
  close: number;
  low: number;
}

export interface CompanyData {
  [key: string]: {
    name: string;
    data: StockDataObj[];
  };
}
