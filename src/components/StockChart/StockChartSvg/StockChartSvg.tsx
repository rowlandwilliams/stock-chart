import { useEffect, useRef, useState } from "react";
import {
  convertStockDataForChart,
  getActiveDatesDomain,
  getActiveMinMaxStock,
  getFullDatesDomain,
  getFullStockDomain,
} from "./utils/data-utils";
import { StockData, TimeLabel } from "../../../types";
import {
  margin,
  xAxisScale,
  topChartHeight,
  svgHeight,
  stockKeys,
  supernovaColors,
  bottomChartHeight,
  chartBackgroudColor,
} from "./utils/chart-utils";
import { LinearGradient } from "./LinearGradient/LinearGradient";
import { axisBottom, axisLeft, line, scaleLinear, select, selectAll } from "d3";
import { drawTopChart } from "./utils/drawChart/drawTopChart/drawTopChart";
import { drawBottomChart } from "./utils/drawChart/drawBottomChart/drawBottomChart";
import { useDispatch, useSelector } from "react-redux";
import { increaseDomain } from "../../../actions";
import { RootState } from "../../../reducers";

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
  const [offsetLeft, setOffsetLeft] = useState(0);

  // convert data to required format
  const convertedData = convertStockDataForChart(stockData);

  const fullDatesDomain = getFullDatesDomain(stockData);
  const fullStocksDomain = getFullStockDomain(stockData);

  const state = useSelector((state: RootState) => state.visibleDatesDomain);
  const dispatch = useDispatch();
  // determine latest date

  //on page load set svg height
  useEffect(() => {
    const { current } = parentRef;
    if (current) {
      setWidth(current.offsetWidth);
      setOffsetLeft(current.offsetLeft);

      // add resize listener
      window.addEventListener("resize", () => {
        setWidth(current.offsetWidth);
        setOffsetLeft(current.offsetLeft);
      });
      return () => {
        window.removeEventListener("resize", () => {
          setWidth(current.offsetWidth);
          setOffsetLeft(current.offsetLeft);
        });
      };
    }
  }, [parentRef]);

  // each time time period button is clicked transition lines
  useEffect(() => {
    const topChartGroup = select<SVGSVGElement, unknown>(
      `#top-chart-group-${companyName}`
    );
    const bottomChartGroup = select<SVGSVGElement, unknown>(
      `#bottom-chart-group-${companyName}`
    );
    const xAxisGroup = topChartGroup.select<SVGSVGElement>(
      `#x-axis-${companyName}`
    );
    const yAxisGroup = topChartGroup.select<SVGSVGElement>(
      `#y-axis-${companyName}`
    );
    const linesGroup = topChartGroup.select<SVGSVGElement>(
      `#lines-${companyName}`
    );
    const areaGroup = topChartGroup.select<SVGSVGElement>(
      `#area-${companyName}`
    );

    // determine latest date
    const latestDate = stockData.slice(-1)[0].date;

    // calculate dates domain based on activeTimeLabelObject (the time button which is clicked e.g 1W, 1M ...)
    const activeDatesDomain = getActiveDatesDomain(
      stockData,
      latestDate,
      activeTimeLabelObject
    );

    // setVisibleDatesDomain(activeDatesDomain);

    // calculate stocks domain for y axis scaling
    const activeStocksDomain = getActiveMinMaxStock(
      stockData,
      latestDate,
      activeTimeLabelObject.timescale
    );

    // define x axis scale
    const x = xAxisScale(activeDatesDomain, width);
    const y = scaleLinear();

    // define x axis
    const xAxis = axisBottom(x).tickSize(0);
    const yAxis = axisLeft(y).tickSize(-width).ticks(5);

    // draw lines
    drawTopChart(
      xAxisGroup,
      yAxisGroup,
      linesGroup,
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
      topChartGroup
    );

    drawBottomChart(
      companyName,
      stockData,
      width,
      bottomChartGroup,
      fullDatesDomain,
      fullStocksDomain,
      convertedData,
      x,
      xAxisGroup,
      xAxis,
      linesGroup,
      y,
      yAxisGroup,
      yAxis,
      activeDatesDomain,
      areaGroup,
      offsetLeft
    );
  });

  return (
    <div className="w-full" ref={parentRef}>
      <svg
        width="100%"
        height={svgHeight}
        id={`chart-svg-${companyName}`}
        pointerEvents="all"
      >
        <clipPath id="area-crop-left" pointerEvents="all">
          <rect height={svgHeight - margin * 2} rx="4" ry="4" fill="red"></rect>
        </clipPath>
        <defs>
          {stockKeys.map((stockKey, i) => (
            <LinearGradient
              gradientId={stockKey + "-top"}
              gradientColor={supernovaColors[i]}
              isTopChart
              chartHeight={topChartHeight}
            />
          ))}
          {stockKeys.map((stockKey, i) => (
            <LinearGradient
              gradientId={stockKey + "-bottom"}
              gradientColor={supernovaColors[i]}
              chartHeight={bottomChartHeight}
            />
          ))}
        </defs>
        <g
          id={`top-chart-group-${companyName}`}
          height={topChartHeight}
          transform={`translate(0,${margin})`}
        >
          <g id={`x-axis-${companyName}`} className="opacity-80"></g>
          <g id={`y-axis-${companyName}`} className="opacity-80"></g>
          <g id={`area-${companyName}`}></g>
          <g id={`lines-${companyName}`}></g>
          <g id={`focus-${companyName}`}>
            <line></line>
            <rect></rect>
          </g>
        </g>
        <g
          id={`bottom-chart-group-${companyName}`}
          transform={`translate(0,${topChartHeight + margin * 2})`}
        >
          <rect
            width="100%"
            height={bottomChartHeight}
            fill={chartBackgroudColor}
          ></rect>
          <g id={`x-axis-${companyName}`} className="opacity-80"></g>
          <g id={`y-axis-${companyName}`} className="opacity-80"></g>
          <g id={`area-${companyName}`} clipPath="url(#area-crop-left)"></g>
          <g id={`lines-${companyName}`}></g>
          <g id={`brush-${companyName}`}></g>
        </g>
      </svg>

      <button
        onClick={() => {
          dispatch(increaseDomain());
          console.log(state);
        }}
      >
        Increse
      </button>
    </div>
  );
};
