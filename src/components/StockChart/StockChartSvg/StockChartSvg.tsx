import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  convertStockDataForChart,
  getActiveDatesDomain,
  getActiveMinMaxStock,
  getFullDatesDomain,
  getFullStockDomain,
} from "./utils/data-utils";
import { ConvertedData, StockData, TimeLabel } from "../../../types";
import {
  margin,
  getAxisLabels,
  xAxisScale,
  topChartHeight,
  svgHeight,
} from "./utils/chart-utils";
import { drawTopChart } from "./utils/drawTopChart";
import classNames from "classnames";
import { drawBottomChart } from "./utils/drawBottomChart";

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

  // convert data to required format
  const convertedData = convertStockDataForChart(stockData);

  const fullDatesDomain = getFullDatesDomain(stockData);
  const fullStocksDomain = getFullStockDomain(stockData);

  //on page load set svg height
  useEffect(() => {
    const { current } = parentRef;

    if (current) {
      setWidth(current.offsetWidth);

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
    const topChartGroup = d3.select<SVGSVGElement, unknown>(
      `#top-chart-group-${companyName}`
    );
    const bottomChartGroup = d3.select<SVGSVGElement, unknown>(
      `#bottom-chart-group-${companyName}`
    );

    const xAxisGroup = topChartGroup.select<SVGSVGElement>(
      `#x-axis-${companyName}`
    );

    const yAxisGroup = topChartGroup.select<SVGSVGElement>(
      `#y-axis-${companyName}`
    );

    const focusGroup = d3.select<SVGSVGElement, ConvertedData>(
      `#focus-${companyName}`
    );

    // determine latest date
    const latestDate = stockData.slice(-1)[0].date;

    // calculate dates domain based on activeTimeLabelObject (the time button which is clicked e.g 1W, 1M ...)
    const activeDatesDomain = getActiveDatesDomain(
      stockData,
      latestDate,
      activeTimeLabelObject
    );

    // calculate stocks domain for y axis scaling
    const activeStocksDomain = getActiveMinMaxStock(
      stockData,
      latestDate,
      activeTimeLabelObject
    );

    // define x axis scale
    const x = xAxisScale(activeDatesDomain, width);
    const y = d3.scaleLinear();

    // define x axis
    const xAxis = d3.axisBottom(x).tickSize(0);
    const yAxis = d3.axisLeft(y).tickSize(-width).ticks(5);

    getAxisLabels(activeTimeLabelObject, xAxis);

    // draw lines
    drawTopChart(
      xAxisGroup,
      yAxisGroup,
      companyName,
      x,
      y,
      activeDatesDomain,
      activeStocksDomain,
      width,
      xAxis,
      yAxis,
      convertedData,
      margin,
      stockData.map((x) => x.date),
      focusGroup
    );

    drawBottomChart(
      companyName,
      width,
      bottomChartGroup,
      fullDatesDomain,
      fullStocksDomain,
      convertedData
    );

    d3.selectAll(".domain").remove();
  });

  const getClassFromChartHover = (controlLineOpacityOnHover: boolean = false) =>
    classNames("text-white text-opacity-50 transition duration-150", {
      "opacity-1":
        chartIsHovered || (controlLineOpacityOnHover && !chartIsHovered),
      "opacity-80": chartIsHovered && controlLineOpacityOnHover,
      "opacity-0": !chartIsHovered && !controlLineOpacityOnHover,
    });

  return (
    <div className="w-full" ref={parentRef} id="chart-container">
      <svg
        width="100%"
        height={svgHeight}
        id={`chart-svg-${companyName}`}
        pointerEvents="all"
      >
        <g
          id={`top-chart-group-${companyName}`}
          height={topChartHeight}
          transform={`translate(0,${margin})`}
        >
          <g
            id={`x-axis-${companyName}`}
            className={getClassFromChartHover()}
          ></g>
          <g
            id={`y-axis-${companyName}`}
            className={getClassFromChartHover()}
          ></g>
          <g
            id={`lines-${companyName}`}
            className={getClassFromChartHover(true)}
          ></g>
          <g id={`focus-${companyName}`} className={getClassFromChartHover()}>
            <line></line>
            <rect></rect>
          </g>
          <rect
            width="100%"
            height="100%"
            id={`overlay-${companyName}`}
            pointerEvents="all"
            fill="none"
          ></rect>
        </g>
        <g
          id={`bottom-chart-group-${companyName}`}
          transform={`translate(0,${topChartHeight + margin})`}
        >
          <g id={`x-axis-${companyName}`}></g>
          <g id={`y-axis-${companyName}`}></g>
          <g id={`lines-${companyName}`}></g>
          <g id={`brush-${companyName}`}></g>
        </g>
      </svg>
    </div>
  );
};
