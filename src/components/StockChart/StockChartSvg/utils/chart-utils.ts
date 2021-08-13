import { scaleTime } from "d3";

// chart dimensions
export const svgHeight = 520;
export const topChartHeight = 350;
export const bottomChartHeight = 130;
export const margin = 20;

// required keys for plotting lines
export const stockKeys = ["high", "close", "open", "low"];
export const supernovaColors = [
  "#ff0082",
  "#ff793a",
  "#ffda01",
  "#0092f4",
].reverse();

export const brushColor = "#383862";
export const chartBackgroudColor = "#1a1b3e";

export const capitalizeString = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};


