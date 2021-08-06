export interface StockData {
  [key: string]: number;
  date: number;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
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
  [key: string]: string | StockValue[];
  stockMetric: string;
  values: StockValue[];
}

export type StockKey = string;

export interface TimeLabel {
  label: string;
  timescale: number;
}
