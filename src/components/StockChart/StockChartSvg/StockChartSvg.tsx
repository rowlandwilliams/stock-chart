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
import classNames from "classnames";

interface Props {
  stockData: StockData[];
  activeTimeLabelObject: TimeLabel;
  companyName: string;
  chartIsHovered: boolean;
}

export const StockChartSvg = ({
  stockData,
  activeTimeLabelObject,
  companyName,
  chartIsHovered,
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
      const xAxisGroup = d3.select<SVGSVGElement, unknown>(
        `#x-axis-${companyName}`
      );

      const yAxisGroup = d3.select<SVGSVGElement, unknown>(
        `#y-axis-${companyName}`
      );

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
      const yAxis = d3.axisLeft(y).tickSize(-width).ticks(4);

      // determine the number of axis labels to plot based on activeTimeLabel
      getAxisLabels(activeTimeLabelObject, xAxis);

      // draw lines
      drawLines(
        xAxisGroup,
        yAxisGroup,
        companyName,
        x,
        y,
        datesDomain,
        stocksDomain,
        width,
        height,
        xAxis,
        yAxis,
        convertedData,
        margin,
        stockData.map((x) => x.date)
      );
    }
  });

  const getClassFromChartHover = classNames(
    "text-white text-opacity-50 transition duration-150",
    {
      "opacity-1": chartIsHovered,
      "opacity-0": !chartIsHovered,
    }
  );

  return (
    <div className="h-80 w-full" ref={parentRef} id="chart-container">
      <svg
        width="100%"
        height="100%"
        id={`chart-svg-${companyName}`}
        pointerEvents="all"
      >
        <g id={`x-axis-${companyName}`} className={getClassFromChartHover}></g>
        <g id={`y-axis-${companyName}`}></g>
        <g id={`chart-group-${companyName}`}></g>
        <g id={`focus-${companyName}`} className={getClassFromChartHover}>
          <line></line>
        </g>
        <rect
          width="100%"
          height="100%"
          id={`overlay-${companyName}`}
          pointerEvents="all"
          fill="none"
        ></rect>
      </svg>
    </div>
  );
};
