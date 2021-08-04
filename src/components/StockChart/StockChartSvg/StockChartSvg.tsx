import { useEffect, useRef, useState } from "react";
import { StockData, StockKey } from "../../../types";
import * as d3 from "d3";
import { easeExp } from "d3";

interface Props {
  stockData: StockData[];
  stockKeys: StockKey[];
  isMonth: boolean;
}

const margin = 20;

const xAxisScale = (datesDomain: number[], width: number) => {
  return d3.scaleTime().domain(datesDomain).range([0, width]);
};

export const StockChartSvg = ({ stockData, stockKeys, isMonth }: Props) => {
  const parentRef = useRef<HTMLInputElement>(null);

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (parentRef.current) {
      setWidth(parentRef.current.offsetWidth);
      setHeight(parentRef.current.offsetHeight - 20);
    }
  }, [parentRef]);

  console.log(width);

  useEffect(() => {
    if (width > 0) {
      const xAxisGroup = d3.select("#x-axis");

      const dates = stockData.map((x) => x.date);
      const datesDomain = [
        Math.min.apply(null, dates),
        Math.max.apply(null, dates),
      ];

      // define x axis scale
      const x = xAxisScale(datesDomain, width);

      // define x axis
      const xAxis = d3.axisBottom(x);

      // determine tick marks based on axis state
      isMonth
        ? xAxis.ticks(d3.timeWeek.every(1)).tickSize(0)
        : xAxis.ticks(d3.timeYear.every(1)).tickSize(0);

      const drawAxis = () => {
        // reset axis domain
        x.domain(datesDomain).range([0, width]);

        // transition x axis
        xAxisGroup
          .attr("transform", `translate(0, ${height - margin})`)
          .transition()
          .ease(easeExp)
          .duration(1000)
          .call(xAxis as any)
          .on("start", () => {
            xAxisGroup.select(".domain").remove();
          });
      };

      drawAxis();
    }
  }, [stockData, width, height, isMonth]);

  return (
    <div className="h-80 w-full" id="stock-chart" ref={parentRef}>
      <svg width="100%" height="100%">
        <g className="chart-group" style={{ transform: "translate(0,10)" }}></g>
        <g id="x-axis"></g>
      </svg>
    </div>
  );
};
