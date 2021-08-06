import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { convertStockDataForChart } from "./utils/convertStockDataForChart";
import { StockData, TimeLabel } from "../../../types";
import {
  margin,
  getAxisLabels,
  getDatesDomain,
  getMinMaxStock,
  xAxisScale,
} from "./utils/chart-utils";
import { drawLines } from "./utils/drawLines";

interface Props {
  stockData: StockData[];
  activeTimeLabelObject: TimeLabel;
  companyName: string;
}

export const StockChartSvg = ({
  stockData,

  activeTimeLabelObject,
  companyName,
}: Props) => {
  // define ref for parent container
  const parentRef = useRef<HTMLInputElement>(null);

  // set intial width of svg container
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // convert data to required format
  const convertedData = convertStockDataForChart(stockData);

  // on page load set svg height
  useEffect(() => {
    const { current } = parentRef;

    if (current) {
      setWidth(current.offsetWidth);
      setHeight(current.offsetHeight - 20);

      // add resize listener
      window.addEventListener("resize", () => setWidth(current.offsetWidth));
      return () => {
        window.removeEventListener("resize", () =>
          setWidth(current.offsetWidth)
        );
      };
    }
  }, [parentRef]);

  // each time time period button is clicked transition lines
  useEffect(() => {
    // prevent svg being loaded until parent width has been set
    if (width > 0) {
      // determine latest date
      const latestDate = stockData.slice(-1)[0].date;

      // calculate dates domain based on activeTimeLabelObject (the time button which is clicked e.g 1W, 1M ...)
      const datesDomain = getDatesDomain(
        stockData,
        latestDate,
        activeTimeLabelObject
      );

      // calculate stocks domain for y axis scaling
      const stocksDomain = getMinMaxStock(
        stockData,
        latestDate,
        activeTimeLabelObject
      );

      // define x axis scale
      const x = xAxisScale(datesDomain, width);
      const y = d3.scaleLinear();

      // define x axis
      const xAxis = d3.axisBottom(x).tickSize(0);

      // determine the number of axis labels to plot based on activeTimeLabel
      getAxisLabels(activeTimeLabelObject, xAxis);

      // draw lines
      drawLines(
        companyName,
        x,
        y,
        datesDomain,
        stocksDomain,
        width,
        height,
        xAxis,
        convertedData,
        margin
      );
    }
  });

  return (
    <div className="h-80 w-full" ref={parentRef} id="chart-container">
      <svg width="100%" height="100%" id={`chart-svg-${companyName}`}>
        <defs>
          <clipPath id={`clip-${companyName}`}>
            <rect x={0} y={0} width="100%" height="100%"></rect>
          </clipPath>
        </defs>
        <g className={`chart-group-${companyName}`}></g>
        <g id={`x-axis-${companyName}`}></g>
      </svg>
    </div>
  );
};
