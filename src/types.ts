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
